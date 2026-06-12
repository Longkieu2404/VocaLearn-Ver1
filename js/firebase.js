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
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  initializeFirestore, persistentLocalCache, persistentSingleTabManager, persistentMultipleTabManager,
  doc, getDocFromServer, setDoc, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const app  = initializeApp(FIREBASE_CONFIG);
const auth = getAuth(app);

// Mobile browsers (Safari iOS, some Android) có thể lỗi với persistentSingleTabManager
// do giới hạn IndexedDB. Dùng try/catch để fallback về memory cache nếu cần.
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  });
} catch (e) {
  console.warn('[VocaLearn] Firestore persistentCache lỗi, dùng memory cache:', e);
  db = initializeFirestore(app, {});
}

// ===== AUTH =====
const FirebaseAuth = {
  provider: new GoogleAuthProvider(),

  // Detect mobile: dùng redirect thay popup vì popup bị chặn trên Safari iOS & nhiều Android browser
  _isMobile() {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent)); // iPad iOS 13+
  },

  async signIn() {
    try {
      if (this._isMobile()) {
        // Redirect: trang sẽ reload, kết quả xử lý trong getRedirectResult() khi trang load lại
        await signInWithRedirect(auth, this.provider);
        return null; // sẽ không tới đây, page redirect đi
      } else {
        const result = await signInWithPopup(auth, this.provider);
        return result.user;
      }
    } catch (e) {
      console.error("Đăng nhập thất bại:", e);
      return null;
    }
  },

  // Gọi khi app khởi động để lấy kết quả redirect từ lần đăng nhập trước (mobile)
  async handleRedirectResult() {
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        console.log('[VocaLearn] Redirect sign-in thành công:', result.user.email);
        return result.user;
      }
    } catch (e) {
      console.error('[VocaLearn] getRedirectResult lỗi:', e);
    }
    return null;
  },

  async signOut() { await signOut(auth); },

  getUser() { return auth.currentUser; },

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
  // Sau pull(), chặn listener GUARD_MS ms để tránh echo Firestore ghi đè data đúng
  _pullCompletedAt:         0,
  GUARD_MS:                 4000,
  // Chống pull() chạy song song (onAuthStateChanged có thể bắn nhiều lần)
  _pullPromise:             null,

  _userDocRef() {
    const user = auth.currentUser;
    if (!user) return null;
    return doc(db, "users", user.uid);
  },

  // Ghi thẳng server data vào localStorage, không merge
  _applyToLocal(data) {
    if (data.sets         !== undefined) localStorage.setItem('vocalearn_sets',          JSON.stringify(data.sets));
    if (data.progress     !== undefined) localStorage.setItem('vocalearn_progress',      JSON.stringify(data.progress));
    if (data.stats        !== undefined) localStorage.setItem('vocalearn_stats',         JSON.stringify(data.stats));
    if (data.streak       !== undefined) localStorage.setItem('vocalearn_streak',        JSON.stringify(data.streak));
    if (data.username     !== undefined) localStorage.setItem('vocalearn_username',      data.username);
    if (data.trash        !== undefined) localStorage.setItem('vocalearn_trash',         JSON.stringify(data.trash));
    if (data.chatSessions !== undefined) localStorage.setItem('vocalearn_chat_sessions', JSON.stringify(data.chatSessions));
    if (data.geminiKey    !== undefined) localStorage.setItem('vocalearn_gemini_key',    data.geminiKey);
  },

  _clearLocal() {
    localStorage.setItem('vocalearn_sets',     JSON.stringify([]));
    localStorage.setItem('vocalearn_progress', JSON.stringify({}));
    localStorage.setItem('vocalearn_stats',    JSON.stringify({ daily: {}, dailyCards: {}, sessions: [] }));
    localStorage.setItem('vocalearn_streak',   JSON.stringify({ count: 0, lastDate: null }));
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

  _rebuildStreak(daily) {
    const toStr = d => d.getFullYear() + '-' +
      String(d.getMonth()+1).padStart(2,'0') + '-' +
      String(d.getDate()).padStart(2,'0');
    let d = new Date(), count = 0;
    while (daily[toStr(d)] > 0) { count++; d.setDate(d.getDate()-1); }
    if (count > 0) return { count, lastDate: toStr(new Date()) };
    d = new Date(); d.setDate(d.getDate()-1);
    while (daily[toStr(d)] > 0) { count++; d.setDate(d.getDate()-1); }
    return { count, lastDate: count > 0 ? toStr(new Date(Date.now()-86400000)) : null };
  },

  // ── Real-time listener ────────────────────────────────────────────────────
  startListening() {
    this.stopListening();
    const ref = this._userDocRef();
    if (!ref) return;

    this._unsubSnapshot = onSnapshot(ref, snap => {
      if (this._isPulling) return;
      if (!snap.exists()) return;
      // Chặn echo ngay sau pull
      if (Date.now() - this._pullCompletedAt < this.GUARD_MS) return;
      // Có pending offline writes → không cho server ghi đè
      if (this._hasPendingOfflineWrites) return;
      // Bỏ qua Firestore local cache khi online
      if (snap.metadata.fromCache && this._isOnline) return;
      // Bỏ qua write pending của chính mình
      if (snap.metadata.hasPendingWrites) return;

      // Đây là update thật từ thiết bị khác
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

  // ── pull(): public — chống chạy song song ────────────────────────────────
  pull() {
    if (this._pullPromise) return this._pullPromise;
    this._pullPromise = this._doPull().finally(() => { this._pullPromise = null; });
    return this._pullPromise;
  },

  // ── _doPull(): toàn bộ logic sync khi đăng nhập ──────────────────────────
  async _doPull() {
    const ref  = this._userDocRef();
    const user = auth.currentUser;
    if (!ref || !user) return false;

    this.stopListening();
    this._isPulling = true;

    try {
      this._updateStatus('syncing');

      const ownerUid           = localStorage.getItem('vocalearn_owner_uid');
      const isFirstOnDevice    = !ownerUid;
      const belongsToOtherUser = !!(ownerUid && ownerUid !== user.uid);

      // Trước khi làm gì, lưu local sets gốc (dùng cho merge sau nếu cần)
      const localSetsBeforePull    = Storage.getSets();
      const localProgressBeforePull = Storage.getProgress();

      // Nếu thiết bị của người dùng khác → xóa local
      if (belongsToOtherUser) {
        this._clearLocal();
      }

      // Đánh dấu owner
      localStorage.setItem('vocalearn_owner_uid', user.uid);

      // Lấy data từ server thật (không dùng Firestore IndexedDB cache)
      const snap = await getDocFromServer(ref);

      if (!snap.exists()) {
        // Tài khoản chưa có data trên server → đẩy local lên nếu có
        if (localSetsBeforePull.length > 0) await this._rawPush();
        return true;
      }

      const srv = snap.data();

      // ── Lần đầu đăng nhập trên thiết bị này (tài khoản cũ có data server) ──
      if (isFirstOnDevice || belongsToOtherUser) {
        // Luôn ưu tiên server data cho sets, progress, streak, stats, v.v.
        this._applyToLocal(srv);

        // Nếu trước pull có sets local (người dùng tạo trước khi đăng nhập)
        // → merge thêm vào mà không làm mất server data
        if (localSetsBeforePull.length > 0 && !belongsToOtherUser) {
          const srvIds    = new Set((srv.sets || []).map(s => s.id));
          const onlyLocal = localSetsBeforePull.filter(s => !srvIds.has(s.id));
          if (onlyLocal.length > 0) {
            const merged = [...(srv.sets || []), ...onlyLocal];
            localStorage.setItem('vocalearn_sets', JSON.stringify(merged));
            // Merge progress: server thắng, bổ sung local những key chưa có
            const mergedProg = Object.assign({}, localProgressBeforePull, srv.progress || {});
            localStorage.setItem('vocalearn_progress', JSON.stringify(mergedProg));
            // Push merged data lên server
            await this._rawPush();
          }
        }

        return true;
      }

      // ── Thiết bị đã đăng nhập trước ────────────────────────────────────────
      if (this._hasPendingOfflineWrites) {
        // Có thay đổi local chưa sync → so sánh timestamp
        const srvTs    = srv.updatedAt ? srv.updatedAt.toMillis() : 0;
        const localTs  = parseInt(localStorage.getItem('vocalearn_local_updatedAt') || '0');
        if (srvTs > localTs) {
          // Server mới hơn → apply server data trước, rồi push local sets mới tạo offline lên
          const localSets  = Storage.getSets();
          const srvSetIds  = new Set((srv.sets || []).map(s => s.id));
          const onlyLocal  = localSets.filter(s => !srvSetIds.has(s.id));
          this._applyToLocal(srv);
          if (onlyLocal.length > 0) {
            const merged = [...(srv.sets || []), ...onlyLocal];
            localStorage.setItem('vocalearn_sets', JSON.stringify(merged));
          }
        }
        // Dù server mới hơn hay không, vẫn push để đảm bảo data local được lưu
        await this._rawPush();
      } else {
        // Bình thường: kéo data mới nhất từ server về
        this._applyToLocal(srv);
        if (srv.updatedAt) {
          localStorage.setItem('vocalearn_local_updatedAt', srv.updatedAt.toMillis().toString());
        }
      }

      return true;

    } catch (e) {
      console.error('[VocaLearn] Lỗi pull:', e);
      this._updateStatus('offline');
      return true;
    } finally {
      this._isPulling    = false;
      this._pullCompletedAt = Date.now();
      this._updateStatus('synced');
      window._firebaseDataLoaded = true;
      if (typeof checkStreakExpiry === 'function') checkStreakExpiry();
      window._firebaseDataLoaded = false;
      setTimeout(() => this.startListening(), 500);
    }
  },

  // ── _rawPush(): push trực tiếp, KHÔNG qua Storage patch ──────────────────
  // (Storage patch sẽ gọi triggerSave() → vòng lặp)
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
        updatedAt:    serverTimestamp(),
        version:      3
      }, { merge: true });
      this._hasPendingOfflineWrites = false;
      // Giữ guard ngắn 1.5s để tránh echo chính mình, sau đó listener nhận update từ thiết bị khác
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

  // push() công khai — dùng bởi nút Sync và triggerSave
  async push() {
    const ok = await this._rawPush();
    this._updateStatus(ok ? 'synced' : 'offline');
    return ok;
  },

  // Debounce save khi người dùng thay đổi data
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
    const map = {
      off:     { icon: '☁️', text: 'Chưa đăng nhập',             cls: '' },
      offline: { icon: '📴', text: 'Offline — sync khi có mạng', cls: 'autosave-pending' },
      pending: { icon: '⏳', text: 'Đang chờ đồng bộ...',        cls: 'autosave-pending' },
      syncing: { icon: '🔄', text: 'Đang đồng bộ...',            cls: 'autosave-pending' },
      synced:  { icon: '✅', text: 'Đã đồng bộ Firebase',        cls: 'autosave-ok'      },
      error:   { icon: '❌', text: 'Lỗi đồng bộ',                cls: 'autosave-err'     }
    };
    const s = map[state] || map.off;
    el.innerHTML = `<span>${s.icon}</span><span>${s.text}</span>`;
    el.className = 'autosave-status ' + s.cls;
  }
};

// ===== PATCH Storage & Trash để tự động triggerSave =====
window.FirebaseAuth = FirebaseAuth;
window.FirebaseSync = FirebaseSync;

const _origSaveSets     = Storage.saveSets.bind(Storage);
const _origSaveProgress = Storage.saveProgress.bind(Storage);
const _origSaveStats    = Storage.saveStats.bind(Storage);
const _origSaveStreak   = Storage.saveStreak.bind(Storage);
const _origTrashSave    = Trash._save.bind(Trash);

Storage.saveSets     = v => { _origSaveSets(v);     FirebaseSync.triggerSave(); };
Storage.saveProgress = v => { _origSaveProgress(v); FirebaseSync.triggerSave(); };
Storage.saveStats    = v => { _origSaveStats(v);    FirebaseSync.triggerSave(); };
Storage.saveStreak   = v => { _origSaveStreak(v);   FirebaseSync.triggerSave(); };
Trash._save          = v => { _origTrashSave(v);    FirebaseSync.triggerSave(); };

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

// Gọi setupFirebaseUI sau khi DOM sẵn sàng
// handleRedirectResult() phải được gọi TRƯỚC để xử lý kết quả đăng nhập redirect trên mobile
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    await FirebaseAuth.handleRedirectResult();
    setupFirebaseUI();
  });
} else {
  (async () => {
    await FirebaseAuth.handleRedirectResult();
    setupFirebaseUI();
  })();
}