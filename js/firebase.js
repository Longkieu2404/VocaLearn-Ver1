// ===== FIREBASE MODULE =====
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyBnM_4SgFek2PdjKAIWj0sXWnrhz5PzYQ0",
  authDomain:        "vocalearn-3a4f2.firebaseapp.com",
  projectId:         "vocalearn-3a4f2",
  storageBucket:     "vocalearn-3a4f2.firebasestorage.app",
  messagingSenderId: "904250085974",
  appId:             "1:904250085974:web:28d08a71893526486521f7",
  measurementId:     "G-8PEK5H6Z71"
};

import { initializeApp }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, GoogleAuthProvider,
  signInWithPopup, signInWithRedirect, getRedirectResult,
  signOut, onAuthStateChanged, setPersistence, browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc, getDoc, setDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app  = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

// setPersistence phải hoàn thành TRƯỚC khi gọi signInWithPopup/Redirect
// Lưu promise để signIn() có thể await nó
const _persistenceReady = setPersistence(auth, browserLocalPersistence).catch(e =>
  console.warn('[VocaLearn] setPersistence lỗi (dùng default):', e)
);

// ── Firestore: dùng getFirestore() không có persistent cache ─────────────────
// persistentLocalCache gây lỗi "already initialized" và các lỗi IndexedDB trên mobile.
// getFirestore() đơn giản, stable, hoạt động tốt trên mọi platform.
const db = getFirestore(app);

// ===== AUTH =====
const FirebaseAuth = {
  provider: new GoogleAuthProvider(),

  // Chỉ Safari iOS mới thực sự block popup — Chrome Android không cần redirect
  _isSafariIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent) &&
           /Safari/i.test(navigator.userAgent) &&
           !/Chrome|CriOS|FxiOS/i.test(navigator.userAgent);
  },

  async signIn() {
    try {
      // Đảm bảo setPersistence đã xong trước khi gọi bất kỳ auth operation nào
      await _persistenceReady;
      if (this._isSafariIOS()) {
        localStorage.setItem('vocalearn_pending_redirect', '1');
        await signInWithRedirect(auth, this.provider);
        return null;
      } else {
        const result = await signInWithPopup(auth, this.provider);
        return result.user;
      }
    } catch (e) {
      localStorage.removeItem('vocalearn_pending_redirect');
      console.error("[VocaLearn] Đăng nhập thất bại:", e);
      return null;
    }
  },

  async handleRedirectResult() {
    try {
      await _persistenceReady;
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        console.log('[VocaLearn] Redirect sign-in OK:', result.user.email);
        localStorage.setItem('vocalearn_auth_mode', 'google');
        localStorage.removeItem('vocalearn_pending_redirect');
        return result.user;
      }
    } catch (e) {
      console.error('[VocaLearn] getRedirectResult lỗi:', e);
    }
    localStorage.removeItem('vocalearn_pending_redirect');
    return null;
  },

  async signOut() { await signOut(auth); },
  getUser()       { return auth.currentUser; },
  onStateChange(cb) { return onAuthStateChanged(auth, cb); }
};

// ===== FIRESTORE SYNC =====
const FirebaseSync = {
  _saveTimer:               null,
  _isSyncing:               false,
  _isPulling:               false,
  _unsubSnapshot:           null,
  _isOnline:                navigator.onLine,
  _hasPendingOfflineWrites: false,
  _pullCompletedAt:         0,
  GUARD_MS:                 4000,
  _pullPromise:             null,

  _userDocRef() {
    const user = auth.currentUser;
    if (!user) return null;
    return doc(db, "users", user.uid);
  },

  _applyToLocal(data) {
    if (data.sets         !== undefined) localStorage.setItem('vocalearn_sets',          JSON.stringify(data.sets));
    if (data.progress     !== undefined) localStorage.setItem('vocalearn_progress',      JSON.stringify(data.progress));
    if (data.stats        !== undefined) localStorage.setItem('vocalearn_stats',         JSON.stringify(data.stats));
    if (data.streak       !== undefined) localStorage.setItem('vocalearn_streak',        JSON.stringify(data.streak));
    if (data.username     !== undefined) localStorage.setItem('vocalearn_username',      data.username);
    if (data.trash        !== undefined) localStorage.setItem('vocalearn_trash',         JSON.stringify(data.trash));
    if (data.chatSessions !== undefined) localStorage.setItem('vocalearn_chat_sessions', JSON.stringify(data.chatSessions));
    if (data.geminiKey    !== undefined) localStorage.setItem('vocalearn_gemini_key',    data.geminiKey);
    if (data.sampleThumbs !== undefined) localStorage.setItem('vocalearn_sample_thumbs', JSON.stringify(data.sampleThumbs));
  },

  _clearLocal() {
    localStorage.setItem('vocalearn_sets',     JSON.stringify([]));
    localStorage.setItem('vocalearn_progress', JSON.stringify({}));
    localStorage.setItem('vocalearn_stats',    JSON.stringify({ daily: {}, dailyCards: {}, sessions: [] }));
    localStorage.setItem('vocalearn_streak',   JSON.stringify({ count: 0, lastDate: null }));
    localStorage.setItem('vocalearn_sample_thumbs', JSON.stringify({}));
    localStorage.removeItem('vocalearn_trash');
    localStorage.removeItem('vocalearn_username');
    localStorage.removeItem('vocalearn_chat_sessions');
    localStorage.removeItem('vocalearn_gemini_key');
    localStorage.removeItem('vocalearn_gemini_models');
  },

  _rerender() {
    if (typeof renderHome       === 'function') renderHome();
    if (typeof updateStreak     === 'function') updateStreak();
    if (typeof updateTrashBadge === 'function') updateTrashBadge();
    const pageSets = document.getElementById('page-sets');
    if (pageSets && pageSets.classList.contains('active')) {
      if (typeof renderSetsPage === 'function') renderSetsPage();
    }
  },

  startListening() {
    this.stopListening();
    const ref = this._userDocRef();
    if (!ref) return;

    this._unsubSnapshot = onSnapshot(ref, snap => {
      if (this._isPulling) return;
      if (!snap.exists()) return;
      if (Date.now() - this._pullCompletedAt < this.GUARD_MS) return;
      if (this._hasPendingOfflineWrites) return;
      if (snap.metadata.fromCache && this._isOnline) return;
      if (snap.metadata.hasPendingWrites) return;

      this._applyToLocal(snap.data());
      this._updateStatus('synced');
      this._rerender();
    }, err => {
      if (err.code === 'unavailable') this._updateStatus('offline');
      else { console.error("Listener lỗi:", err); this._updateStatus('error'); }
    });
  },

  stopListening() {
    if (this._unsubSnapshot) { this._unsubSnapshot(); this._unsubSnapshot = null; }
    clearTimeout(this._saveTimer);
  },

  pull() {
    if (this._pullPromise) return this._pullPromise;
    this._pullPromise = this._doPull().finally(() => { this._pullPromise = null; });
    return this._pullPromise;
  },

  async _doPull() {
    const ref  = this._userDocRef();
    const user = auth.currentUser;
    if (!ref || !user) return false;

    this.stopListening();
    this._isPulling = true;

    try {
      this._updateStatus('syncing');

      const ownerUid        = localStorage.getItem('vocalearn_owner_uid');
      const loggedOutUid    = localStorage.getItem('vocalearn_logged_out_uid');
      const isNewUser       = !ownerUid && !loggedOutUid;
      const isAccountSwitch = !!(
        (ownerUid && ownerUid !== user.uid) ||
        (loggedOutUid && loggedOutUid !== user.uid)
      );

      // Nếu đổi tài khoản: xóa sạch local + reset pending flag TRƯỚC KHI làm gì khác
      if (isAccountSwitch) {
        this._clearLocal();
        this._hasPendingOfflineWrites = false;
        clearTimeout(this._saveTimer);
        localStorage.removeItem('vocalearn_logged_out_uid');
      } else if (loggedOutUid && loggedOutUid === user.uid) {
        // Cùng tài khoản đăng nhập lại — xóa flag
        localStorage.removeItem('vocalearn_logged_out_uid');
      }

      // Ghi nhận owner sau khi đã xử lý switch
      localStorage.setItem('vocalearn_owner_uid', user.uid);

      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // Tài khoản mới hoàn toàn trên Firestore
        if (isNewUser && Storage.getSets().length > 0) {
          // Lần đầu đăng nhập trên thiết bị này có data local → push lên
          await this._rawPush();
        }
        // Nếu isAccountSwitch thì đã clear rồi, không push gì cả
        return true;
      }

      const srv = snap.data();

      // Luôn ưu tiên pull data từ server về
      this._applyToLocal(srv);
      if (srv.updatedAt) {
        localStorage.setItem('vocalearn_local_updatedAt', srv.updatedAt.toMillis().toString());
      }

      // Nếu là lần đầu đăng nhập trên thiết bị (chưa từng có owner_uid):
      // merge thêm các bộ thẻ local mà server chưa có (không ghi đè server)
      if (isNewUser) {
        const localSets = JSON.parse(localStorage.getItem('_pre_pull_sets') || '[]');
        if (localSets.length > 0) {
          const srvIds   = new Set((srv.sets || []).map(s => s.id));
          const onlyLocal = localSets.filter(s => !srvIds.has(s.id));
          if (onlyLocal.length > 0) {
            const merged = [...(srv.sets || []), ...onlyLocal];
            localStorage.setItem('vocalearn_sets', JSON.stringify(merged));
            await this._rawPush();
          }
        }
      }

      // Nếu có pending offline writes của CÙNG tài khoản → push lên
      if (!isAccountSwitch && this._hasPendingOfflineWrites) {
        await this._rawPush();
      }

      return true;

    } catch (e) {
      console.error('[VocaLearn] Lỗi pull:', e);
      this._updateStatus('offline');
      return true;
    } finally {
      this._isPulling       = false;
      this._pullCompletedAt = Date.now();
      this._updateStatus('synced');
      window._firebaseDataLoaded = true;
      if (typeof checkStreakExpiry === 'function') checkStreakExpiry();
      window._firebaseDataLoaded = false;
      localStorage.removeItem('_pre_pull_sets');
      setTimeout(() => this.startListening(), 500);
    }
  },

  async _rawPush() {
    const ref = this._userDocRef();
    if (!ref || this._isSyncing) return false;
    this._isSyncing = true;
    try {
      await setDoc(ref, {
        sets:         Storage.getSets(),
        progress:     Storage.getProgress(),
        stats:        Storage.getStats(),
        streak:       Storage.getStreak(),
        trash:        Trash.getAll(),
        username:     localStorage.getItem('vocalearn_username')                || '',
        chatSessions: JSON.parse(localStorage.getItem('vocalearn_chat_sessions') || '[]'),
        geminiKey:    localStorage.getItem('vocalearn_gemini_key')              || '',
        sampleThumbs: Storage.getSampleThumbs(),
        updatedAt:    serverTimestamp(),
        version:      3
      }, { merge: true });
      this._hasPendingOfflineWrites = false;
      this._pullCompletedAt = Date.now() - (this.GUARD_MS - 1500);
      localStorage.setItem('vocalearn_local_updatedAt', Date.now().toString());
      return true;
    } catch (e) {
      console.error('[VocaLearn] Lỗi push:', e);
      return false;
    } finally {
      this._isSyncing = false;
    }
  },

  async push() {
    const ok = await this._rawPush();
    this._updateStatus(ok ? 'synced' : 'offline');
    return ok;
  },

  triggerSave() {
    if (!auth.currentUser) return;
    this._hasPendingOfflineWrites = true;
    this._updateStatus(this._isOnline ? 'pending' : 'offline');
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => this.push(), 2000);
  },

  _updateStatus(state) {
    const el = document.getElementById('autosaveStatus');
    if (!el) return;
    
  }
};

// ===== THUMBNAIL — lưu base64 thẳng vào Firestore qua sync thông thường =====
// Firebase Storage không dùng (yêu cầu gói Blaze).
// customThumb (base64 JPEG ~20-40KB) được lưu trong trường sets[] của Firestore document,
// đồng bộ tự động cùng với toàn bộ dữ liệu qua FirebaseSync.triggerSave().
const FirebaseThumb = {
  // Không cần upload riêng — FirebaseSync.triggerSave() sẽ đẩy customThumb lên Firestore
  async upload(setId, dataUrl) { return null; },
  // Không cần xóa riêng — xóa set là đủ
  async delete(setId) { return; }
};

window.FirebaseThumb = FirebaseThumb;

// ===== PATCH Storage & Trash =====
window.FirebaseAuth = FirebaseAuth;
window.FirebaseSync = FirebaseSync;

const _origSaveSets        = Storage.saveSets.bind(Storage);
const _origSaveProgress    = Storage.saveProgress.bind(Storage);
const _origSaveStats       = Storage.saveStats.bind(Storage);
const _origSaveStreak      = Storage.saveStreak.bind(Storage);
const _origSaveSampleThumbs = Storage.saveSampleThumbs.bind(Storage);
const _origTrashSave       = Trash._save.bind(Trash);

Storage.saveSets        = v => { _origSaveSets(v);        FirebaseSync.triggerSave(); };
Storage.saveProgress    = v => { _origSaveProgress(v);    FirebaseSync.triggerSave(); };
Storage.saveStats       = v => { _origSaveStats(v);       FirebaseSync.triggerSave(); };
Storage.saveStreak      = v => { _origSaveStreak(v);      FirebaseSync.triggerSave(); };
Storage.saveSampleThumbs = v => { _origSaveSampleThumbs(v); FirebaseSync.triggerSave(); };
Trash._save              = v => { _origTrashSave(v);       FirebaseSync.triggerSave(); };

// ===== NETWORK RECONNECT =====
window.addEventListener('online', async () => {
  FirebaseSync._isOnline = true;
  FirebaseSync._updateStatus('syncing');
  if (!auth.currentUser) return;
  if (FirebaseSync._hasPendingOfflineWrites) await FirebaseSync.push();
  const ok = await FirebaseSync.pull();
  if (ok) FirebaseSync._rerender();
});

window.addEventListener('offline', () => {
  FirebaseSync._isOnline = false;
  FirebaseSync._updateStatus('offline');
});

// ===== INIT =====
async function _initFirebase() {
  // Xử lý kết quả redirect (mobile) trước khi setupFirebaseUI
  await FirebaseAuth.handleRedirectResult();
  localStorage.removeItem('vocalearn_pending_redirect');
  setupFirebaseUI();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', _initFirebase);
} else {
  _initFirebase();
}