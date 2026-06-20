// ===== WORD SCRAMBLE GAME =====
// Tích hợp vào VocaLearn — sử dụng dữ liệu bộ thẻ, Storage, AudioFX, speakWord có sẵn

// ---- STATE ----
let scrSetId        = null;   // ID bộ thẻ đang chơi (null = random all)
let scrAllEligibleCards = []; // pool random từ tất cả bộ thẻ
let scrMode         = 'relax'; // 'relax' | 'challenge'
let scrCards        = [];     // danh sách thẻ đã shuffle
let scrIndex        = 0;      // vị trí thẻ hiện tại
let scrScore        = 0;
let scrCorrect      = 0;
let scrWrong        = 0;
let scrHintsUsed    = 0;

// Per-word state
let scrWord         = '';     // từ tiếng Anh cần đoán (lowercase)
let scrTiles        = [];     // mảng { letter, id, used }
let scrAnswer       = [];     // mảng { letter|null, tileId|null, locked }
let scrHintCount    = 0;      // số gợi ý đã dùng cho từ hiện tại
let scrChecked      = false;  // đã check câu trả lời chưa

// Timer
let scrTimerInterval = null;
let scrTimeLeft      = 30;
const TIMER_TOTAL    = 30;

// Wrong words list for review
let scrWrongList = []; // { word, meaning }

// ---- INIT (gọi từ navigateTo) ----
function renderScramblePage() {
  // Về màn Games Hub
  _scrShowSection('hub');
}

// ---- START SCRAMBLE FROM HUB ----
function startScrambleFromHub() {
  // Thu thập tất cả thẻ từ mọi bộ thẻ có status learning hoặc mastered
  const allSets = getAllSets();
  const progress = Storage.getProgress();

  let eligibleCards = [];
  allSets.forEach(s => {
    s.cards.forEach(c => {
      const status = SR.getStatus(c.id, progress);
      if (status === 'learning' || status === 'mastered') {
        // Gắn thêm setName để hiển thị nếu cần
        eligibleCards.push({ ...c, _setName: s.name });
      }
    });
  });

  // Chỉ giữ thẻ có từ tiếng Anh hợp lệ
  eligibleCards = eligibleCards.filter(c => {
    const w = c.term || c.word || '';
    return /[a-zA-Z]{2,}/.test(w);
  });

  if (eligibleCards.length < 4) {
    showNotif(getLang()==='en' ? 'You need at least 4 words to play! Study more vocabulary 📚' : 'Bạn cần học ít nhất 4 từ trước khi chơi! Hãy học thêm từ vựng nhé 📚', '⚠️');
    return;
  }

  // Lưu pool vào state để _scrStartGame dùng
  scrAllEligibleCards = eligibleCards;
  scrSetId = null; // không dùng set cụ thể

  // Cập nhật UI config
  const count = eligibleCards.length;
  document.getElementById('scrambleConfigSetName').textContent = `🧩 Word Scramble — ${count} ` + (getLang()==='en' ? 'words learning & mastered' : 'từ đang học & đã thuộc');

  // Cập nhật options số từ
  const sel = document.getElementById('scrambleCount');
  sel.innerHTML = '';
  const opts = [8, 12, 16, 20];
  opts.forEach(n => {
    if (n <= count) {
      const o = document.createElement('option');
      o.value = n; o.textContent = `${n} ` + (getLang()==='en' ? 'words' : 'từ');
      if (n === 12) o.selected = true;
      sel.appendChild(o);
    }
  });
  const oAll = document.createElement('option');
  oAll.value = 'all'; oAll.textContent = `Tất cả (${count} từ)`;
  if (count <= 12) oAll.selected = true;
  sel.appendChild(oAll);

  selectScrambleMode('relax');
  _scrShowSection('config');
  document.body.classList.add('game-fullscreen');  // vào fullscreen

  document.getElementById('btnStartScramble').onclick = _scrStartGame;
  document.getElementById('btnBackScrambleConfig').onclick = () => {
    document.body.classList.remove('game-fullscreen');
    _scrShowSection('hub');
  };
}

function selectScrambleMode(mode) {
  scrMode = mode;
  document.getElementById('scrModeRelax').classList.toggle('active', mode === 'relax');
  document.getElementById('scrModeChallenge').classList.toggle('active', mode === 'challenge');
}

// ---- START GAME ----
function _scrStartGame() {
  const countVal = document.getElementById('scrambleCount').value;
  let cards = shuffle([...scrAllEligibleCards]);
  if (countVal !== 'all') cards = cards.slice(0, parseInt(countVal));

  if (cards.length === 0) {
    showNotif(getLang()==='en' ? 'No valid words to play!' : 'Không có từ hợp lệ để chơi!', '⚠️');
    return;
  }

  // Reset state
  scrCards     = cards;
  scrIndex     = 0;
  scrScore     = 0;
  scrCorrect   = 0;
  scrWrong     = 0;
  scrHintsUsed = 0;
  scrWrongList = [];

  _scrShowSection('session');
  _scrLoadWord();
}

// ---- LOAD WORD ----
function _scrLoadWord() {
  _scrClearTimer();
  scrChecked = false;

  const card = scrCards[scrIndex];

  // Chuẩn bị từ: chỉ lấy phần chữ cái (giữ space để tính độ dài đúng)
  // Nhưng để đơn giản cho người chơi: dùng từ đầu tiên nếu có nhiều từ
  const rawTerm = (card.term || card.word || '').trim();
  scrWord = rawTerm.toLowerCase();

  // Progress bar
  const pct = Math.round((scrIndex + 1) / scrCards.length * 100);
  document.getElementById('scrambleProgressFill').style.width = pct + '%';
  document.getElementById('scrambleProgressText').textContent = `${scrIndex + 1} / ${scrCards.length}`;
  document.getElementById('scrambleScore').textContent = scrScore;

  // Clue
  document.getElementById('scrambleMeaning').textContent = card.meaning || card.definition || '–';
  document.getElementById('scramblePhonetic').textContent = card.phonetic || '';
  document.getElementById('scrambleHintInfo').textContent = '';
  document.getElementById('btnScrambleHint').disabled = false;

  // Build tiles: chỉ lấy ký tự chữ cái + space, giữ nguyên thứ tự sau scramble
  scrTiles = _buildTiles(scrWord);
  scrAnswer = Array(scrWord.length).fill(null).map(() => ({ letter: null, tileId: null, locked: false }));
  scrHintCount = 0;

  // Feedback ẩn, actions reset
  const fb = document.getElementById('scrambleFeedback');
  fb.style.display = 'none';
  document.getElementById('btnScrambleCheck').disabled = true;
  document.getElementById('btnScrambleCheck').style.display = '';
  document.getElementById('btnScrambleNext').style.display = 'none';
  document.getElementById('btnScrambleClear').disabled = false;
  document.getElementById('btnScrambleClear').style.display = '';

  _scrRenderAnswer();
  _scrRenderTiles();

  // Timer (challenge mode)
  if (scrMode === 'challenge') {
    document.getElementById('scrambleTimerWrap').style.display = 'flex';
    _scrStartTimer();
  } else {
    document.getElementById('scrambleTimerWrap').style.display = 'none';
  }
}

// Tạo mảng tiles từ từ — xáo chữ cái, giữ space cố định
function _buildTiles(word) {
  let letters = [];
  for (let i = 0; i < word.length; i++) {
    letters.push({ ch: word[i], origIdx: i });
  }
  // Tách space và chữ cái
  const spaces  = letters.filter(l => l.ch === ' ');
  const nonSpaces = letters.filter(l => l.ch !== ' ');

  // Shuffle chữ cái (đảm bảo khác thứ tự gốc nếu từ > 2 ký tự)
  let shuffled = shuffle([...nonSpaces]);
  if (nonSpaces.length > 2) {
    let attempts = 0;
    while (shuffled.every((t, i) => t.ch === nonSpaces[i].ch) && attempts < 20) {
      shuffled = shuffle([...nonSpaces]);
      attempts++;
    }
  }

  // Gắn ID
  let tileArr = [];
  let nsIdx = 0;
  for (let i = 0; i < word.length; i++) {
    if (word[i] === ' ') {
      tileArr.push({ letter: ' ', id: 'sp-' + i, used: false, isSpace: true });
    } else {
      const t = shuffled[nsIdx++];
      tileArr.push({ letter: t.ch, id: 'tile-' + i + '-' + Math.random().toString(36).slice(2,6), used: false, isSpace: false });
    }
  }
  return tileArr;
}

// ---- RENDER ----
function _scrRenderAnswer() {
  const area = document.getElementById('scrambleAnswerArea');
  area.innerHTML = '';
  for (let i = 0; i < scrAnswer.length; i++) {
    const slot = scrAnswer[i];

    // Nếu là space, render thanh ngăn cách
    if (scrWord[i] === ' ') {
      const sep = document.createElement('div');
      sep.style.cssText = 'width:12px;height:52px;display:flex;align-items:center;justify-content:center;color:var(--text3);font-size:1.4rem;font-weight:300;';
      sep.textContent = '·';
      area.appendChild(sep);
      continue;
    }

    const el = document.createElement('div');
    el.className = 'answer-slot' + (slot.letter ? '' : ' empty');
    if (slot.locked) el.classList.add('hint-revealed');
    el.dataset.idx = i;
    el.textContent = slot.letter ? slot.letter.toUpperCase() : '?';
    if (!slot.locked && slot.letter) {
      el.onclick = () => _scrReturnTile(i);
      el.title = 'Nhấn để trả lại ô chữ này';
    }
    area.appendChild(el);
  }
  // Enable/disable check button
  const allFilled = scrAnswer.every((s, i) => scrWord[i] === ' ' || s.letter !== null);
  document.getElementById('btnScrambleCheck').disabled = !allFilled || scrChecked;
}

function _scrRenderTiles() {
  const area = document.getElementById('scrambleTilesArea');
  area.innerHTML = '';
  scrTiles.forEach(tile => {
    if (tile.isSpace) return; // space không hiển thị tile
    const el = document.createElement('div');
    el.className = 'letter-tile' + (tile.used ? ' used' : '');
    el.dataset.id = tile.id;
    el.textContent = tile.letter.toUpperCase();
    if (!tile.used) {
      el.onclick = () => _scrPlaceTile(tile.id);
    }
    area.appendChild(el);
  });
}

// ---- TILE INTERACTIONS ----
function _scrPlaceTile(tileId) {
  if (scrChecked) return;
  const tile = scrTiles.find(t => t.id === tileId);
  if (!tile || tile.used) return;

  // Tìm slot trống tiếp theo (không bị locked, không phải space)
  const emptyIdx = scrAnswer.findIndex((s, i) => scrWord[i] !== ' ' && !s.locked && s.letter === null);
  if (emptyIdx === -1) return;

  tile.used = true;
  scrAnswer[emptyIdx] = { letter: tile.letter, tileId: tileId, locked: false };

  _scrRenderAnswer();
  _scrRenderTiles();
}

function _scrReturnTile(slotIdx) {
  if (scrChecked) return;
  const slot = scrAnswer[slotIdx];
  if (!slot.letter || slot.locked) return;

  const tile = scrTiles.find(t => t.id === slot.tileId);
  if (tile) tile.used = false;
  scrAnswer[slotIdx] = { letter: null, tileId: null, locked: false };

  _scrRenderAnswer();
  _scrRenderTiles();
}

function scrambleClearAnswer() {
  if (scrChecked) return;
  // Trả lại tất cả tile chưa locked
  scrAnswer.forEach((slot, i) => {
    if (slot.letter && !slot.locked) {
      const tile = scrTiles.find(t => t.id === slot.tileId);
      if (tile) tile.used = false;
      scrAnswer[i] = { letter: null, tileId: null, locked: false };
    }
  });
  _scrRenderAnswer();
  _scrRenderTiles();
}

// ---- HINT ----
function scrambleUseHint() {
  if (scrChecked) return;

  // Tìm slot đầu tiên chưa điền đúng và không locked (không phải space)
  let hintIdx = -1;
  for (let i = 0; i < scrAnswer.length; i++) {
    if (scrWord[i] === ' ') continue;
    if (!scrAnswer[i].locked && scrAnswer[i].letter !== scrWord[i]) {
      hintIdx = i;
      break;
    }
  }
  if (hintIdx === -1) return;

  // Trả lại tile đang ở slot đó (nếu có)
  const existingSlot = scrAnswer[hintIdx];
  if (existingSlot.letter && !existingSlot.locked) {
    const t = scrTiles.find(x => x.id === existingSlot.tileId);
    if (t) t.used = false;
  }

  // Tìm tile đúng
  const correctLetter = scrWord[hintIdx];
  const correctTile = scrTiles.find(t => t.letter === correctLetter && !t.used && !t.isSpace);
  if (!correctTile) return; // không tìm được (edge case)

  correctTile.used = true;
  scrAnswer[hintIdx] = { letter: correctLetter, tileId: correctTile.id, locked: true };

  scrHintCount++;
  scrHintsUsed++;
  scrScore = Math.max(0, scrScore - 5);
  document.getElementById('scrambleScore').textContent = scrScore;
  document.getElementById('scrambleHintInfo').textContent = `+${scrHintCount} ` + (getLang()==='en' ? 'hints' : 'gợi ý');

  // Vô hiệu hóa nút gợi ý nếu tất cả đã điền
  const allLocked = scrAnswer.every((s, i) => scrWord[i] === ' ' || s.locked);
  if (allLocked) document.getElementById('btnScrambleHint').disabled = true;

  _scrRenderAnswer();
  _scrRenderTiles();
}

// ---- CHECK ANSWER ----
function scrambleCheckAnswer() {
  if (scrChecked) return;

  const allFilled = scrAnswer.every((s, i) => scrWord[i] === ' ' || s.letter !== null);
  if (!allFilled) return;

  _scrClearTimer();
  scrChecked = true;

  const userWord = scrAnswer.map(s => s.letter || ' ').join('');
  const isCorrect = userWord === scrWord;

  // Flash effect on slots
  const slots = document.querySelectorAll('.answer-slot');
  let slotIdx = 0;
  for (let i = 0; i < scrAnswer.length; i++) {
    if (scrWord[i] === ' ') continue;
    if (slotIdx < slots.length) {
      slots[slotIdx].classList.add(isCorrect ? 'correct-flash' : 'wrong-flash');
    }
    slotIdx++;
  }

  const fb = document.getElementById('scrambleFeedback');
  fb.style.display = '';

  if (isCorrect) {
    AudioFX.correct();
    scrCorrect++;
    // Điểm = 10 base, +bonus nếu không dùng gợi ý, +3 nếu còn thời gian nhiều
    let points = 10;
    if (scrHintCount === 0) points += 5;
    if (scrMode === 'challenge' && scrTimeLeft > 15) points += 3;
    scrScore += points;
    document.getElementById('scrambleScore').textContent = scrScore;

    fb.className = 'scramble-feedback correct';
    fb.innerHTML = `✅ ${getLang()==='en'?'Correct!':'Chính xác!'} <strong>+${points}${getLang()==='en'?' pts':'đ'}</strong>`;
  } else {
    AudioFX.wrong();
    scrWrong++;
    const card = scrCards[scrIndex];
    scrWrongList.push({ word: card.term || card.word || '', meaning: card.meaning || card.definition || '' });

    fb.className = 'scramble-feedback wrong';
    fb.innerHTML = `❌ ${getLang()==='en'?'Wrong! Correct answer:':'Sai rồi! Đáp án đúng:'} <strong style="text-transform:uppercase;letter-spacing:2px;color:var(--accent3)">${scrWord.toUpperCase()}</strong>`;

    // Hiển thị đáp án đúng trong slots
    const slotsAll = document.querySelectorAll('.answer-slot');
    let si = 0;
    for (let i = 0; i < scrWord.length; i++) {
      if (scrWord[i] === ' ') continue;
      if (si < slotsAll.length) {
        slotsAll[si].textContent = scrWord[i].toUpperCase();
        slotsAll[si].classList.remove('wrong-flash');
        slotsAll[si].classList.add('hint-revealed');
      }
      si++;
    }
  }

  // Buttons
  document.getElementById('btnScrambleCheck').style.display = 'none';
  document.getElementById('btnScrambleClear').style.display = 'none';
  document.getElementById('btnScrambleHint').disabled = true;

  const isLast = scrIndex === scrCards.length - 1;
  const nextBtn = document.getElementById('btnScrambleNext');
  nextBtn.style.display = '';

  // Record study stats
  Storage.recordStudyToday([scrCards[scrIndex].id]);

  if (isLast) {
    // Câu cuối: đếm ngược rồi tự chuyển kết quả
    nextBtn.textContent = '🏆 Xem kết quả (3)';
    let countdown = 3;
    const autoFinish = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(autoFinish);
        _scrShowDone();
      } else {
        nextBtn.textContent = `🏆 Xem kết quả (${countdown})`;
      }
    }, 1000);
    nextBtn.onclick = () => { clearInterval(autoFinish); _scrShowDone(); };
  } else {
    // Câu giữa: đếm ngược rồi tự chuyển câu tiếp
    let countdown = 2;
    nextBtn.textContent = `Tiếp theo (${countdown})`;
    const autoNext = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(autoNext);
        scrambleNextWord();
      } else {
        nextBtn.textContent = `Tiếp theo (${countdown})`;
      }
    }, 1000);
    nextBtn.onclick = () => { clearInterval(autoNext); scrambleNextWord(); };
  }
}

// ---- NEXT WORD ----
function scrambleNextWord() {
  if (scrIndex >= scrCards.length - 1) {
    _scrShowDone();
    return;
  }
  scrIndex++;
  _scrLoadWord();
}

// ---- TIMER ----
function _scrStartTimer() {
  scrTimeLeft = TIMER_TOTAL;
  _scrUpdateTimerUI();
  scrTimerInterval = setInterval(() => {
    scrTimeLeft--;
    _scrUpdateTimerUI();
    if (scrTimeLeft <= 0) {
      _scrTimerExpired();
    }
  }, 1000);
}

function _scrUpdateTimerUI() {
  const pct = scrTimeLeft / TIMER_TOTAL;
  const offset = 100 - Math.round(pct * 100);
  const ring = document.getElementById('timerRingFill');
  const txt  = document.getElementById('scrambleTimerText');
  if (!ring || !txt) return;

  ring.style.strokeDashoffset = offset;
  txt.textContent = scrTimeLeft;

  ring.classList.remove('warning', 'danger');
  if (scrTimeLeft <= 5)       ring.classList.add('danger');
  else if (scrTimeLeft <= 12) ring.classList.add('warning');
}

function _scrTimerExpired() {
  _scrClearTimer();
  if (scrChecked) return;
  scrChecked = true;
  scrWrong++;

  const card = scrCards[scrIndex];
  scrWrongList.push({ word: card.term || card.word || '', meaning: card.meaning || card.definition || '' });

  const fb = document.getElementById('scrambleFeedback');
  fb.style.display = '';
  fb.className = 'scramble-feedback skip';
  fb.innerHTML = `⏰ ${getLang()==='en'?"Time's up! Answer:":'Hết giờ! Đáp án:'} <strong style="text-transform:uppercase;letter-spacing:2px;color:var(--accent3)">${scrWord.toUpperCase()}</strong>`;

  document.getElementById('btnScrambleCheck').style.display = 'none';
  document.getElementById('btnScrambleClear').style.display = 'none';
  document.getElementById('btnScrambleHint').disabled = true;

  const isLast = scrIndex === scrCards.length - 1;
  const nextBtn = document.getElementById('btnScrambleNext');
  nextBtn.style.display = '';

  Storage.recordStudyToday([scrCards[scrIndex].id]);

  if (isLast) {
    let countdown = 3;
    nextBtn.textContent = `🏆 Xem kết quả (${countdown})`;
    const autoFinish = setInterval(() => {
      countdown--;
      if (countdown <= 0) { clearInterval(autoFinish); _scrShowDone(); }
      else nextBtn.textContent = `🏆 Xem kết quả (${countdown})`;
    }, 1000);
    nextBtn.onclick = () => { clearInterval(autoFinish); _scrShowDone(); };
  } else {
    let countdown = 2;
    nextBtn.textContent = `Tiếp theo (${countdown})`;
    const autoNext = setInterval(() => {
      countdown--;
      if (countdown <= 0) { clearInterval(autoNext); scrambleNextWord(); }
      else nextBtn.textContent = `Tiếp theo (${countdown})`;
    }, 1000);
    nextBtn.onclick = () => { clearInterval(autoNext); scrambleNextWord(); };
  }

  AudioFX.wrong();
}

function _scrClearTimer() {
  if (scrTimerInterval) {
    clearInterval(scrTimerInterval);
    scrTimerInterval = null;
  }
}

// ---- DONE ----
function _scrShowDone() {
  _scrClearTimer();
  _scrShowSection('done');

  const total = scrCards.length;
  const pct   = Math.round(scrCorrect / total * 100);

  let icon = '🏆', title;
  if (pct >= 80)      { icon = '🏆'; title = getLang()==='en' ? 'Excellent!'      : 'Xuất sắc!';        AudioFX.completedPass(); }
  else if (pct >= 50) { icon = '👏'; title = getLang()==='en' ? 'Good job!'       : 'Khá tốt!';          AudioFX.completedPass(); }
  else                { icon = '📖'; title = getLang()==='en' ? 'Needs practice!' : 'Cần luyện thêm!';  AudioFX.completedFail(); }

  document.getElementById('scrambleDoneIcon').textContent   = icon;
  document.getElementById('scrambleDoneTitle').textContent   = title;
  document.getElementById('scrambleResultScore').textContent = scrScore + (getLang()==='en' ? ' pts' : ' điểm');
  document.getElementById('scrambleDoneCorrect').textContent = scrCorrect;
  document.getElementById('scrambleDoneWrong').textContent   = scrWrong;
  document.getElementById('scrambleDoneHints').textContent   = scrHintsUsed;

  // Wrong list
  const rev = document.getElementById('scrambleWrongReview');
  rev.innerHTML = '';
  if (scrWrongList.length > 0) {
    const title = document.createElement('div');
    title.style.cssText = 'font-size:0.8rem;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:.05em;margin-bottom:0.5rem;';
    title.textContent = getLang()==='en' ? `Words to review (${scrWrongList.length})` : `Các từ cần ôn lại (${scrWrongList.length})`;
    rev.appendChild(title);
    scrWrongList.forEach(item => {
      const row = document.createElement('div');
      row.className = 'scramble-wrong-item';
      row.innerHTML = `<span class="swi-word">${item.word}</span><span class="swi-meaning">${item.meaning}</span>`;
      rev.appendChild(row);
    });
  }

  document.getElementById('btnScrambleAgain').onclick = () => {
    _scrShowSection('config');
  };

  // Record to stats
  Storage.recordStudyToday(scrCards.map(c => c.id));
  updateStreak();
  renderHome();
}

// ---- SPEAK HINT ----
function scrambleSpeakHint() {
  if (scrWord) speakWord(scrWord);
}

// ---- EXIT ----
function exitScramble() {
  _scrClearTimer();
  document.body.classList.remove('game-fullscreen');
  navigateTo('home');
}

// ---- SECTION HELPER ----
function _scrShowSection(section) {
  document.getElementById('gamesHub').style.display          = section === 'hub'     ? '' : 'none';
  document.getElementById('scrambleSelectSet').style.display = section === 'select'  ? '' : 'none';
  document.getElementById('scrambleConfig').style.display    = section === 'config'  ? '' : 'none';
  document.getElementById('scrambleSession').style.display   = section === 'session' ? '' : 'none';
  document.getElementById('scrambleDone').style.display      = section === 'done'    ? '' : 'none';
  ['hangConfig','hangSession','hangDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.body.classList.toggle('game-in-session', section === 'session');
}

// ---- WIRE UP EVENT LISTENERS ----
document.addEventListener('DOMContentLoaded', () => {
  // Exit button
  const exitBtn = document.getElementById('btnExitScramble');
  if (exitBtn) exitBtn.addEventListener('click', () => {
    _scrClearTimer();
    document.body.classList.remove('game-fullscreen');
    _scrShowSection('hub');
    renderScramblePage();
  });
});