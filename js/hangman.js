// ===== WORD HANGMAN GAME =====
// Tích hợp vào VocaLearn — dùng chung Storage, SR, AudioFX, speakWord, showNotif
// Gợi ý AI dùng Gemini API key đã lưu (giống Word Detective)

// ---- CONFIG ----
const HANG_MAX_WRONG        = 6;    // số lần sai tối đa trước khi thua
const HANG_AI_PENALTY       = 30;   // điểm bị trừ khi xin 1 gợi ý AI
const HANG_BASE_SCORE       = 100;  // điểm cơ bản nếu thắng không sai, không gợi ý
const HANG_HINT_BUDGET       = 60;  // quỹ điểm gợi ý cho mỗi từ
const HANG_HINT_MEANING_COST = 20;  // chi phí gợi ý nghĩa (không dùng AI)
const HANG_HINT_REVEAL_COST  = 25;  // chi phí mở 1 ô chữ ngẫu nhiên
const HANG_MODELS            = ['gemini-2.0-flash','gemini-2.0-flash-lite','gemini-1.5-flash','gemini-1.5-flash-8b'];

// ---- STATE ----
let hangCards       = [];
let hangIndex       = 0;
let hangTotalScore  = 0;
let hangRoundCorrect= 0;
let hangRoundWrong  = 0;
let hangResults      = [];   // { word, won, wrongCount, aiHintsUsed }

// Per-word state
let hangWord              = '';    // từ hiện tại, lowercase
let hangGuessed            = [];   // các chữ cái đã đoán (lowercase, unique)
let hangWrongCount         = 0;
let hangAIHint             = null; // gợi ý AI hiện tại (string) hoặc null
let hangAIHintsUsedWord    = 0;    // số gợi ý AI đã xin cho từ hiện tại
let hangAIGenerating       = false;
let hangRoundOver          = false;
let hangHintBudget         = HANG_HINT_BUDGET;  // quỹ điểm gợi ý còn lại
let hangMeaningHintShown   = false;             // đã dùng gợi ý nghĩa chưa
let hangRevealHintsUsed    = 0;                 // số lần mở ô chữ

// ---- KEYBOARD LAYOUT ----
const HANG_KB_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];

// ---- INIT FROM HUB ----
function startHangmanFromHub() {
  const allSets  = getAllSets();
  const progress = Storage.getProgress();
  let pool = [];
  allSets.forEach(s => {
    s.cards.forEach(c => {
      const st = SR.getStatus(c.id, progress);
      if (st === 'learning' || st === 'mastered') pool.push({ ...c, _setName: s.name });
    });
  });

  // Chỉ giữ thẻ có từ tiếng Anh hợp lệ (chữ cái + space, không số/ký tự lạ)
  pool = pool.filter(c => {
    const w = (c.term || c.word || '').trim();
    return /^[a-zA-Z ]{2,}$/.test(w);
  });

  if (pool.length < 4) {
    showNotif(getLang()==='en' ? 'You need at least 4 words to play! Study more vocabulary 📚' : 'Bạn cần học ít nhất 4 từ trước khi chơi! Hãy học thêm từ vựng nhé 📚', '⚠️');
    return;
  }

  const countSel = document.getElementById('hangWordCount');
  countSel.innerHTML = '';
  [5, 8, 10, 15].forEach(n => {
    if (n <= pool.length) {
      const o = document.createElement('option');
      o.value = n; o.textContent = `${n} ` + (getLang()==='en' ? 'words' : 'từ');
      if (n === 8) o.selected = true;
      countSel.appendChild(o);
    }
  });
  const oAll = document.createElement('option');
  oAll.value = 'all'; oAll.textContent = `Tất cả (${pool.length} từ)`;
  countSel.appendChild(oAll);

  document.getElementById('hangConfigInfo').textContent =
    getLang()==='en' ? `🎯 Word Hangman — ${pool.length} words in pool` : `🎯 Word Hangman — ${pool.length} từ trong pool`;

  _hangShowSection('config');
  document.body.classList.add('game-fullscreen');
  window._hangPool = pool;
}

// ---- START GAME ----
function _hangStartGame() {
  const countVal = document.getElementById('hangWordCount').value;
  let cards = shuffle([...(window._hangPool || [])]);
  if (countVal !== 'all') cards = cards.slice(0, parseInt(countVal));

  hangCards        = cards;
  hangIndex        = 0;
  hangTotalScore   = 0;
  hangRoundCorrect = 0;
  hangRoundWrong   = 0;
  hangResults      = [];

  document.getElementById('hangProgressFill').style.width = '0%';

  _hangShowSection('session');
  document.body.classList.add('game-fullscreen', 'game-in-session');
  _hangLoadWord();
}

// ---- LOAD WORD ----
function _hangLoadWord() {
  if (hangIndex >= hangCards.length) { _hangFinish(); return; }

  const card = hangCards[hangIndex];
  hangWord = (card.term || card.word || '').trim().toLowerCase();
  hangGuessed = [];
  hangWrongCount = 0;
  hangAIHint = null;
  hangAIHintsUsedWord = 0;
  hangAIGenerating = false;
  hangRoundOver = false;
  hangHintBudget = HANG_HINT_BUDGET;
  hangMeaningHintShown = false;
  hangRevealHintsUsed = 0;

  // Progress text + width: hiện ngay vị trí từ hiện tại
  const pct = ((hangIndex + 1) / hangCards.length) * 100;
  document.getElementById('hangProgressFill').style.width = pct + '%';
  document.getElementById('hangProgressText').textContent = `Từ ${hangIndex + 1} / ${hangCards.length}`;
  document.getElementById('hangScore').textContent = hangTotalScore;
  document.getElementById('hangScore').textContent = hangTotalScore;

  // Gợi ý ban đầu: AI tạo bằng tiếng Việt, hiện loading trong lúc chờ
  const meaningEl = document.getElementById('hangMeaning');
  meaningEl.textContent = getLang()==='en' ? '✨ Generating hint...' : '✨ Đang tạo gợi ý...';
  meaningEl.classList.remove('hang-meaning-reveal');
  meaningEl.classList.add('hang-meaning-hint');
  document.getElementById('hangPhonetic').textContent = '';

  // Gọi AI bất đồng bộ — không block render bàn phím/ô chữ
  _hangGenerateInitialHint(card).then(hint => {
    if (!hangRoundOver) {
      meaningEl.textContent = hint;
    }
  }).catch(() => {
    if (!hangRoundOver) {
      const wordLen = hangWord.replace(/ /g, '').length;
      const pos = card.partOfSpeech || card.type || '';
      meaningEl.textContent = wordLen + ' chữ cái' + (pos ? ' • ' + pos : '');
    }
  });

  // AI hint area reset
  const aiWrap = document.getElementById('hangAIHintWrap');
  aiWrap.style.display = 'none';
  aiWrap.innerHTML = '';
  document.getElementById('hangBtnAIHint').disabled = false;
  document.getElementById('hangBtnAIHint').style.display = '';
  document.getElementById('hangBtnAIHint').textContent = `🤖 Gợi ý AI (−${HANG_AI_PENALTY}đ)`;

  // Feedback hidden
  document.getElementById('hangFeedback').style.display = 'none';
  document.getElementById('hangBtnNext').style.display = 'none';
  document.getElementById('hangBtnSkip').style.display = '';
  document.getElementById('hangBtnSkip').disabled = false;

  // Render hint budget bar
  _hangRenderHintBudget();

  _hangInitFigure();
  _hangRenderWordSlots();
  _hangRenderKeyboard();
}

// ---- RENDER HINT BUDGET BAR ----
function _hangRenderHintBudget() {
  const bar = document.getElementById('hangHintBudgetBar');
  const label = document.getElementById('hangHintBudgetLabel');
  if (!bar || !label) return;
  const pct = Math.max(0, (hangHintBudget / HANG_HINT_BUDGET) * 100);
  bar.style.width = pct + '%';
  bar.className = 'hang-hint-budget-fill' +
    (pct > 50 ? ' budget-high' : pct > 20 ? ' budget-mid' : ' budget-low');
  label.textContent = getLang()==='en' ? `Hint budget: ${hangHintBudget}pts` : `Quỹ gợi ý: ${hangHintBudget}đ`;

  // Cập nhật trạng thái nút gợi ý
  const btnMeaning = document.getElementById('hangBtnHintMeaning');
  const btnReveal  = document.getElementById('hangBtnHintReveal');
  const btnAI      = document.getElementById('hangBtnAIHint');
  if (btnMeaning) btnMeaning.style.display = 'none'; // đã bỏ tính năng xem nghĩa
  if (btnReveal) {
    const canAfford = hangHintBudget >= HANG_HINT_REVEAL_COST;
    const hiddenLetters = hangWord.split('').filter(ch => ch !== ' ' && !hangGuessed.includes(ch));
    btnReveal.disabled = !canAfford || hangRoundOver || hiddenLetters.length === 0;
    btnReveal.title = canAfford ? `Mở 1 ô chữ (−${HANG_HINT_REVEAL_COST}đ)` : 'Không đủ quỹ';
  }
  if (btnAI && !hangRoundOver) {
    const canAffordAI = hangHintBudget >= HANG_AI_PENALTY;
    btnAI.disabled = !canAffordAI || hangAIGenerating;
    if (!canAffordAI) btnAI.title = 'Không đủ quỹ';
  }
}

// ---- HINT: MỞ Ô CHỮ NGẪU NHIÊN ----
function _hangHintRevealLetter() {
  if (hangRoundOver) return;
  if (hangHintBudget < HANG_HINT_REVEAL_COST) {
    showNotif(getLang()==='en' ? 'Not enough hint budget! Save your points 💸' : 'Không đủ quỹ gợi ý! Hãy tiết kiệm điểm hơn nhé 💸', '⚠️');
    return;
  }

  // Lấy các chữ chưa được đoán và chưa mở
  const hiddenLetters = [...new Set(
    hangWord.split('').filter(ch => ch !== ' ' && !hangGuessed.includes(ch))
  )];
  if (hiddenLetters.length === 0) {
    showNotif(getLang()==='en' ? 'All letters already revealed!' : 'Tất cả ô chữ đã được mở rồi!', 'ℹ️');
    return;
  }

  // Chọn ngẫu nhiên 1 chữ chưa mở
  const randLetter = hiddenLetters[Math.floor(Math.random() * hiddenLetters.length)];
  hangHintBudget -= HANG_HINT_REVEAL_COST;
  hangRevealHintsUsed++;

  // Tự động "đoán đúng" chữ đó (không tính vào wrong)
  hangGuessed.push(randLetter);
  AudioFX.correct();
  _hangRenderWordSlots();
  _hangRenderKeyboard();
  _hangRenderHintBudget();

  // Kiểm tra thắng
  const allRevealed = hangWord.split('').every(ch => ch === ' ' || hangGuessed.includes(ch));
  if (allRevealed) {
    _hangEndRound(true);
  }
}

// ---- BODY PARTS DEFINITION ----
const HANG_BODY_PARTS = [
  // 1: head
  { tag: 'circle', attrs: 'cx="75" cy="38" r="13"', dashlen: 82, cls: 'hang-draw-circle' },
  // 2: torso
  { tag: 'line', attrs: 'x1="75" y1="51" x2="75" y2="85"', dashlen: 34, cls: 'hang-draw-line' },
  // 3: left arm
  { tag: 'line', attrs: 'x1="75" y1="60" x2="58" y2="75"', dashlen: 23, cls: 'hang-draw-line' },
  // 4: right arm
  { tag: 'line', attrs: 'x1="75" y1="60" x2="92" y2="75"', dashlen: 23, cls: 'hang-draw-line' },
  // 5: left leg
  { tag: 'line', attrs: 'x1="75" y1="85" x2="60" y2="108"', dashlen: 28, cls: 'hang-draw-line' },
  // 6: right leg
  { tag: 'line', attrs: 'x1="75" y1="85" x2="90" y2="108"', dashlen: 28, cls: 'hang-draw-line' },
];

// ---- INIT FIGURE (gallows only, call once per word) ----
function _hangInitFigure() {
  const svg = document.getElementById('hangFigureSvg');
  if (!svg) return;
  svg.innerHTML = `
    <line x1="10" y1="118" x2="90" y2="118" class="hang-part hang-base" />
    <line x1="30" y1="118" x2="30" y2="10"  class="hang-part hang-base" />
    <line x1="30" y1="10"  x2="75" y2="10"  class="hang-part hang-base" />
    <line x1="75" y1="10"  x2="75" y2="25"  class="hang-part hang-base" />
  `;
  svg.className = 'hang-figure-svg';
}

// ---- RENDER HANGMAN FIGURE — chỉ append phần mới, không vẽ lại ----
function _hangRenderFigure() {
  const svg = document.getElementById('hangFigureSvg');
  if (!svg) return;

  // Số phần body hiện đang có trong SVG
  const existingCount = svg.querySelectorAll('.hang-body').length;

  // Chỉ thêm phần mới nhất (index = hangWrongCount - 1)
  if (hangWrongCount > 0 && hangWrongCount <= HANG_BODY_PARTS.length) {
    const partIndex = hangWrongCount - 1;
    if (partIndex >= existingCount) {
      const p = HANG_BODY_PARTS[partIndex];
      const el = document.createElementNS('http://www.w3.org/2000/svg', p.tag);
      // Parse attrs string thành attributes
      p.attrs.split(/\s+/).forEach(pair => {
        const [k, v] = pair.split('=');
        if (k && v) el.setAttribute(k, v.replace(/"/g, ''));
      });
      el.setAttribute('class', `hang-part hang-body ${p.cls}`);
      el.style.strokeDasharray = p.dashlen;
      el.style.strokeDashoffset = p.dashlen;
      svg.appendChild(el);

      // Animate nét vẽ sau 1 frame
      requestAnimationFrame(() => {
        el.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.4,0,0.2,1)';
        el.style.strokeDashoffset = '0';
      });
    }
  }

  // Mặt buồn khi thua — chỉ thêm 1 lần
  if (hangWrongCount >= HANG_MAX_WRONG && !svg.querySelector('.hang-face-group')) {
    const ns = 'http://www.w3.org/2000/svg';
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('class', 'hang-face-group hang-face-animate');
    g.innerHTML = `
      <line x1="70" y1="33" x2="73" y2="36" class="hang-part hang-face" />
      <line x1="73" y1="33" x2="70" y2="36" class="hang-part hang-face" />
      <line x1="77" y1="33" x2="80" y2="36" class="hang-part hang-face" />
      <line x1="80" y1="33" x2="77" y2="36" class="hang-part hang-face" />
      <path d="M70 45 Q75 41 80 45" class="hang-part hang-face hang-face-mouth" fill="none" />
    `;
    svg.appendChild(g);
  }

  // Cập nhật class trạng thái trên SVG
  const isDanger = hangWrongCount >= HANG_MAX_WRONG - 1 && hangWrongCount < HANG_MAX_WRONG;
  svg.classList.toggle('hang-danger', isDanger);
  svg.classList.toggle('hang-shake', hangWrongCount > 0 && hangWrongCount < HANG_MAX_WRONG);
  svg.classList.toggle('hang-lost', hangWrongCount >= HANG_MAX_WRONG);
}

// ---- RENDER WORD SLOTS ----
function _hangRenderWordSlots() {
  const wrap = document.getElementById('hangWordSlots');
  wrap.innerHTML = '';
  for (let i = 0; i < hangWord.length; i++) {
    const ch = hangWord[i];
    if (ch === ' ') {
      const sep = document.createElement('div');
      sep.className = 'hang-slot-sep';
      wrap.appendChild(sep);
      continue;
    }
    const slot = document.createElement('div');
    const revealed = hangGuessed.includes(ch) || hangRoundOver;
    slot.className = 'hang-letter-slot' + (revealed ? ' revealed' : '');
    slot.textContent = revealed ? ch.toUpperCase() : '';
    wrap.appendChild(slot);
  }
}

// ---- RENDER KEYBOARD ----
function _hangRenderKeyboard() {
  const wrap = document.getElementById('hangKeyboard');
  wrap.innerHTML = '';
  HANG_KB_ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    rowEl.className = 'hang-kb-row';
    row.forEach(letter => {
      const btn = document.createElement('button');
      btn.className = 'hang-key';
      btn.textContent = letter.toUpperCase();
      btn.dataset.letter = letter;
      if (hangGuessed.includes(letter)) {
        const isInWord = hangWord.includes(letter);
        btn.classList.add(isInWord ? 'hang-key-correct' : 'hang-key-wrong');
        btn.disabled = true;
      }
      if (hangRoundOver) btn.disabled = true;
      btn.onclick = () => _hangGuessLetter(letter);
      rowEl.appendChild(btn);
    });
    wrap.appendChild(rowEl);
  });
}

// ---- GUESS LETTER ----
function _hangGuessLetter(letter) {
  if (hangRoundOver || hangAIGenerating) return;
  if (hangGuessed.includes(letter)) return;

  hangGuessed.push(letter);

  if (hangWord.includes(letter)) {
    AudioFX.correct();
    _hangRenderWordSlots();
    _hangRenderKeyboard();
    // Check win
    const allRevealed = hangWord.split('').every(ch => ch === ' ' || hangGuessed.includes(ch));
    if (allRevealed) _hangEndRound(true);
  } else {
    hangWrongCount++;
    AudioFX.wrong();
    _hangRenderFigure();
    _hangRenderKeyboard();
    if (hangWrongCount >= HANG_MAX_WRONG) _hangEndRound(false);
  }
}

// ---- PHYSICAL KEYBOARD SUPPORT ----
document.addEventListener('keydown', (e) => {
  const session = document.getElementById('hangSession');
  if (!session || session.style.display === 'none') return;
  const key = e.key.toLowerCase();
  if (/^[a-z]$/.test(key)) _hangGuessLetter(key);
});

// ---- AI INITIAL HINT (tự động khi bắt đầu từ) ----
async function _hangGenerateInitialHint(card) {
  const apiKey = localStorage.getItem('vocalearn_gemini_key');
  if (!apiKey) {
    // Không có key: fallback tức thì về số chữ cái
    const wordLen = (card.term || card.word || '').trim().length;
    const pos = card.partOfSpeech || card.type || '';
    throw new Error('no key');
  }

  const word    = card.term || card.word || '';
  const meaning = card.meaning || card.definition || '';
  const example = card.example || '';

  const prompt =
    `Bạn là trợ lý cho game "Word Hangman" — người chơi phải đoán từ tiếng Anh "${word}" bằng cách đoán từng chữ cái.\n` +
    `Thông tin từ: nghĩa "${meaning}"` + (example ? `, ví dụ: "${example}"` : '') + `.\n` +
    `Hãy viết MỘT câu gợi ý bằng tiếng Việt để giúp người chơi đoán được từ này.\n` +
    `Yêu cầu:\n` +
    `- Viết bằng tiếng Việt hoàn toàn\n` +
    `- Ngắn gọn (1 câu, tối đa 20 từ)\n` +
    `- Mô tả đặc điểm, ngữ cảnh, hoặc cách dùng của từ\n` +
    `- TUYỆT ĐỐI KHÔNG nhắc đến từ "${word}", không đánh vần, không dịch thẳng nghĩa "${meaning}"\n` +
    `Trả về JSON thuần (không markdown, không backtick): {"hint":"nội dung gợi ý"}`;

  let dynamicModels = HANG_MODELS;
  try { dynamicModels = await GeminiModels.getModels(apiKey); } catch (e) {}

  let lastError = null;
  for (const model of dynamicModels) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        lastError = errData.error?.message || `HTTP ${res.status}`;
        if (isRetryableAIError(res.status, lastError)) continue;
        throw new Error(lastError);
      }
      const data  = await res.json();
      const raw   = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      if (!parsed.hint) throw new Error('Thiếu hint');
      return parsed.hint;
    } catch (e) {
      lastError = e.message;
      if (/quota|429/i.test(e.message)) continue;
      throw e;
    }
  }
  throw new Error(lastError || 'Tất cả model đều hết quota');
}

// ---- AI HINT ----
async function _hangRequestAIHint() {
  if (hangRoundOver || hangAIGenerating) return;
  const apiKey = localStorage.getItem('vocalearn_gemini_key');
  if (!apiKey) {
    showNotif(
      'Gợi ý AI cần <strong>Gemini API Key</strong>.<br>' +
      '<a href="https://aistudio.google.com/app/apikey" target="_blank" style="color:var(--accent5)">Lấy miễn phí tại đây →</a><br>' +
      'Sau đó nhập key trong phần <strong>Trợ lý AI</strong> ở sidebar.',
      '🔑'
    );
    return;
  }

  hangAIGenerating = true;
  const btn = document.getElementById('hangBtnAIHint');
  btn.disabled = true;
  btn.textContent = '🤖 AI đang nghĩ...';

  const aiWrap = document.getElementById('hangAIHintWrap');
  aiWrap.style.display = '';
  aiWrap.innerHTML = `<div class="hang-ai-loading"><span class="hang-ai-dot"></span><span class="hang-ai-dot"></span><span class="hang-ai-dot"></span></div>`;

  try {
    const card = hangCards[hangIndex];
    const hint = await _hangGenerateAIHint(card, hangAIHintsUsedWord);
    hangAIHint = hint;
    hangAIHintsUsedWord++;
    hangTotalScore = Math.max(0, hangTotalScore - HANG_AI_PENALTY);
    document.getElementById('hangScore').textContent = hangTotalScore;

    aiWrap.innerHTML = `<div class="hang-ai-hint-box"><span class="hang-ai-icon">🤖</span><span>${hint}</span></div>`;
    btn.textContent = `🤖 Gợi ý khác (−${HANG_AI_PENALTY}đ)`;
  } catch (e) {
    aiWrap.innerHTML = '';
    aiWrap.style.display = 'none';
    showNotif(friendlyAIError(e.message), '🤖');
    btn.textContent = `🤖 Gợi ý AI (−${HANG_AI_PENALTY}đ)`;
  }

  hangAIGenerating = false;
  if (!hangRoundOver) btn.disabled = false;
}

async function _hangGenerateAIHint(card, hintsAlreadyUsed) {
  const apiKey  = localStorage.getItem('vocalearn_gemini_key');
  const word    = card.term || card.word || '';
  const meaning = card.meaning || card.definition || '';
  const example = card.example || '';

  const prompt =
    `Bạn là trợ lý cho game "Word Hangman" (đoán chữ cái).\n` +
    `Từ cần đoán: "${word}" (nghĩa: "${meaning}").\n` +
    (example ? `Câu ví dụ có sẵn: "${example}"\n` : '') +
    `Người chơi đã xin gợi ý ${hintsAlreadyUsed} lần trước đó cho từ này — hãy đưa MỘT gợi ý MỚI, KHÁC với các lần trước, càng rõ ràng hơn dần nếu xin nhiều lần.\n` +
    `Gợi ý phải mô tả ngữ cảnh/cách dùng/đặc điểm của từ, viết bằng Tiếng Việt, ngắn gọn (1 câu, dưới 25 từ).\n` +
    `TUYỆT ĐỐI KHÔNG được nhắc đến từ "${word}", không đánh vần nó, không dịch thẳng nghĩa "${meaning}".\n` +
    `Trả về JSON thuần (không markdown, không backtick): {"hint":"nội dung gợi ý"}`;

  let dynamicModels = HANG_MODELS;
  try { dynamicModels = await GeminiModels.getModels(apiKey); } catch (e) {}

  let lastError = null;
  for (const model of dynamicModels) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        lastError = errData.error?.message || `HTTP ${res.status}`;
        if (isRetryableAIError(res.status, lastError)) continue;
        throw new Error(lastError);
      }
      const data  = await res.json();
      const raw   = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const clean = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      if (!parsed.hint) throw new Error('AI trả về thiếu gợi ý');
      return parsed.hint;
    } catch (e) {
      lastError = e.message;
      if (/quota|429/i.test(e.message)) continue;
      throw e;
    }
  }
  throw new Error(lastError || 'Tất cả model đều hết quota');
}

// ---- SKIP ----
function _hangSkip() {
  if (hangRoundOver || hangAIGenerating) return;
  _hangEndRound(false, true);
}

// ---- END ROUND ----
function _hangEndRound(won, skipped = false) {
  hangRoundOver = true;
  const card = hangCards[hangIndex];

  if (won) hangRoundCorrect++; else hangRoundWrong++;

  // Score for this word — trừ thêm điểm đã dùng từ quỹ gợi ý
  let wordScore = 0;
  const hintSpent = HANG_HINT_BUDGET - hangHintBudget; // tổng quỹ đã dùng (nghĩa + mở ô)
  if (won) {
    wordScore = Math.max(10, HANG_BASE_SCORE - (hangWrongCount * 10) - (hangAIHintsUsedWord * HANG_AI_PENALTY) - hintSpent);
    hangTotalScore += wordScore;
  }
  document.getElementById('hangScore').textContent = hangTotalScore;

  hangResults.push({
    word: card.term || card.word || '',
    meaning: card.meaning || card.definition || '',
    won, wrongCount: hangWrongCount, aiHintsUsed: hangAIHintsUsedWord,
    revealHints: hangRevealHintsUsed, score: wordScore
  });

  // Reveal full word + meaning + lock UI
  _hangRenderWordSlots();
  _hangRenderKeyboard();
  if (!won) _hangRenderFigure();

  // Ẩn hint buttons khi kết thúc
  const btnReveal  = document.getElementById('hangBtnHintReveal');
  if (btnReveal)  btnReveal.disabled = true;

  // Bây giờ mới hiện nghĩa thật + phiên âm
  const meaningEl = document.getElementById('hangMeaning');
  // Force restart animation
  meaningEl.classList.remove('hang-meaning-hint', 'hang-meaning-reveal');
  void meaningEl.offsetWidth; // reflow
  meaningEl.textContent = card.meaning || card.definition || '–';
  meaningEl.classList.add('hang-meaning-reveal');
  document.getElementById('hangPhonetic').textContent = card.phonetic || card.ipa || '';

  document.getElementById('hangBtnAIHint').style.display = 'none';
  document.getElementById('hangBtnSkip').style.display = 'none';

  const fb = document.getElementById('hangFeedback');
  fb.style.display = '';
  if (won) {
    fb.className = 'hang-feedback hang-feedback-correct';
    fb.innerHTML = `✅ <strong>${getLang()==='en'?'Correct!':'Chính xác!'}</strong> +${wordScore} ${getLang()==='en'?'pts':'điểm'}<br><span class="hang-fb-meaning">${card.meaning || card.definition || ''}</span>`;
    AudioFX.completedPass();
  } else {
    fb.className = 'hang-feedback hang-feedback-wrong';
    const label = skipped ? 'Đã bỏ qua!' : 'Hết lượt đoán!';
    fb.innerHTML = `${skipped ? '⏭️' : '💀'} <strong>${label}</strong> ${getLang()==='en'?'Answer:':'Đáp án:'} <strong class="hang-fb-word">${hangWord.toUpperCase()}</strong><br><span class="hang-fb-meaning">${card.meaning || card.definition || ''}</span>`;
    AudioFX.completedFail();
  }

  if (typeof speakWord === 'function') speakWord(hangWord);
  Storage.recordStudyToday([card.id]);

  const isLast = hangIndex >= hangCards.length - 1;
  const nextBtn = document.getElementById('hangBtnNext');
  nextBtn.style.display = 'none'; // ẩn nút mặc định, dùng auto-timeout

  if (!won && !skipped) {
    // Thua (treo cổ) → tự động game over sau 2s
    setTimeout(_hangFinish, 2000);
  } else if (isLast) {
    // Từ cuối cùng thắng/bỏ qua → tự động kết quả sau 1.5s
    setTimeout(_hangFinish, 1500);
  } else {
    // Còn từ tiếp theo → hiện nút next bình thường
    nextBtn.style.display = '';
    nextBtn.textContent = 'Từ tiếp theo →';
    nextBtn.onclick = _hangNextWord;
  }
}

// ---- NEXT WORD ----
function _hangNextWord() {
  hangIndex++;
  _hangLoadWord();
}

// ---- FINISH ----
function _hangFinish() {
  document.body.classList.remove('game-in-session');
  _hangShowSection('done');

  const total = hangResults.length;
  const rate  = total ? hangRoundCorrect / total : 0;
  const avgWrong = total ? (hangResults.reduce((s, r) => s + r.wrongCount, 0) / total).toFixed(1) : 0;

  // Kiểm tra có bị game over giữa chừng không (từ cuối cùng trong results bị thua do treo cổ)
  const lastResult = hangResults[hangResults.length - 1];
  const gameOverByLoss = lastResult && !lastResult.won && lastResult.wrongCount >= HANG_MAX_WRONG;
  const completedAll = hangIndex >= hangCards.length - 1 && !gameOverByLoss;

  const prev = parseInt(localStorage.getItem('hangman_highscore') || '0');
  const isNewHigh = hangTotalScore > prev;
  if (isNewHigh) localStorage.setItem('hangman_highscore', hangTotalScore);
  const hi = Math.max(hangTotalScore, prev);

  let icon, title;
  if (gameOverByLoss) {
    icon = '💀'; title = getLang()==='en' ? `Game Over! You lost on word ${hangIndex + 1}/${hangCards.length}` : `Game Over! Bạn thua ở từ ${hangIndex + 1}/${hangCards.length}`;
  } else if (rate >= 0.8) {
    icon = '🏆'; title = getLang()==='en' ? 'Excellent! You are a Hangman master!' : 'Xuất sắc! Bạn là cao thủ Hangman!';
  } else if (rate >= 0.5) {
    icon = '👏'; title = getLang()==='en' ? 'Good job! Keep practicing!' : 'Khá tốt! Tiếp tục luyện tập!';
  } else {
    icon = '📖'; title = getLang()==='en' ? 'Needs more practice!' : 'Cần luyện thêm nhé!';
  }

  document.getElementById('hangDoneIcon').textContent = icon;
  document.getElementById('hangDoneTitle').textContent = title;
  document.getElementById('hangDoneScore').textContent = hangTotalScore + (getLang()==='en' ? ' pts' : ' điểm');
  document.getElementById('hangDoneCorrect').textContent = hangRoundCorrect;
  document.getElementById('hangDoneWrong').textContent = hangRoundWrong;
  document.getElementById('hangDoneAvgWrong').textContent = avgWrong;

  const hsEl = document.getElementById('hangDoneHighScore');
  if (isNewHigh && hangTotalScore > 0) {
    hsEl.textContent = getLang()==='en' ? '🎉 New record: ' + hangTotalScore + ' pts!' : '🎉 Kỷ lục mới: ' + hangTotalScore + ' điểm!';
    hsEl.style.color = 'var(--accent2)';
  } else {
    hsEl.textContent = getLang()==='en' ? 'Record: ' + hi + ' pts' : 'Kỷ lục: ' + hi + ' điểm';
    hsEl.style.color = 'var(--text2)';
  }

  // Review list
  const rev = document.getElementById('hangResultsList');
  rev.innerHTML = hangResults.map(r => `
    <div class="hang-result-row ${r.won ? 'hang-result-win' : 'hang-result-lose'}">
      <span class="hang-result-icon">${r.won ? '✅' : '❌'}</span>
      <span class="hang-result-word">${r.word}</span>
      <span class="hang-result-meaning">${r.meaning}</span>
      <span class="hang-result-score">${r.won ? '+' + r.score : '0'}đ</span>
    </div>`).join('');

  if (typeof AudioFX !== 'undefined') {
    setTimeout(() => rate >= 0.5 ? AudioFX.completedPass() : AudioFX.completedFail(), 150);
  }

  updateStreak();
  if (typeof renderHome === 'function') renderHome();

  document.getElementById('btnHangAgain').onclick = () => _hangShowSection('config');
}

// ---- EXIT ----
function exitHangman() {
  document.body.classList.remove('game-fullscreen', 'game-in-session');
  navigateTo('scramble');
}

// ---- SECTION HELPER ----
function _hangShowSection(section) {
  const hub = document.getElementById('gamesHub');
  if (hub) hub.style.display = section === 'hub' ? '' : 'none';

  // Hide other games' sections
  ['scrambleSelectSet','scrambleConfig','scrambleSession','scrambleDone',
   'raceConfig','raceSession','raceDone',
   'detConfig','detSession','detDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const map = { config: 'hangConfig', session: 'hangSession', done: 'hangDone' };
  ['hangConfig','hangSession','hangDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === map[section]) ? '' : 'none';
  });

  document.body.classList.toggle('game-in-session', section === 'session');
}

// ---- WIRE UP EVENT LISTENERS ----
document.addEventListener('DOMContentLoaded', () => {
  const backCfg = document.getElementById('btnBackHangConfig');
  if (backCfg) backCfg.onclick = () => {
    document.body.classList.remove('game-fullscreen');
    _hangShowSection('hub');
  };
  const exitBtn = document.getElementById('btnExitHangman');
  if (exitBtn) exitBtn.onclick = exitHangman;
  const startBtn = document.getElementById('btnStartHangman');
  if (startBtn) startBtn.onclick = _hangStartGame;
  const aiHintBtn = document.getElementById('hangBtnAIHint');
  if (aiHintBtn) aiHintBtn.onclick = _hangRequestAIHint;
  const skipBtn = document.getElementById('hangBtnSkip');
  if (skipBtn) skipBtn.onclick = _hangSkip;
  // Nút gợi ý mới
  const btnReveal = document.getElementById('hangBtnHintReveal');
  if (btnReveal) btnReveal.onclick = _hangHintRevealLetter;
});