// ===== WORD RACE GAME =====

// ---- STATE ----
let raceCards         = [];
let raceIndex         = 0;
let raceScore         = 0;
let raceCorrect       = 0;
let raceWrong         = 0;
let raceDuration      = 60;
let raceTimeLeft      = 60;
let raceTimerInterval = null;
let raceAnswering     = false;
let raceCombo         = 0;     // streak đúng liên tiếp
let raceCarPos        = 5;     // % vị trí xe trên đường (5 → 90)
let raceLastTickTime  = 0;     // kiểm soát tick âm thanh time-warning

const RACE_CORRECT_SCORE = 10;
const RACE_WRONG_PENALTY = 5;

// ---- INIT ----
function renderRacePage() {}

function startRaceFromHub() {
  const allSets = getAllSets();
  const progress = Storage.getProgress();
  let pool = [];
  allSets.forEach(s => {
    s.cards.forEach(c => {
      const st = SR.getStatus(c.id, progress);
      if (st === 'learning' || st === 'mastered') pool.push({ ...c, _setName: s.name });
    });
  });
  if (pool.length < 4) {
    showNotif('Bạn cần học ít nhất 4 từ trước khi chơi! Hãy học thêm từ vựng 📚', '⚠️');
    return;
  }
  raceCards = shuffle([...pool]);
  document.getElementById('raceConfigInfo').textContent =
    `🏎️ Word Race — ${pool.length} từ trong pool`;
  _raceSelectDuration(60);
  _raceShowSection('config');
  document.body.classList.add('game-fullscreen');  // vào fullscreen
}

// ---- DURATION ----
function _raceSelectDuration(sec) {
  raceDuration = sec;
  document.querySelectorAll('.race-dur-btn').forEach(b =>
    b.classList.toggle('active', parseInt(b.dataset.dur) === sec));
}

// ---- START ----
function _raceStart() {
  raceIndex     = 0;
  raceScore     = 0;
  raceCorrect   = 0;
  raceWrong     = 0;
  raceCombo     = 0;
  raceCarPos    = 5;
  raceTimeLeft  = raceDuration;
  raceAnswering = false;
  raceLastTickTime = 0;
  raceCards     = shuffle([...raceCards]);

  _raceMoveCar(5, false);
  _raceUpdateCombo(false);
  _raceShowSection('session');
  _raceUpdateTimer();
  _raceStartTimer();
  _raceLoadQuestion();
  _raceSetCarSpeed('normal');
  AudioFX.raceEngineStart();
  setTimeout(() => AudioFX.raceBgStart(), 600); // nhạc nền bắt đầu sau tiếng động cơ
}

// ---- TIMER ----
function _raceStartTimer() {
  _raceClearTimer();
  raceTimerInterval = setInterval(() => {
    raceTimeLeft -= 0.1;
    if (raceTimeLeft <= 0) {
      raceTimeLeft = 0;
      _raceClearTimer();
      _raceUpdateTimer();
      _raceEnd();
    } else {
      _raceUpdateTimer();
    }
  }, 100);
}
function _raceClearTimer() {
  if (raceTimerInterval) { clearInterval(raceTimerInterval); raceTimerInterval = null; }
}
function _raceUpdateTimer() {
  const pct = raceTimeLeft / raceDuration;
  const bar = document.getElementById('raceTimerBar');
  const txt = document.getElementById('raceTimerText');
  if (!bar || !txt) return;
  bar.style.width = (pct * 100) + '%';
  if (pct > 0.5)       bar.style.background = 'var(--accent3)';
  else if (pct > 0.25) bar.style.background = 'var(--accent2)';
  else                 bar.style.background = 'var(--accent)';
  txt.textContent = Math.ceil(raceTimeLeft) + 's';
  txt.classList.toggle('race-timer-danger', pct <= 0.2);

  // Âm tick khi còn ít thời gian (≤20%), mỗi giây 1 tiếng
  if (pct <= 0.2 && raceTimeLeft > 0) {
    const flooredSec = Math.floor(raceTimeLeft);
    if (flooredSec !== raceLastTickTime) {
      raceLastTickTime = flooredSec;
      AudioFX.raceTimeTick();
    }
  }
}

// ---- CAR ----
function _raceMoveCar(targetPct, animate) {
  raceCarPos = Math.min(88, Math.max(5, targetPct));
  const wrap = document.getElementById('raceCarWrap');
  if (!wrap) return;
  wrap.style.transition = animate ? 'left 0.4s cubic-bezier(.22,.68,0,1.2)' : 'none';
  wrap.style.left = raceCarPos + '%';
}
function _raceAdvanceCar() {
  // Tiến thêm tuỳ combo
  const step = 5 + Math.min(raceCombo, 5) * 2;
  const next  = raceCarPos + step;
  if (next >= 88) {
    // Cờ đích — xe lượn qua rồi quay đầu
    _raceMoveCar(92, true);
    setTimeout(() => _raceMoveCar(5, false), 600);
  } else {
    _raceMoveCar(next, true);
  }
}
function _raceSetCarSpeed(mode) {
  const car = document.getElementById('raceCarSvg');
  const exhaust = document.getElementById('raceExhaust');
  if (!car || !exhaust) return;
  car.classList.remove('race-car-boost', 'race-car-hit');
  exhaust.classList.remove('exhaust-boost', 'exhaust-hit');
  if (mode === 'boost')  { car.classList.add('race-car-boost'); exhaust.classList.add('exhaust-boost'); }
  if (mode === 'hit')    { car.classList.add('race-car-hit');   exhaust.classList.add('exhaust-hit'); }
}

// ---- COMBO ----
function _raceUpdateCombo(show) {
  const badge = document.getElementById('raceCombo');
  const num   = document.getElementById('raceComboNum');
  if (!badge || !num) return;
  if (show && raceCombo >= 2) {
    num.textContent = raceCombo;
    badge.style.display = '';
    badge.classList.remove('combo-pop');
    void badge.offsetWidth;
    badge.classList.add('combo-pop');
  } else {
    badge.style.display = 'none';
  }
}

// ---- FLOATING SCORE POPUP ----
function _raceShowPopup(text, cls) {
  const container = document.getElementById('racePopups');
  if (!container) return;
  const el = document.createElement('div');
  el.className = 'race-popup ' + cls;
  el.textContent = text;
  // Random horizontal position
  el.style.left = (20 + Math.random() * 60) + '%';
  container.appendChild(el);
  setTimeout(() => el.remove(), 900);
}

// ---- PARTICLES (confetti khi đúng) ----
function _raceSpawnParticles(good) {
  const container = document.getElementById('racePopups');
  if (!container) return;
  const colors = good
    ? ['#06d6a0','#ffd166','#ff6b6b','#c77dff','#4fc3f7']
    : ['#ff4444','#ff6b6b'];
  const count = good ? 12 : 5;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'race-particle';
    p.style.cssText = `
      left:${30 + Math.random()*40}%;
      background:${colors[Math.floor(Math.random()*colors.length)]};
      width:${6+Math.random()*6}px;
      height:${6+Math.random()*6}px;
      animation-delay:${Math.random()*0.2}s;
      animation-duration:${0.6+Math.random()*0.4}s;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

// ---- LOAD QUESTION ----
function _raceLoadQuestion() {
  if (raceIndex >= raceCards.length) {
    raceCards = shuffle([...raceCards]);
    raceIndex = 0;
  }
  raceAnswering = false;
  const card    = raceCards[raceIndex];
  const word    = card.term || card.word || '';
  const meaning = card.definition || card.meaning || '';

  const others   = raceCards.filter((_, i) => i !== raceIndex);
  const wrongOpts = shuffle(others).slice(0, 3).map(c => c.definition || c.meaning || '');
  const options  = shuffle([meaning, ...wrongOpts]);

  document.getElementById('raceWord').textContent = word;
  const ph = card.phonetic || card.ipa || '';
  const phEl = document.getElementById('racePhonetic');
  phEl.textContent = ph;
  phEl.style.display = ph ? '' : 'none';

  document.getElementById('raceScore').textContent = raceScore;
  document.getElementById('raceProgress').textContent = `${raceCorrect} đúng · ${raceWrong} sai`;

  const grid = document.getElementById('raceAnswerGrid');
  grid.innerHTML = '';
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'race-answer-btn';
    btn.textContent = opt;
    btn.onclick = () => _raceAnswer(btn, opt, meaning, word);
    grid.appendChild(btn);
  });

  const qCard = document.getElementById('raceQuestionCard');
  qCard.classList.remove('race-slide-in');
  void qCard.offsetWidth;
  qCard.classList.add('race-slide-in');
}

// ---- ANSWER ----
function _raceAnswer(btn, chosen, correct, word) {
  if (raceAnswering) return;
  raceAnswering = true;
  document.querySelectorAll('.race-answer-btn').forEach(b => b.disabled = true);

  if (chosen === correct) {
    raceScore   += RACE_CORRECT_SCORE + (raceCombo >= 2 ? 5 : 0); // bonus combo
    raceCorrect += 1;
    raceCombo   += 1;

    btn.classList.add('correct');
    AudioFX.raceCarBoost();              // whoosh tăng tốc
    if (raceCombo >= 2) AudioFX.raceCombo(raceCombo);  // combo power-up
    speakWord(word);
    _raceSetCarSpeed('boost');
    _raceAdvanceCar();
    _raceUpdateCombo(true);

    // Popup & particles
    const bonusLabel = raceCombo >= 2 ? ` +${RACE_CORRECT_SCORE + 5} 🔥` : `+${RACE_CORRECT_SCORE}`;
    _raceShowPopup(bonusLabel, 'popup-correct');
    _raceSpawnParticles(true);

    // Badge pop
    const badge = document.getElementById('raceScoreBadge');
    badge.classList.remove('race-score-pop');
    void badge.offsetWidth;
    badge.classList.add('race-score-pop');
    document.getElementById('raceScore').textContent = raceScore;

    setTimeout(() => { raceIndex++; _raceSetCarSpeed('normal'); _raceLoadQuestion(); }, 480);

  } else {
    raceWrong += 1;
    raceCombo  = 0;
    btn.classList.add('wrong');
    document.querySelectorAll('.race-answer-btn').forEach(b => {
      if (b.textContent === correct) b.classList.add('correct');
    });

    raceTimeLeft = Math.max(0, raceTimeLeft - RACE_WRONG_PENALTY);
    _raceUpdateTimer();
    _raceSetCarSpeed('hit');
    _raceUpdateCombo(false);
    _raceShowPopup(`-${RACE_WRONG_PENALTY}s ❌`, 'popup-wrong');
    _raceSpawnParticles(false);

    // Shake timer
    const tw = document.getElementById('raceTimerWrap');
    tw.classList.remove('race-shake');
    void tw.offsetWidth;
    tw.classList.add('race-shake');

    AudioFX.raceCarHit();   // va chạm + clunk
    setTimeout(() => {
      _raceSetCarSpeed('normal');
      if (raceTimeLeft <= 0) { _raceClearTimer(); _raceEnd(); }
      else { raceIndex++; _raceLoadQuestion(); }
    }, 700);
  }
}

// ---- END ----
function _raceEnd() {
  _raceClearTimer();
  AudioFX.raceBgStop();  // tắt nhạc nền

  const prev      = _raceGetHighScore();
  const isNewHigh = raceScore > prev;
  if (isNewHigh) _raceSaveHighScore(raceScore);

  document.getElementById('raceDoneIcon').textContent  = raceScore >= 100 ? '🏆' : raceScore >= 50 ? '🥈' : '🎯';
  document.getElementById('raceDoneTitle').textContent  = raceScore >= 100 ? 'Xuất sắc!' : raceScore >= 50 ? 'Tốt lắm!' : 'Cố lên!';
  document.getElementById('raceDoneScore').textContent  = raceScore + ' điểm';
  document.getElementById('raceDoneCorrect').textContent = raceCorrect;
  document.getElementById('raceDoneWrong').textContent   = raceWrong;

  const hsEl = document.getElementById('raceDoneHighScore');
  if (isNewHigh && raceScore > 0) {
    hsEl.textContent = '🎉 Kỷ lục mới: ' + raceScore + ' điểm!';
    hsEl.style.color = 'var(--accent2)';
    setTimeout(() => AudioFX.raceNewRecord(), 200);   // jingle kỷ lục
    setTimeout(() => _raceFireworks('epic'), 400);    // pháo hoa hoành tráng
  } else {
    hsEl.textContent  = 'Kỷ lục: ' + Math.max(raceScore, prev) + ' điểm';
    hsEl.style.color  = 'var(--text2)';
    setTimeout(() => {
      if (raceScore >= 50) {
        AudioFX.raceFinishWin();
        setTimeout(() => _raceFireworks('normal'), 200);  // pháo hoa thường
      } else {
        AudioFX.raceFinishNeutral();
      }
    }, 200);
  }

  Storage.recordStudyToday(raceCards.slice(0, raceCorrect + raceWrong).map(c => c.id));
  updateStreak();
  if (typeof renderHome === 'function') renderHome();
  _raceShowSection('done');
}

// ---- HIGH SCORE ----
function _raceGetHighScore() {
  return parseInt(localStorage.getItem('race_highscore_' + raceDuration) || '0');
}
function _raceSaveHighScore(s) {
  localStorage.setItem('race_highscore_' + raceDuration, s);
}

// ---- SECTION HELPER ----
function _raceShowSection(section) {
  const hub     = document.getElementById('gamesHub');
  const config  = document.getElementById('raceConfig');
  const session = document.getElementById('raceSession');
  const done    = document.getElementById('raceDone');
  if (hub)     hub.style.display     = section === 'hub-placeholder' ? '' : 'none';
  if (config)  config.style.display  = section === 'config'  ? 'block' : 'none';
  if (session) session.style.display = section === 'session' ? 'block' : 'none';
  if (done)    done.style.display    = section === 'done'    ? 'block' : 'none';
  const hideScramble = section !== 'hub-placeholder';
  ['scrambleSelectSet','scrambleConfig','scrambleSession','scrambleDone'].forEach(id => {
    const el = document.getElementById(id);
    if (el && hideScramble) el.style.display = 'none';
  });
  // session có nhiều nội dung — căn từ trên; config/done — căn giữa
  document.body.classList.toggle('game-in-session', section === 'session');
}

// ---- COUNTDOWN ----
function _raceCountdown(cb) {
  const overlay = document.getElementById('raceCountdownOverlay');
  const num     = document.getElementById('raceCountdownNum');
  overlay.style.display = 'flex';
  let n = 3;
  const tick = () => {
    num.classList.remove('race-cd-pop');
    void num.offsetWidth;
    num.classList.add('race-cd-pop');
    if (n === 0) {
      num.textContent = 'GO!';
      AudioFX.raceCountdownTick(true);  // GO! fanfare
      setTimeout(() => { overlay.style.display = 'none'; cb(); }, 700);
      return;
    }
    num.textContent = n;
    AudioFX.raceCountdownTick(false);   // beep 3-2-1
    n--;
    setTimeout(tick, 900);
  };
  tick();
}

// ---- FIREWORKS ----
function _raceFireworks(mode) {
  const canvas = document.getElementById('raceFireworksCanvas');
  if (!canvas) return;

  const done = document.getElementById('raceDone');
  const rect = done.getBoundingClientRect();
  canvas.width  = done.offsetWidth;
  canvas.height = done.offsetHeight;

  const ctx = canvas.getContext('2d');
  const particles = [];
  const COLORS_EPIC   = ['#ff6b6b','#ffd166','#06d6a0','#4fc3f7','#c77dff','#ff9f43','#fff','#f9ca24'];
  const COLORS_NORMAL = ['#ffd166','#06d6a0','#4fc3f7','#c77dff','#ff6b6b'];
  const colors = mode === 'epic' ? COLORS_EPIC : COLORS_NORMAL;
  const SHELLS = mode === 'epic' ? 8 : 4;

  class Particle {
    constructor(x, y, vx, vy, color, life, size) {
      this.x = x; this.y = y;
      this.vx = vx; this.vy = vy;
      this.color = color;
      this.life = life;   // 0→1 fade out
      this.maxLife = life;
      this.size = size;
      this.gravity = 0.12;
      this.trail = [];
    }
    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > 5) this.trail.shift();
      this.x  += this.vx;
      this.y  += this.vy;
      this.vy += this.gravity;
      this.vx *= 0.98;
      this.life -= 0.018;
    }
    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      // Trail
      this.trail.forEach((pt, i) => {
        const a = alpha * (i / this.trail.length) * 0.4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.floor(a * 255).toString(16).padStart(2,'0');
        ctx.fill();
      });
      // Main dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2,'0');
      ctx.fill();
      // Glitter shimmer
      if (alpha > 0.5 && Math.random() > 0.7) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 1.8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff' + Math.floor(alpha * 0.4 * 255).toString(16).padStart(2,'0');
        ctx.fill();
      }
    }
  }

  function launchShell(delay) {
    setTimeout(() => {
      if (!document.getElementById('raceDone') || document.getElementById('raceDone').style.display === 'none') return;
      const cx = (0.2 + Math.random() * 0.6) * canvas.width;
      const cy = (0.15 + Math.random() * 0.45) * canvas.height;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const COUNT = mode === 'epic' ? 55 : 35;
      for (let i = 0; i < COUNT; i++) {
        const angle = (i / COUNT) * Math.PI * 2;
        const speed = 2 + Math.random() * 3.5;
        particles.push(new Particle(
          cx, cy,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed - 0.5,
          colors[Math.floor(Math.random() * colors.length)],
          0.8 + Math.random() * 0.4,
          1.5 + Math.random() * 2
        ));
      }
      // Sparkling star burst center
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 1.5;
        particles.push(new Particle(cx, cy,
          Math.cos(angle)*speed, Math.sin(angle)*speed,
          '#ffffff', 0.6 + Math.random()*0.3, 3 + Math.random()*2));
      }
    }, delay);
  }

  // Phóng các đợt pháo hoa
  const totalDuration = mode === 'epic' ? 4500 : 2500;
  for (let i = 0; i < SHELLS; i++) {
    launchShell(i * (totalDuration / SHELLS) + Math.random() * 300);
  }
  if (mode === 'epic') {
    // Thêm một loạt cuối hoành tráng
    for (let i = 0; i < 4; i++) launchShell(3200 + i * 200);
  }

  let animId;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    if (particles.length > 0 || Date.now() - startTime < totalDuration + 500) {
      animId = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  const startTime = Date.now();
  animate();
}

// Stop bg music also when user exits mid-game
document.addEventListener('DOMContentLoaded', () => {
});
document.addEventListener('DOMContentLoaded', () => {
  const backCfg = document.getElementById('btnBackRaceConfig');
  if (backCfg) backCfg.onclick = () => {
    _raceClearTimer();
    AudioFX.raceBgStop();
    document.body.classList.remove('game-fullscreen');
    _raceShowSection('hub-placeholder');
  };
  const exitBtn = document.getElementById('btnExitRace');
  if (exitBtn) exitBtn.onclick = () => {
    _raceClearTimer();
    AudioFX.raceBgStop();
    document.body.classList.remove('game-fullscreen');
    _raceShowSection('hub-placeholder');
  };
  const startBtn = document.getElementById('btnStartRace');
  if (startBtn) startBtn.onclick = () => {
    _raceShowSection('session');
    _raceCountdown(() => _raceStart());
  };
  const againBtn = document.getElementById('btnRaceAgain');
  if (againBtn) againBtn.onclick = () => {
    _raceShowSection('config');
  };
});
