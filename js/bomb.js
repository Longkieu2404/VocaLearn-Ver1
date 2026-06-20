// ===== WORD BOMB GAME =====
// AI tạo câu ngữ cảnh có 1 từ bị ẩn → người chơi điền đúng trước khi bom nổ

// ---- CONFIG ----
const BOMB_MODELS = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];
let   BOMB_BASE_TIME = 60;       // giây mỗi câu — do người dùng chọn (30/60/90/120)
const BOMB_MIN_TIME  = 6;        // tối thiểu 6 giây (khi streak cao)
const BOMB_STREAK_BONUS = 50;    // điểm thưởng streak
const BOMB_BASE_SCORE   = 100;   // điểm cơ bản mỗi câu đúng

// Lựa chọn thời gian đang active
let _bombSelectedTime = 60;

function _bombSelectTime(sec) {
  _bombSelectedTime = sec;
  BOMB_BASE_TIME    = sec;
  document.querySelectorAll('.bomb-time-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.time) === sec);
  });
}

// ---- STATE ----
let bombCards       = [];
let bombIndex       = 0;
let bombTotalScore  = 0;
let bombStreak      = 0;
let bombMaxStreak   = 0;
let bombResults     = [];
let bombWordCount   = 10;
let bombTimerSec    = BOMB_BASE_TIME;
let bombTimerInterval = null;
let bombAnswered    = false;
let bombGenerating  = false;
let bombCurrentSentence = '';
let bombCurrentWord     = '';
let bombCurrentMeaning  = '';

// ---- FIREWORKS (reuse pattern from detective) ----
let _bfwCanvas, _bfwCtx, _bfwParticles = [], _bfwRaf;

function _bfwStart(duration = 3000) {
  if (_bfwCanvas) _bfwCanvas.remove();
  _bfwCanvas = document.createElement('canvas');
  Object.assign(_bfwCanvas.style, {
    position:'fixed', top:0, left:0, width:'100%', height:'100%',
    pointerEvents:'none', zIndex:9999
  });
  document.body.appendChild(_bfwCanvas);
  _bfwCtx = _bfwCanvas.getContext('2d');
  _bfwCanvas.width  = window.innerWidth;
  _bfwCanvas.height = window.innerHeight;
  _bfwParticles = [];
  _bfwBurst(); setTimeout(_bfwBurst, 500); setTimeout(_bfwBurst, 1100);
  _bfwLoop();
  setTimeout(() => {
    cancelAnimationFrame(_bfwRaf);
    if (_bfwCanvas) { _bfwCanvas.remove(); _bfwCanvas = null; }
  }, duration);
}

function _bfwBurst() {
  if (!_bfwCanvas) return;
  const x = 0.2 + Math.random() * 0.6, y = 0.15 + Math.random() * 0.4;
  const hue = Math.random() * 360;
  for (let i = 0; i < 60; i++) {
    const angle = (Math.PI * 2 * i) / 60;
    const speed = 2 + Math.random() * 5;
    _bfwParticles.push({
      x: _bfwCanvas.width * x, y: _bfwCanvas.height * y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 1, decay: 0.013 + Math.random() * 0.012,
      radius: 2 + Math.random() * 3,
      color: `hsl(${hue + Math.random()*40},90%,65%)`
    });
  }
}

function _bfwLoop() {
  if (!_bfwCtx) return;
  _bfwCtx.clearRect(0, 0, _bfwCanvas.width, _bfwCanvas.height);
  _bfwParticles = _bfwParticles.filter(p => p.life > 0.05);
  _bfwParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life -= p.decay;
    _bfwCtx.save();
    _bfwCtx.globalAlpha = p.life;
    _bfwCtx.fillStyle = p.color;
    _bfwCtx.beginPath();
    _bfwCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    _bfwCtx.fill();
    _bfwCtx.restore();
  });
  _bfwRaf = requestAnimationFrame(_bfwLoop);
}

// ---- BOMB EXPLODE ANIMATION ----
function _bombShakeScreen() {
  document.getElementById('bombSession')?.classList.add('bomb-shake');
  setTimeout(() => document.getElementById('bombSession')?.classList.remove('bomb-shake'), 600);
}

// ---- INIT FROM HUB ----
function startBombFromHub() {
  const apiKey = localStorage.getItem('vocalearn_gemini_key');
  if (!apiKey) {
    showNotif(
      'Trò chơi này cần <strong>Gemini API Key</strong>.<br>' +
      '<a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--accent5)">Lấy miễn phí tại đây →</a><br>' +
      'Sau đó nhập key trong phần <strong>Trợ lý AI</strong> ở sidebar.',
      '🔑'
    );
    return;
  }

  const allSets  = getAllSets();
  const progress = Storage.getProgress();
  let pool = [];
  allSets.forEach(s => {
    s.cards.forEach(c => {
      const st = SR.getStatus(c.id, progress);
      if (st === 'learning' || st === 'mastered') pool.push({ ...c, _setName: s.name });
    });
  });

  if (pool.length < 5) {
    showNotif(t('bomb.needWords'), '⚠️');
    return;
  }

  // Populate word count selector
  const countSel = document.getElementById('bombWordCount');
  if (countSel) {
    countSel.innerHTML = '';
    [5, 8, 10, 15].forEach(n => {
      if (n <= pool.length) {
        const o = document.createElement('option');
        o.value = n; o.textContent = tf('bomb.wordUnit', { n });
        if (n === 10) o.selected = true;
        countSel.appendChild(o);
      }
    });
  }

  const infoEl = document.getElementById('bombConfigInfo');
  if (infoEl) infoEl.textContent = tf('bomb.poolInfo', { n: pool.length });

  window._bombPool = pool;
  _bombSelectTime(_bombSelectedTime); // đảm bảo UI đúng với lựa chọn hiện tại
  _bombShowSection('config');
  document.body.classList.add('game-fullscreen');
}

// ---- START GAME ----
function _bombStartGame() {
  bombWordCount = parseInt(document.getElementById('bombWordCount')?.value) || 10;
  BOMB_BASE_TIME = _bombSelectedTime; // áp dụng thời gian người dùng chọn

  const pool = shuffle([...(window._bombPool || [])]);
  bombCards       = pool.slice(0, bombWordCount);
  bombIndex       = 0;
  bombTotalScore  = 0;
  bombStreak      = 0;
  bombMaxStreak   = 0;
  bombResults     = [];
  _bombNextCache  = null;
  _bombNextPromise = null;

  _bombShowSection('session');
  document.body.classList.add('game-fullscreen', 'game-in-session');

  // Pre-warm model list cache, rồi prefetch câu đầu, rồi load
  const apiKey = localStorage.getItem('vocalearn_gemini_key');
  (apiKey ? GeminiModels.getModels(apiKey).catch(()=>{}) : Promise.resolve())
    .then(() => bombCards[0] ? _bombPrefetch(bombCards[0]) : Promise.resolve())
    .then(() => _bombLoadCard());
}

// ---- LOAD CARD ----
// ---- PRE-GENERATION CACHE ----
// Cache câu AI cho từ tiếp theo để không phải chờ
let _bombNextCache = null;   // { word, result } — kết quả pre-generate
let _bombNextPromise = null; // Promise đang chạy

async function _bombPrefetch(card) {
  if (!card) return;
  const word = (card.term || card.word || '').trim();
  // Tránh fetch lại nếu đã có cache cho từ này
  if (_bombNextCache?.word === word) return;
  _bombNextCache = null;
  try {
    _bombNextPromise = _bombGenerateSentence(card);
    const result = await _bombNextPromise;
    _bombNextCache = { word, result };
  } catch(e) {
    _bombNextCache = null;
  }
  _bombNextPromise = null;
}

async function _bombLoadCard() {
  if (bombIndex >= bombCards.length) { _bombFinish(); return; }

  const card = bombCards[bombIndex];
  bombAnswered   = false;
  bombGenerating = true;

  // UI reset
  const pct = ((bombIndex + 1) / bombCards.length) * 100;
  document.getElementById('bombProgressFill').style.width = pct + '%';
  document.getElementById('bombProgressText').textContent = tf('bomb.progress', { cur: bombIndex + 1, total: bombCards.length });
  const scoreEl = document.getElementById('bombScore');
  if (scoreEl) scoreEl.textContent = bombTotalScore;
  document.getElementById('bombStreakBadge').textContent  = bombStreak >= 2 ? `🔥 ×${bombStreak}` : '';

  document.getElementById('bombSentenceWrap').innerHTML =
    `<div class="bomb-loading">⚡ ${getLang() === 'en' ? 'AI is generating a question...' : 'AI đang tạo câu hỏi...'}</div>`;
  document.getElementById('bombAnswerInput').value       = '';
  document.getElementById('bombAnswerInput').disabled    = true;
  document.getElementById('bombBtnSubmit').disabled      = true;
  document.getElementById('bombFeedback').style.display  = 'none';
  document.getElementById('bombBtnNext').style.display   = 'none';
  document.getElementById('bombMeaning').style.display   = 'none';

  // Tính thời gian
  bombTimerSec = Math.max(BOMB_MIN_TIME, BOMB_BASE_TIME - Math.floor(bombStreak / 3));
  _bombStopTimer();
  _bombUpdateTimerUI(bombTimerSec);

  // Lấy câu: dùng cache nếu có, không thì gọi AI
  try {
    const word = (card.term || card.word || '').trim();
    let sentenceData;
    if (_bombNextCache?.word === word) {
      sentenceData = _bombNextCache.result;
      _bombNextCache = null;
    } else {
      sentenceData = await _bombGenerateSentence(card);
    }

    bombCurrentSentence = sentenceData.sentence;
    bombCurrentWord     = word;
    bombCurrentMeaning  = card.meaning || card.definition || '';

    document.getElementById('bombSentenceWrap').innerHTML =
      `<div class="bomb-sentence">${sentenceData.blanked}</div>`;

    document.getElementById('bombAnswerInput').disabled = false;
    document.getElementById('bombAnswerInput').focus();
    document.getElementById('bombBtnSubmit').disabled   = bombAnswerInput().trim() === '';
    bombGenerating = false;

    // Bắt đầu đếm giờ
    _bombStartTimer();

    // Pre-fetch câu tiếp theo ngầm
    const nextCard = bombCards[bombIndex + 1];
    if (nextCard) setTimeout(() => _bombPrefetch(nextCard), 300);

  } catch (e) {
    bombGenerating = false;
    await showNotif(tf('bomb.aiError', { msg: e.message || t('bomb.aiError').replace('{msg}','') }), '🤖');
    _bombBackToHub();
  }
}

function bombAnswerInput() {
  return document.getElementById('bombAnswerInput')?.value || '';
}

// ---- TIMER ----
function _bombStartTimer() {
  _bombStopTimer();
  let remaining = bombTimerSec;
  _bombUpdateTimerUI(remaining);

  bombTimerInterval = setInterval(() => {
    remaining--;
    _bombUpdateTimerUI(remaining);

    // Màu đỏ khi còn ≤3 giây
    const ring = document.getElementById('bombTimerRing');
    if (ring) {
      ring.style.color = remaining <= 3 ? '#ef4444' : remaining <= 5 ? '#f97316' : 'var(--accent2)';
    }

    if (remaining <= 0) {
      _bombStopTimer();
      _bombTimeUp();
    }
  }, 1000);
}

function _bombStopTimer() {
  if (bombTimerInterval) { clearInterval(bombTimerInterval); bombTimerInterval = null; }
}

function _bombUpdateTimerUI(sec) {
  const el = document.getElementById('bombTimerCount');
  if (el) el.textContent = sec;

  // Vòng tròn SVG
  const circle = document.getElementById('bombTimerCircle');
  if (circle) {
    const total    = bombTimerSec || BOMB_BASE_TIME;
    const pct      = sec / total;
    const circumf  = 2 * Math.PI * 38; // r=38
    circle.style.strokeDasharray  = circumf;
    circle.style.strokeDashoffset = circumf * (1 - pct);
    circle.style.stroke = sec <= 3 ? '#ef4444' : sec <= 5 ? '#f97316' : 'var(--accent2)';
  }
}

function _bombTimeUp() {
  if (bombAnswered) return;
  bombAnswered = true;
  _bombStopTimer();
  bombStreak = 0;  // reset streak
  _bombShakeScreen();
  if (typeof AudioFX !== 'undefined') AudioFX.wrong?.();

  bombResults.push({ word: bombCurrentWord, correct: false, score: 0, timedOut: true });

  const fb = document.getElementById('bombFeedback');
  fb.style.display  = '';
  fb.className      = 'bomb-feedback bomb-feedback-wrong';
  fb.innerHTML      = `<span class="bomb-fb-icon">💥</span><div><strong>${t('bomb.timeOut')}</strong><br>${t('bomb.answer')} <span class="bomb-fb-word">${bombCurrentWord}</span></div>`;

  document.getElementById('bombMeaning').style.display   = '';
  document.getElementById('bombMeaning').textContent     = bombCurrentMeaning;
  document.getElementById('bombAnswerInput').disabled    = true;
  document.getElementById('bombBtnSubmit').disabled      = true;
  document.getElementById('bombStreakBadge').textContent = '';

  const isLast = (bombIndex + 1) >= bombCards.length;
  if (isLast) setTimeout(_bombNextCard, 1800);
  else document.getElementById('bombBtnNext').style.display = '';
}

// ---- SUBMIT ANSWER ----
function _bombSubmitAnswer() {
  if (bombAnswered || bombGenerating) return;
  const answer = bombAnswerInput().trim().toLowerCase();
  if (!answer) return;

  _bombStopTimer();
  bombAnswered = true;

  const correct = _bombFuzzyMatch(answer, bombCurrentWord.toLowerCase());
  const timeLeft = parseInt(document.getElementById('bombTimerCount')?.textContent || '0');
  let pts = 0;

  if (correct) {
    // Điểm = base + bonus tốc độ + bonus streak
    pts = BOMB_BASE_SCORE + timeLeft * 5;
    if (bombStreak >= 2) pts += BOMB_STREAK_BONUS * Math.min(bombStreak, 5);
    bombTotalScore += pts;
    bombStreak++;
    bombMaxStreak = Math.max(bombMaxStreak, bombStreak);
    if (typeof AudioFX !== 'undefined') AudioFX.correct?.();
  } else {
    bombStreak = 0;
    if (typeof AudioFX !== 'undefined') AudioFX.wrong?.();
    _bombShakeScreen();
  }

  bombResults.push({ word: bombCurrentWord, correct, score: pts, timedOut: false });

  document.getElementById('bombScore').textContent       = bombTotalScore;
  document.getElementById('bombStreakBadge').textContent = correct && bombStreak >= 2 ? `🔥 ×${bombStreak}` : '';
  document.getElementById('bombAnswerInput').disabled    = true;
  document.getElementById('bombBtnSubmit').disabled      = true;

  const fb = document.getElementById('bombFeedback');
  fb.style.display = '';
  if (correct) {
    fb.className  = 'bomb-feedback bomb-feedback-correct';
    fb.innerHTML  = `<span class="bomb-fb-icon">✅</span><div><strong>${t('bomb.correct')}</strong> +${pts}đ` +
                    (bombStreak >= 2 ? ` <span style="color:#f97316">🔥 Streak ×${bombStreak}</span>` : '') +
                    `<br><span class="bomb-fb-word">${bombCurrentWord}</span></div>`;
  } else {
    fb.className  = 'bomb-feedback bomb-feedback-wrong';
    fb.innerHTML  = `<span class="bomb-fb-icon">❌</span><div><strong>${t('bomb.wrong')}</strong> ${t('bomb.answer')} <span class="bomb-fb-word">${bombCurrentWord}</span></div>`;
    document.getElementById('bombMeaning').style.display = '';
    document.getElementById('bombMeaning').textContent   = bombCurrentMeaning;
  }

  const isLast = (bombIndex + 1) >= bombCards.length;
  if (isLast) setTimeout(_bombNextCard, 1800);
  else document.getElementById('bombBtnNext').style.display = '';
}

// ---- NEXT ----
function _bombNextCard() {
  bombIndex++;
  _bombLoadCard();
}

// ---- FINISH ----
function _bombFinish() {
  _bombStopTimer();
  document.body.classList.remove('game-in-session');
  _bombShowSection('done');

  const correctCount = bombResults.filter(r => r.correct).length;
  const rate         = correctCount / (bombResults.length || 1);
  const timeouts     = bombResults.filter(r => r.timedOut).length;

  const prev = parseInt(localStorage.getItem('bomb_highscore') || '0');
  if (bombTotalScore > prev) localStorage.setItem('bomb_highscore', bombTotalScore);
  const hi = Math.max(bombTotalScore, prev);

  let resultMsg, resultIcon;
  if (rate >= 0.8)      { resultMsg = t('bomb.excellent'); resultIcon = '🏆'; }
  else if (rate >= 0.5) { resultMsg = t('bomb.good');     resultIcon = '🥈'; }
  else                  { resultMsg = t('bomb.tryHarder'); resultIcon = '💣'; }

  document.getElementById('bombDone').innerHTML = `
    <div class="det-done-wrap">
      <div style="font-size:3.5rem;margin-bottom:0.25rem">${resultIcon}</div>
      <div style="font-size:1.4rem;font-weight:800;margin-bottom:0.25rem">${t('bomb.resultTitle')}</div>
      <div style="font-size:0.9rem;color:var(--text3);margin-bottom:1.25rem">${resultMsg}</div>
      <div class="det-done-stats">
        <div class="det-done-stat">
          <div class="det-done-stat-val" style="color:var(--accent2)">${bombTotalScore}</div>
          <div class="det-done-stat-label">${t('bomb.totalScore')}</div>
        </div>
        <div class="det-done-stat">
          <div class="det-done-stat-val" style="color:#60a5fa">${hi}</div>
          <div class="det-done-stat-label">${t('bomb.highScore')}</div>
        </div>
        <div class="det-done-stat">
          <div class="det-done-stat-val">${correctCount}/${bombResults.length}</div>
          <div class="det-done-stat-label">${t('bomb.correct2')}</div>
        </div>
        <div class="det-done-stat">
          <div class="det-done-stat-val" style="color:#f97316">${bombMaxStreak}</div>
          <div class="det-done-stat-label">${t('bomb.maxStreak')}</div>
        </div>
      </div>
      <div class="det-done-results">
        ${bombResults.map(r => `
          <div class="det-done-row ${r.correct ? 'det-done-correct' : 'det-done-wrong'}">
            <span class="det-done-row-icon">${r.correct ? '✅' : r.timedOut ? '💥' : '❌'}</span>
            <span class="det-done-row-word">${r.word}</span>
            <span class="det-done-row-hints">${r.timedOut ? t('bomb.statusTimeout') : r.correct ? t('bomb.statusCorrect') : t('bomb.statusWrong')}</span>
            <span class="det-done-row-score">+${r.score}đ</span>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem">
        <button class="det-start-btn" style="width:auto;padding:0.75rem 1.75rem" onclick="startBombFromHub()">${t('bomb.playAgain')}</button>
        <button class="btn-ghost" style="padding:0.75rem 1.25rem" onclick="_bombBackToHub()">${t('bomb.back')}</button>
      </div>
    </div>`;

  if (typeof AudioFX !== 'undefined') {
    setTimeout(() => rate >= 0.5 ? AudioFX.completedPass?.() : AudioFX.completedFail?.(), 200);
  }
  setTimeout(() => {
    if (rate >= 0.5) _bfwStart(rate >= 0.8 ? 4000 : 2500);
  }, 300);
}

// ---- AI GENERATE SENTENCE ----
async function _bombGenerateSentence(card) {
  const apiKey = localStorage.getItem('vocalearn_gemini_key');
  const word    = (card.term || card.word || '').trim();
  const meaning = card.meaning || card.definition || '';

  const prompt =
    `Bạn là AI cho game học tiếng Anh "Word Bomb".\n` +
    `Từ cần tạo câu: "${word}" (nghĩa: "${meaning}").\n` +
    `Hãy tạo 1 câu tiếng Anh tự nhiên có dùng từ "${word}".\n` +
    `Yêu cầu:\n` +
    `- Câu phải có ngữ cảnh rõ ràng giúp đoán được từ bị ẩn\n` +
    `- Câu KHÔNG được quá dễ (đừng dịch thẳng nghĩa vào câu)\n` +
    `- Câu ngắn gọn 8-15 từ\n` +
    `- Thay từ "${word}" bằng "___" trong trường "blanked"\n` +
    `Trả về JSON thuần (không markdown, không backtick):\n` +
    `{"sentence":"câu đầy đủ","blanked":"câu có ___ thay chỗ từ"}`;

  let dynamicModels = BOMB_MODELS;
  try { dynamicModels = await GeminiModels.getModels(apiKey); } catch(e) {}
  let lastError = null;
  for (const model of dynamicModels) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      if (!res.ok) {
        const e = await res.json();
        lastError = e.error?.message || `HTTP ${res.status}`;
        const shouldRetry = [400, 404, 429, 500, 503, 529].includes(res.status) ||
          lastError.includes('quota') || lastError.includes('RESOURCE_EXHAUSTED') ||
          lastError.includes('not found') || lastError.includes('high demand') ||
          lastError.includes('overloaded') || lastError.includes('unavailable');
        if (shouldRetry) {
          if (res.status === 404) GeminiModels.clearCache();
          continue;
        }
        throw new Error(lastError);
      }
      const data  = await res.json();
      const raw   = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      if (!parsed.sentence || !parsed.blanked) throw new Error('AI trả về thiếu dữ liệu');

      // Highlight ô trống trong câu
      const blankedHTML = parsed.blanked.replace(
        /___+/g,
        `<span class="bomb-blank">
          <input id="bombInlineCursor" type="text" autocomplete="off" spellcheck="false"
            style="pointer-events:none;background:transparent;border:none;width:80px;text-align:center;font-weight:700;color:var(--accent2)" 
            placeholder="___" tabindex="-1"/>
        </span>`
      );
      return { sentence: parsed.sentence, blanked: blankedHTML };
    } catch (e) {
      lastError = e.message;
      // Thử model tiếp theo với mọi lỗi tạm thời
      if (e.message?.includes('quota') || e.message?.includes('429') ||
          e.message?.includes('503') || e.message?.includes('high demand') ||
          e.message?.includes('overloaded') || e.message?.includes('fetch')) continue;
      throw e;
    }
  }
  throw new Error(lastError || 'Tất cả model đều hết quota');
}

// ---- FUZZY MATCH ----
function _bombFuzzyMatch(answer, correct) {
  if (answer === correct) return true;
  if (correct.length < 4) return false;
  if (Math.abs(answer.length - correct.length) > 1) return false;
  let diff = 0;
  const len = Math.max(answer.length, correct.length);
  for (let i = 0; i < len; i++) {
    if (answer[i] !== correct[i]) diff++;
    if (diff > 1) return false;
  }
  return true;
}

// ---- CONFIRM EXIT ----
function _bombConfirmExit() {
  _bombStopTimer();
  // Hiện modal tùy chỉnh thay vì confirm()
  const overlay = document.getElementById('bombExitModal');
  if (overlay) overlay.classList.add('open');
}

function _bombExitConfirmed() {
  document.getElementById('bombExitModal')?.classList.remove('open');
  _bombBackToHub();
}

function _bombExitCancelled() {
  document.getElementById('bombExitModal')?.classList.remove('open');
  // Tiếp tục đếm giờ nếu chưa trả lời
  if (!bombAnswered && !bombGenerating) {
    const remaining = parseInt(document.getElementById('bombTimerCount')?.textContent || '0');
    if (remaining > 0) {
      bombTimerSec = remaining;
      _bombStartTimer();
    }
  }
}

// ---- BACK ----
function _bombBackToHub() {
  _bombStopTimer();
  // Ẩn tất cả section bomb
  ['bombConfig','bombSession','bombDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Xóa class fullscreen/in-session
  document.body.classList.remove('game-fullscreen', 'game-in-session');
  // Dọn fireworks nếu có
  if (_bfwCanvas) { cancelAnimationFrame(_bfwRaf); _bfwCanvas.remove(); _bfwCanvas = null; }
  // Hiện lại gamesHub và navigate đúng trang
  if (typeof navigateTo === 'function') {
    navigateTo('scramble'); // renderScramblePage() → _scrShowSection('hub') → hiện gamesHub
  } else {
    const hub = document.getElementById('gamesHub');
    if (hub) hub.style.display = '';
  }
}

// ---- SECTION HELPER ----
function _bombShowSection(section) {
  const hub = document.getElementById('gamesHub');
  if (hub) hub.style.display = section === 'hub-placeholder' ? '' : 'none';

  ['scrambleSelectSet','scrambleConfig','scrambleSession','scrambleDone',
   'raceConfig','raceSession','raceDone',
   'hangConfig','hangSession','hangDone',
   'detConfig','detSession','detDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const map = { config: 'bombConfig', session: 'bombSession', done: 'bombDone' };
  ['bombConfig','bombSession','bombDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (map[section] === id) ? '' : 'none';
  });

  document.body.classList.toggle('game-in-session', section === 'session');
}

// ---- INPUT EVENTS ----
document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('bombAnswerInput');
  if (inp) {
    inp.addEventListener('input', () => {
      const btn = document.getElementById('bombBtnSubmit');
      if (btn) btn.disabled = inp.value.trim() === '' || bombAnswered || bombGenerating;
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !bombAnswered && !bombGenerating) _bombSubmitAnswer();
    });
  }
});