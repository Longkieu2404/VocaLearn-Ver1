// ===== WORD DETECTIVE GAME =====

// ---- CONFIG ----
const DET_SCORES  = [500, 350, 200, 100, 50];
const DET_COLORS  = ['#34d399','#60a5fa','#a78bfa','#fb923c','#f87171'];
const DET_MODELS  = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite']; // fallback static list

// ---- STATE ----
let detCards       = [];
let detIndex       = 0;
let detTotalScore  = 0;
let detHintsUsed   = 0;
let detHints       = [];
let detAnswered    = false;
let detResults     = [];
let detWordCount   = 10;
let detDifficulty  = 'normal';
let detHintLang    = 'vi';
let detGenerating  = false;

// ---- FIREWORKS ----
let _fwCanvas, _fwCtx, _fwParticles = [], _fwRaf;

function _fwStart(duration = 3500) {
  if (_fwCanvas) _fwCanvas.remove();
  _fwCanvas = document.createElement('canvas');
  _fwCanvas.id = 'detFireworks';
  Object.assign(_fwCanvas.style, {
    position:'fixed', top:0, left:0, width:'100%', height:'100%',
    pointerEvents:'none', zIndex:9999
  });
  document.body.appendChild(_fwCanvas);
  _fwCtx = _fwCanvas.getContext('2d');
  _fwResize();
  window.addEventListener('resize', _fwResize);
  _fwParticles = [];
  _fwBurst();
  const t1 = setTimeout(_fwBurst, 600);
  const t2 = setTimeout(_fwBurst, 1200);
  const t3 = setTimeout(_fwBurst, 1800);
  _fwLoop();
  setTimeout(() => {
    clearTimeout(t1); clearTimeout(t2); clearTimeout(t3);
    cancelAnimationFrame(_fwRaf);
    window.removeEventListener('resize', _fwResize);
    if (_fwCanvas) _fwCanvas.remove();
    _fwCanvas = null;
  }, duration);
}

function _fwResize() {
  if (!_fwCanvas) return;
  _fwCanvas.width  = window.innerWidth;
  _fwCanvas.height = window.innerHeight;
}

function _fwBurst() {
  const x = 0.2 + Math.random() * 0.6;
  const y = 0.15 + Math.random() * 0.45;
  const hue = Math.random() * 360;
  for (let i = 0; i < 70; i++) {
    const angle = (Math.PI * 2 * i) / 70;
    const speed = 2 + Math.random() * 5;
    _fwParticles.push({
      x: _fwCanvas.width  * x,
      y: _fwCanvas.height * y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.012 + Math.random() * 0.012,
      radius: 2 + Math.random() * 3,
      color: `hsl(${hue + Math.random()*40},90%,65%)`
    });
  }
}

function _fwLoop() {
  if (!_fwCtx) return;
  _fwCtx.clearRect(0, 0, _fwCanvas.width, _fwCanvas.height);
  _fwParticles = _fwParticles.filter(p => p.life > 0.05);
  _fwParticles.forEach(p => {
    p.x   += p.vx;
    p.y   += p.vy;
    p.vy  += 0.12;
    p.life -= p.decay;
    _fwCtx.save();
    _fwCtx.globalAlpha = p.life;
    _fwCtx.fillStyle = p.color;
    _fwCtx.beginPath();
    _fwCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    _fwCtx.fill();
    _fwCtx.restore();
  });
  _fwRaf = requestAnimationFrame(_fwLoop);
}

// Simple burst for "consolation" (fewer, slower)
function _fwConsolation() {
  if (_fwCanvas) _fwCanvas.remove();
  _fwCanvas = document.createElement('canvas');
  Object.assign(_fwCanvas.style, {
    position:'fixed', top:0, left:0, width:'100%', height:'100%',
    pointerEvents:'none', zIndex:9999
  });
  document.body.appendChild(_fwCanvas);
  _fwCtx = _fwCanvas.getContext('2d');
  _fwResize();
  _fwParticles = [];
  const x = _fwCanvas.width * 0.5, y = _fwCanvas.height * 0.35;
  for (let i = 0; i < 30; i++) {
    const angle = (Math.PI * 2 * i) / 30;
    const speed = 1.5 + Math.random() * 2.5;
    _fwParticles.push({
      x, y,
      vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      life: 1, decay: 0.018, radius: 2,
      color: `hsl(${200 + Math.random()*60},70%,65%)`
    });
  }
  _fwLoop();
  setTimeout(() => {
    cancelAnimationFrame(_fwRaf);
    if (_fwCanvas) _fwCanvas.remove();
    _fwCanvas = null;
  }, 2000);
}

// ---- INIT ----
function startDetectiveFromHub() {
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

  if (pool.length < 4) {
    showNotif('Bạn cần học ít nhất 4 từ trước khi chơi! Hãy học thêm từ vựng nhé 📚', '⚠️');
    return;
  }

  const countSel = document.getElementById('detWordCount');
  countSel.innerHTML = '';
  [5, 8, 10, 15].forEach(n => {
    if (n <= pool.length) {
      const o = document.createElement('option');
      o.value = n; o.textContent = `${n} từ`;
      if (n === 10) o.selected = true;
      countSel.appendChild(o);
    }
  });

  document.getElementById('detConfigInfo').textContent =
    `Word Detective — ${pool.length} từ trong pool`;

  _detShowSection('config');
  document.body.classList.add('game-fullscreen');
  window._detPool = pool;
}

// ---- START ----
function _detStartGame() {
  detWordCount  = parseInt(document.getElementById('detWordCount').value) || 10;
  detDifficulty = document.querySelector('.det-diff-btn.active')?.dataset.diff || 'normal';
  detHintLang   = document.querySelector('.det-lang-btn.active')?.dataset.lang || 'vi';

  const pool = shuffle([...(window._detPool || [])]);
  detCards      = pool.slice(0, detWordCount);
  detIndex      = 0;
  detTotalScore = 0;
  detResults    = [];

  _detShowSection('session');
  document.body.classList.add('game-fullscreen', 'game-in-session');
  _detLoadCard();
}

// ---- LOAD CARD ----
async function _detLoadCard() {
  if (detIndex >= detCards.length) { _detFinish(); return; }

  const card = detCards[detIndex];
  detHints     = [];
  detHintsUsed = 0;
  detAnswered  = false;
  detGenerating = true;

  // Progress — show current card position (detIndex+1 out of total)
  const pct = ((detIndex + 1) / detCards.length) * 100;
  document.getElementById('detProgressFill').style.width = pct + '%';
  document.getElementById('detProgressText').textContent = `Từ ${detIndex + 1} / ${detCards.length}`;
  document.getElementById('detScoreBadge').innerHTML = `🏅 <span id="detScore">${detTotalScore}</span>`;
  document.getElementById('detHintsWrap').innerHTML = '';
  document.getElementById('detAnswerInput').value = '';
  document.getElementById('detAnswerInput').disabled = false;
  document.getElementById('detAnswerInput').placeholder = 'AI đang chuẩn bị gợi ý...';
  document.getElementById('detBtnSubmit').disabled = true;
  document.getElementById('detBtnNextHint').disabled = true;
  document.getElementById('detBtnNextHint').textContent = 'Gợi ý tiếp (−150đ)';
  document.getElementById('detBtnNextHint').style.display = '';
  document.getElementById('detFeedback').style.display = 'none';
  document.getElementById('detCurrentScore').textContent = '';
  document.getElementById('detBtnNext').style.display = 'none';
  document.getElementById('detAnswerRow').style.display = '';
  document.getElementById('detActionRow').style.display = '';

  // Show skip button
  const skipBtn = document.getElementById('detBtnSkip');
  skipBtn.style.display = '';

  // Show loading, hide hints
  document.getElementById('detLoadingHint').style.display = 'flex';
  document.getElementById('detHintsWrap').style.display = 'none';

  try {
    detHints = await _detGenerateHints(card);
  } catch (e) {
    showNotif(friendlyAIError(e.message), '🤖');
    document.body.classList.remove('game-fullscreen','game-in-session');
    if (typeof navigateTo === 'function') {
      navigateTo('scramble');
    } else {
      _detShowSection('hub-placeholder');
      renderScramblePage();
    }
    return;
  }

  detGenerating = false;
  document.getElementById('detLoadingHint').style.display = 'none';
  document.getElementById('detHintsWrap').style.display = '';
  document.getElementById('detAnswerInput').placeholder = 'Nhập từ tiếng Anh bạn đoán...';
  document.getElementById('detBtnNextHint').disabled = false;
  document.getElementById('detBtnSubmit').disabled = false;

  _detRevealHint();
}

// ---- GENERATE HINTS ----
async function _detGenerateHints(card) {
  const apiKey  = localStorage.getItem('vocalearn_gemini_key');
  const word    = card.term || card.word || '';
  const meaning = card.meaning || card.definition || '';

  const diffInstr = {
    easy:   'Gợi ý dễ hiểu, có thể đề cập loại từ, chủ đề rộng, và ví dụ gần với nghĩa.',
    normal: 'Gợi ý ở mức trung bình — mô tả chức năng, hoàn cảnh sử dụng, ví dụ trừu tượng một chút.',
    hard:   'Gợi ý khó — dùng ẩn dụ, từ đồng nghĩa khó, mô tả gián tiếp, KHÔNG nhắc nghĩa trực tiếp.'
  }[detDifficulty];

  const langInstr = {
    vi:        'Viết tất cả gợi ý bằng Tiếng Việt.',
    en:        'Write all hints in English.',
    bilingual: 'Mỗi gợi ý bằng Tiếng Việt trước, Tiếng Anh sau, ngăn cách bằng " / ".'
  }[detHintLang];

  const prompt =
    `Bạn là trợ lý cho game học từ vựng "Word Detective".\n` +
    `Từ cần đoán: "${word}" (nghĩa: "${meaning}").\n` +
    `Hãy tạo ĐÚNG 5 gợi ý theo thứ tự từ MƠ HỒ đến RÕ RÀNG dần dần.\n` +
    `${diffInstr}\n${langInstr}\n` +
    `TUYỆT ĐỐI KHÔNG được đề cập từ "${word}" hay phiên âm của nó.\n` +
    `TUYỆT ĐỐI KHÔNG được dịch thẳng nghĩa "${meaning}" ở gợi ý 1-2.\n` +
    `Trả về JSON thuần (không markdown, không backtick):\n` +
    `{"hints":["gợi ý 1","gợi ý 2","gợi ý 3","gợi ý 4","gợi ý 5"]}`;

  // Use dynamic model list if available, fallback to static
  const apiKey2 = apiKey; // already in scope
  let dynamicModels = DET_MODELS;
  try { dynamicModels = await GeminiModels.getModels(apiKey2); } catch(e) {}
  let lastError = null;
  for (const model of dynamicModels) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { method:'POST', headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ contents:[{ parts:[{ text: prompt }] }] }) }
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
      const clean = raw.replace(/```json|```/g,'').trim();
      const parsed = JSON.parse(clean);
      if (!Array.isArray(parsed.hints) || parsed.hints.length < 5) throw new Error('AI trả về thiếu gợi ý');
      return parsed.hints;
    } catch (e) {
      lastError = e.message;
      if (e.message?.includes('quota') || e.message?.includes('429') ||
          e.message?.includes('503') || e.message?.includes('high demand') ||
          e.message?.includes('overloaded') || e.message?.includes('fetch')) continue;
      throw e;
    }
  }
  throw new Error(lastError || 'Tất cả model đều hết quota');
}

// ---- REVEAL HINT ----
function _detRevealHint() {
  if (detHintsUsed >= detHints.length) return;
  const wrap  = document.getElementById('detHintsWrap');
  const idx   = detHintsUsed;
  const hint  = detHints[idx];
  const pts   = DET_SCORES[idx];
  const color = DET_COLORS[idx];

  const div = document.createElement('div');
  div.className = 'det-hint-item det-hint-reveal';
  div.style.setProperty('--hint-color', color);
  div.innerHTML =
    `<span class="det-hint-num">${idx + 1}</span>` +
    `<span class="det-hint-text">${hint}</span>` +
    `<span class="det-hint-pts">▶ ${pts}đ</span>`;
  wrap.appendChild(div);

  detHintsUsed++;

  if (detHintsUsed >= detHints.length) {
    document.getElementById('detBtnNextHint').disabled = true;
    document.getElementById('detBtnNextHint').textContent = 'Hết gợi ý';
  } else {
    const nextPts = DET_SCORES[detHintsUsed - 1] - DET_SCORES[detHintsUsed];
    document.getElementById('detBtnNextHint').textContent = `Gợi ý tiếp (−${nextPts}đ)`;
  }

  document.getElementById('detCurrentScore').textContent =
    `Điểm nếu đúng ngay bây giờ: ${DET_SCORES[detHintsUsed - 1]}đ`;
}

// ---- SUBMIT ----
function _detSubmitAnswer() {
  if (detAnswered || detGenerating) return;
  const input  = document.getElementById('detAnswerInput').value.trim().toLowerCase();
  if (!input) return;

  const card   = detCards[detIndex];
  const target = (card.term || card.word || '').toLowerCase().trim();
  const correct = input === target || _detFuzzyMatch(input, target);
  const pts     = correct ? DET_SCORES[Math.min(detHintsUsed - 1, 4)] : 0;

  detAnswered = true;
  if (correct) detTotalScore += pts;
  detResults.push({ word: card.term || card.word, hintsUsed: detHintsUsed, score: pts, correct });

  // Update progress bar after answering
  const pct = ((detIndex + 1) / detCards.length) * 100;
  document.getElementById('detProgressFill').style.width = pct + '%';
  document.getElementById('detScore').textContent = detTotalScore;

  const fb = document.getElementById('detFeedback');
  fb.style.display = '';
  fb.className = 'det-feedback ' + (correct ? 'det-feedback-correct' : 'det-feedback-wrong');
  fb.innerHTML = correct
    ? `<span class="det-fb-icon">✅</span><div><strong>Đúng rồi!</strong> +${pts} điểm<br><span class="det-fb-word">${card.term||card.word}</span> — ${card.meaning||card.definition||''}</div>`
    : `<span class="det-fb-icon">❌</span><div><strong>Sai!</strong> Đáp án: <span class="det-fb-word">${card.term||card.word}</span><br>${card.meaning||card.definition||''}</div>`;

  if (typeof AudioFX !== 'undefined') correct ? AudioFX.correct() : AudioFX.wrong();

  // Hide input row and action row, show Next
  document.getElementById('detAnswerRow').style.display   = 'none';
  document.getElementById('detActionRow').style.display   = 'none';
  document.getElementById('detCurrentScore').textContent  = '';

  const isLastCard = (detIndex + 1) >= detCards.length;
  if (isLastCard) {
    // Auto-advance to results after short delay on last card
    setTimeout(_detNextCard, 1800);
  } else {
    document.getElementById('detBtnNext').style.display = '';
  }
}

// ---- SKIP ----
function _detSkip() {
  if (detAnswered || detGenerating) return;
  const card = detCards[detIndex];
  detAnswered = true;
  detResults.push({ word: card.term||card.word, hintsUsed: detHintsUsed, score: 0, correct: false });

  // Update progress bar
  const pct = ((detIndex + 1) / detCards.length) * 100;
  document.getElementById('detProgressFill').style.width = pct + '%';

  const fb = document.getElementById('detFeedback');
  fb.style.display = '';
  fb.className = 'det-feedback det-feedback-wrong';
  fb.innerHTML = `<span class="det-fb-icon">⏭️</span><div><strong>Bỏ qua!</strong> Đáp án: <span class="det-fb-word">${card.term||card.word}</span><br>${card.meaning||card.definition||''}</div>`;

  // Hide input row and action row, show Next
  document.getElementById('detAnswerRow').style.display  = 'none';
  document.getElementById('detActionRow').style.display  = 'none';
  document.getElementById('detCurrentScore').textContent = '';

  const isLastCard = (detIndex + 1) >= detCards.length;
  if (isLastCard) {
    setTimeout(_detNextCard, 1800);
  } else {
    document.getElementById('detBtnNext').style.display = '';
  }
}

// ---- NEXT ----
function _detNextCard() {
  detIndex++;
  _detLoadCard();
}

// ---- FINISH ----
function _detFinish() {
  document.body.classList.remove('game-in-session');
  _detShowSection('done');

  const correctCount = detResults.filter(r => r.correct).length;
  const avgHints = detResults.length
    ? (detResults.reduce((s,r) => s + r.hintsUsed, 0) / detResults.length).toFixed(1)
    : 0;
  const rate = correctCount / (detResults.length || 1);

  const prev = parseInt(localStorage.getItem('detective_highscore') || '0');
  if (detTotalScore > prev) localStorage.setItem('detective_highscore', detTotalScore);
  const hi = Math.max(detTotalScore, prev);

  // Determine result tier
  let resultMsg, resultIcon;
  if (rate >= 0.8) {
    resultMsg = '🎉 Xuất sắc! Bạn là thám tử đỉnh!';
    resultIcon = '🏆';
  } else if (rate >= 0.5) {
    resultMsg = '👍 Tốt lắm! Tiếp tục luyện tập nhé!';
    resultIcon = '🥈';
  } else {
    resultMsg = '💪 Cố lên! Học thêm để đoán nhanh hơn!';
    resultIcon = '🌱';
  }

  const doneEl = document.getElementById('detDone');
  doneEl.innerHTML = `
    <div class="det-done-wrap">
      <div style="font-size:3.5rem;margin-bottom:0.25rem">${resultIcon}</div>
      <div style="font-size:1.4rem;font-weight:800;margin-bottom:0.25rem">Kết quả Word Detective</div>
      <div style="font-size:0.9rem;color:var(--text3);margin-bottom:1.25rem">${resultMsg}</div>
      <div class="det-done-stats">
        <div class="det-done-stat">
          <div class="det-done-stat-val" style="color:var(--accent2)">${detTotalScore}</div>
          <div class="det-done-stat-label">Tổng điểm</div>
        </div>
        <div class="det-done-stat">
          <div class="det-done-stat-val" style="color:#60a5fa">${hi}</div>
          <div class="det-done-stat-label">Cao nhất</div>
        </div>
        <div class="det-done-stat">
          <div class="det-done-stat-val">${correctCount}/${detResults.length}</div>
          <div class="det-done-stat-label">Đoán đúng</div>
        </div>
        <div class="det-done-stat">
          <div class="det-done-stat-val">${avgHints}</div>
          <div class="det-done-stat-label">Gợi ý TB/từ</div>
        </div>
      </div>
      <div class="det-done-results">
        ${detResults.map(r => `
          <div class="det-done-row ${r.correct?'det-done-correct':'det-done-wrong'}">
            <span class="det-done-row-icon">${r.correct?'✅':'❌'}</span>
            <span class="det-done-row-word">${r.word}</span>
            <span class="det-done-row-hints">${r.hintsUsed} gợi ý</span>
            <span class="det-done-row-score">+${r.score}đ</span>
          </div>`).join('')}
      </div>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-top:1.5rem">
        <button class="det-start-btn" style="width:auto;padding:0.75rem 1.75rem" onclick="startDetectiveFromHub()">🔄 Chơi lại</button>
        <button class="btn-ghost" style="padding:0.75rem 1.25rem" onclick="_detBackToHub()">← Trở về</button>
      </div>
    </div>`;

  // Sound + fireworks
  if (typeof AudioFX !== 'undefined') {
    setTimeout(() => rate >= 0.5 ? AudioFX.completedPass() : AudioFX.completedFail(), 200);
  }
  setTimeout(() => {
    if (rate >= 0.5) _fwStart(rate >= 0.8 ? 4000 : 2500);
    else _fwConsolation();
  }, 300);
}

// ---- FUZZY MATCH ----
function _detFuzzyMatch(a, b) {
  if (b.length < 5) return false;
  if (Math.abs(a.length - b.length) > 1) return false;
  let diff = 0;
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) diff++;
    if (diff > 1) return false;
  }
  return true;
}

// ---- BACK ----
function _detBackToHub() {
  document.body.classList.remove('game-fullscreen','game-in-session');
  if (_fwCanvas) { cancelAnimationFrame(_fwRaf); _fwCanvas.remove(); _fwCanvas = null; }
  // Hide all detective sections first
  ['detConfig','detSession','detDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Properly navigate back to the scramble page so page-scramble gets .active class
  if (typeof navigateTo === 'function') {
    navigateTo('scramble');
  } else {
    _detShowSection('hub-placeholder');
    renderScramblePage();
  }
}

// ---- SECTION HELPER ----
function _detShowSection(section) {
  const hub = document.getElementById('gamesHub');
  if (hub) hub.style.display = section === 'hub-placeholder' ? '' : 'none';

  ['scrambleSelectSet','scrambleConfig','scrambleSession','scrambleDone',
   'raceConfig','raceSession','raceDone',
   'hangConfig','hangSession','hangDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const map = { config:'detConfig', session:'detSession', done:'detDone' };
  ['detConfig','detSession','detDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (Object.values(map).includes(id) && id === map[section]) ? '' : 'none';
  });

  document.body.classList.toggle('game-in-session', section === 'session');
}

// ---- DIFFICULTY & LANG ----
function _detSelectDiff(diff) {
  document.querySelectorAll('.det-diff-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.diff === diff));
  detDifficulty = diff;
}
function _detSelectLang(lang) {
  document.querySelectorAll('.det-lang-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.lang === lang));
  detHintLang = lang;
}

// ---- INPUT ----
document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('detAnswerInput');
  if (inp) {
    inp.addEventListener('input', () => {
      const btn = document.getElementById('detBtnSubmit');
      if (btn) btn.disabled = inp.value.trim() === '' || detAnswered || detGenerating;
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !detAnswered && !detGenerating) _detSubmitAnswer();
    });
  }
});