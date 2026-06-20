/* ============================================================
   VocaLearn — i18n (Internationalization) Module
   Supported languages: vi (Tiếng Việt), en (English)
   ============================================================ */

const I18N = {
  vi: {
    /* ── Login ── */
    'login.tagline': 'Học từ vựng thông minh — mọi lúc, mọi nơi',
    'login.welcome': 'Chào mừng bạn',
    'login.google': 'Đăng nhập bằng Google',
    'login.or': 'hoặc',
    'login.offline': '🖥️ Dùng offline (không đồng bộ)',
    'login.note': 'Đăng nhập để đồng bộ dữ liệu trên nhiều thiết bị.\nDùng offline sẽ lưu dữ liệu trên máy này.',

    /* ── Sidebar nav ── */
    'nav.home': 'Trang chủ',
    'nav.sets': 'Bộ thẻ của tôi',
    'nav.mixedquiz': 'Kiểm tra tổng hợp',
    'nav.games': 'Trò chơi',
    'nav.stats': 'Thống kê',
    'nav.chat': 'Trợ lý AI',
    'nav.trash': 'Thùng rác',
    'nav.streak': 'ngày liên tiếp',
    'nav.syncHint': 'Đồng bộ dữ liệu trên mọi thiết bị',
    'nav.loginGoogle': 'Đăng nhập Google',

    /* ── Home page ── */
    'home.greeting': 'Xin chào! 👋',
    'home.subtitle': 'Hôm nay bạn muốn học gì?',
    'home.totalCards': 'Tổng thẻ',
    'home.mastered': 'Đã thuộc',
    'home.todayStudied': 'Học hôm nay',
    'home.dueReview': 'Cần ôn tập hôm nay',
    'home.reviewBannerTitle': 'Đã đến lúc ôn tập!',
    'home.reviewBannerSub': 'Bạn có {n} thẻ cần ôn lại hôm nay — hoàn thành để ghi nhớ lâu hơn!',
    'home.reviewNow': 'Ôn tập ngay →',
    'home.sampleSets': 'Bộ thẻ mẫu — Tiếng Anh lớp 6',
    'home.mySets': 'Bộ thẻ của tôi',

    /* ── Sets page ── */
    'sets.title': 'Bộ thẻ của tôi 📚',
    'sets.import': '📥 Nhập',
    'sets.export': '📤 Xuất',
    'sets.createAI': '✨ Tạo bằng AI',
    'sets.createManual': '+ Tạo thủ công',
    'sets.empty': 'Chưa có bộ thẻ nào.\nHãy tạo bộ thẻ đầu tiên!',
    'sets.createNow': 'Tạo ngay',

    /* ── Study page ── */
    'study.title': 'Học thẻ 🎴',
    'study.selectSubtitle': 'Chọn bộ thẻ để bắt đầu:',
    'study.exit': '← Thoát',
    'study.flipHint': 'Nhấn để lật thẻ ↻',
    'study.showAnswer': 'Xem đáp án',
    'study.rateHard': '😓 Khó',
    'study.rateHardSub': 'Ôn lại sớm',
    'study.rateOk': '🤔 Được',
    'study.rateOkSub': '2 ngày nữa',
    'study.rateEasy': '😊 Dễ',
    'study.rateEasySub': '5 ngày nữa',
    'study.done': 'Hoàn thành buổi học!',
    'study.easy': 'Dễ',
    'study.ok': 'Được',
    'study.hard': 'Khó',
    'study.again': 'Học lại',
    'study.backHome': 'Về trang chủ',

    /* ── Review ── */
    'review.label': 'Ôn tập',
    'review.badge': '⏰ Ôn tập theo lịch SR',
    'review.score': 'Điểm:',
    'review.listen': '🔊 Nghe phát âm',
    'review.next': 'Câu tiếp →',
    'review.done': 'Ôn tập hoàn thành!',
    'review.correct': 'Đúng',
    'review.wrong': 'Sai',
    'review.again': 'Ôn lại các từ sai',
    'review.backHome': 'Về trang chủ',

    /* ── Quiz page ── */
    'quiz.title': 'Kiểm tra 🧠',
    'quiz.selectSubtitle': 'Chọn bộ thẻ để kiểm tra:',
    'quiz.exit': '← Thoát',
    'quiz.qLabel': 'Từ tiếng Anh này nghĩa là gì?',
    'quiz.score': 'Điểm:',
    'quiz.listen': '🔊 Nghe phát âm',
    'quiz.submit': 'Xác nhận ✓',
    'quiz.next': 'Câu tiếp →',
    'quiz.result': 'Kết quả kiểm tra',
    'quiz.correct': 'Đúng',
    'quiz.wrong': 'Sai',
    'quiz.again': 'Làm lại',
    'quiz.backHome': 'Về trang chủ',
    'quiz.essayPlaceholder': 'Nhập câu trả lời của bạn...',

    /* ── Stats page ── */
    'stats.title': 'Thống kê 📊',

    /* ── Chat page ── */
    'chat.title': 'Trợ lý AI 💬',
    'chat.subtitle': 'Hỏi về từ vựng, ngữ pháp, hoặc cách học tiếng Anh hiệu quả',

    /* ── Trash page ── */
    'trash.title': 'Thùng rác 🗑️',
    'trash.subtitle': 'Các bộ thẻ đã xóa — khôi phục hoặc xóa vĩnh viễn',
    'trash.clearAll': '🗑 Xóa tất cả',
    'trash.emptyTitle': 'Thùng rác trống.',
    'trash.emptyDesc': 'Các bộ thẻ bị xóa sẽ xuất hiện ở đây.',
    'trash.words': 'từ',
    'trash.deletedAt': 'Đã xóa',
    'trash.restore': '↩ Khôi phục',
    'trash.deletePerm': '🗑 Xóa vĩnh viễn',

    /* ── Mixed quiz ── */
    'mixedquiz.title': 'Kiểm tra tổng hợp 🎯',
    'mixedquiz.subtitle': 'Chọn các bộ thẻ muốn tổng hợp:',
    'mixedquiz.modeLabel': 'Hình thức kiểm tra',
    'mixedquiz.modeMultiple': 'Trắc nghiệm',
    'mixedquiz.modeEssay': 'Tự luận',
    'mixedquiz.modeRandom': 'Ngẫu nhiên',
    'mixedquiz.countLabel': 'Số câu hỏi',
    'mixedquiz.count10': '10 câu',
    'mixedquiz.count15': '15 câu',
    'mixedquiz.count20': '20 câu',
    'mixedquiz.count30': '30 câu',
    'mixedquiz.start': '🚀 Bắt đầu kiểm tra',
    'mixedquiz.selectAtLeast2': '👆 Chọn ít nhất 2 bộ thẻ để bắt đầu kiểm tra tổng hợp',

    /* ── Games hub ── */
    'games.title': 'Trò chơi 🎮',
    'games.subtitle': 'Chọn trò chơi để bắt đầu:',
    'games.scramble.name': 'Word Scramble',
    'games.scramble.tagline': 'Sắp xếp chữ cái thành từ đúng',
    'games.scramble.desc': 'Từ vựng được chọn ngẫu nhiên từ tất cả các bộ thẻ bạn đang học hoặc đã thuộc.',
    'games.scramble.badge': '🌿 Thư giãn',
    'games.race.name': 'Word Race',
    'games.race.tagline': 'Trả lời nhanh nhất có thể',
    'games.race.desc': 'Chọn nghĩa đúng trong 4 đáp án. Đúng +10 điểm, sai −5 giây. Trả lời nhiều nhất trong thời gian cho phép!',
    'games.race.badge': '🏎️ High score',
    'games.detective.name': 'Word Detective',
    'games.detective.tagline': 'Đoán từ qua gợi ý AI',
    'games.detective.desc': 'AI mô tả một từ bằng 5 gợi ý dần dần — từ mơ hồ đến rõ ràng. Đoán sớm để ghi điểm cao!',
    'games.detective.badge': '🧠 AI gợi ý',
    'games.hangman.name': 'Word Hangman',
    'games.hangman.tagline': 'Đoán chữ cái trước khi hết lượt',
    'games.hangman.desc': 'Đoán từng chữ cái để tìm ra từ tiếng Anh. Sai 6 lần là thua! Bí quá thì xin AI gợi ý.',
    'games.hangman.badge': '💀 6 lượt sai',
    'games.bomb.name': 'Word Bomb',
    'games.bomb.tagline': 'Điền từ trước khi bom nổ',
    'games.bomb.desc': 'AI tạo câu có 1 từ bị ẩn — điền đúng trước khi hết giờ. Streak dài càng ít thời gian, điểm càng cao!',
    'games.bomb.badge': '💥 AI ngữ cảnh',

    /* ── Stats page extra ── */
    'stats.progress': 'Tiến độ học tập',
    'stats.history': 'Lịch sử ôn tập',
    'stats.tab7': '7 ngày',
    'stats.tab30': '30 ngày',
    'stats.tabMonth': 'Theo tháng',
    'stats.view': 'Xem',
    'stats.dueWords': 'Từ cần ôn tập sớm nhất',
    'stats.less': 'Ít',
    'stats.more': 'Nhiều',
    'stats.noSampleSets': 'Không có bộ thẻ mẫu.',
    'stats.totalIn7': 'Tổng',
    'stats.reviewsIn7': 'lượt trong 7 ngày',
    'stats.no7Data': 'Chưa có dữ liệu tuần này',
    'stats.activeDays': 'ngày học',
    'stats.reviewsIn30': 'lượt trong 30 ngày',
    'stats.no30Data': 'Chưa có dữ liệu 30 ngày này',
    'stats.reviewsInMonth': 'lượt trong tháng',
    'stats.noMonthData': 'Chưa có dữ liệu tháng này',
    'stats.dayNamesShort': 'CN,T2,T3,T4,T5,T6,T7',
    'stats.monthNamesList': 'Tháng 1,Tháng 2,Tháng 3,Tháng 4,Tháng 5,Tháng 6,Tháng 7,Tháng 8,Tháng 9,Tháng 10,Tháng 11,Tháng 12',

    /* ── Home extra ── */
    'home.greetMorning': 'Chào buổi sáng',
    'home.greetAfternoon': 'Chào buổi chiều',
    'home.greetEvening': 'Chào buổi tối',
    'home.dueHintActive': 'Học ngay để không quên!',
    'home.dueHintLearning': '↑ Sẽ có sau 1–3 ngày',
    'home.dueHintStart': 'Hãy bắt đầu học!',

    /* ── Settings modal ── */
    'settings.title': '⚙️ Cài đặt',
    'settings.profile': 'Hồ sơ',
    'settings.appearance': 'Giao diện',
    'settings.language': 'Ngôn ngữ',
    'settings.logout': 'Đăng xuất',
    'settings.avatar': 'Ảnh đại diện',
    'settings.avatarNote': 'Lấy từ tài khoản Google',
    'settings.displayName': 'Tên hiển thị',
    'settings.displayNamePlaceholder': 'Nhập tên của bạn...',
    'settings.save': 'Lưu',
    'settings.email': 'Email',
    'settings.colorMode': 'Chế độ màu',
    'settings.themeSystem': 'Hệ thống',
    'settings.themeLight': 'Sáng',
    'settings.themeDark': 'Tối',
    'settings.langTitle': 'Ngôn ngữ giao diện',
    'settings.langSubtitle': 'Chọn ngôn ngữ hiển thị',
    'settings.langNote': '⚠️ Tính năng đa ngôn ngữ đang phát triển. Hiện tại giao diện hiển thị tiếng Việt.',

    /* ── Notifications ── */
    'notif.langSwitched': 'Đã chuyển sang Tiếng Việt',
  },

  en: {
    /* ── Login ── */
    'login.tagline': 'Smart vocabulary learning — anytime, anywhere',
    'login.welcome': 'Welcome',
    'login.google': 'Sign in with Google',
    'login.or': 'or',
    'login.offline': '🖥️ Use offline (no sync)',
    'login.note': 'Sign in to sync your data across devices.\nOffline mode saves data on this device only.',

    /* ── Sidebar nav ── */
    'nav.home': 'Home',
    'nav.sets': 'My Sets',
    'nav.mixedquiz': 'Mixed Quiz',
    'nav.games': 'Games',
    'nav.stats': 'Statistics',
    'nav.chat': 'AI Assistant',
    'nav.trash': 'Trash',
    'nav.streak': 'day streak',
    'nav.syncHint': 'Sync your data across all devices',
    'nav.loginGoogle': 'Sign in with Google',

    /* ── Home page ── */
    'home.greeting': 'Hello! 👋',
    'home.subtitle': 'What do you want to learn today?',
    'home.totalCards': 'Total cards',
    'home.mastered': 'Mastered',
    'home.todayStudied': 'Studied today',
    'home.dueReview': 'Due for review today',
    'home.reviewBannerTitle': "Time to review!",
    'home.reviewBannerSub': 'You have {n} cards due for review today — finish them to remember longer!',
    'home.reviewNow': 'Review now →',
    'home.sampleSets': 'Sample Sets — Grade 6 English',
    'home.mySets': 'My Sets',

    /* ── Sets page ── */
    'sets.title': 'My Sets 📚',
    'sets.import': '📥 Import',
    'sets.export': '📤 Export',
    'sets.createAI': '✨ Create with AI',
    'sets.createManual': '+ Create manually',
    'sets.empty': 'No sets yet.\nCreate your first set!',
    'sets.createNow': 'Create now',

    /* ── Study page ── */
    'study.title': 'Flashcards 🎴',
    'study.selectSubtitle': 'Choose a set to start:',
    'study.exit': '← Exit',
    'study.flipHint': 'Tap to flip ↻',
    'study.showAnswer': 'Show answer',
    'study.rateHard': '😓 Hard',
    'study.rateHardSub': 'Review soon',
    'study.rateOk': '🤔 Good',
    'study.rateOkSub': 'In 2 days',
    'study.rateEasy': '😊 Easy',
    'study.rateEasySub': 'In 5 days',
    'study.done': 'Session complete!',
    'study.easy': 'Easy',
    'study.ok': 'Good',
    'study.hard': 'Hard',
    'study.again': 'Study again',
    'study.backHome': 'Back to home',

    /* ── Review ── */
    'review.label': 'Review',
    'review.badge': '⏰ Spaced Repetition Review',
    'review.score': 'Score:',
    'review.listen': '🔊 Listen',
    'review.next': 'Next →',
    'review.done': 'Review complete!',
    'review.correct': 'Correct',
    'review.wrong': 'Wrong',
    'review.again': 'Retry wrong cards',
    'review.backHome': 'Back to home',

    /* ── Quiz page ── */
    'quiz.title': 'Quiz 🧠',
    'quiz.selectSubtitle': 'Choose a set to quiz:',
    'quiz.exit': '← Exit',
    'quiz.qLabel': 'What does this English word mean?',
    'quiz.score': 'Score:',
    'quiz.listen': '🔊 Listen',
    'quiz.submit': 'Submit ✓',
    'quiz.next': 'Next →',
    'quiz.result': 'Quiz results',
    'quiz.correct': 'Correct',
    'quiz.wrong': 'Wrong',
    'quiz.again': 'Try again',
    'quiz.backHome': 'Back to home',
    'quiz.essayPlaceholder': 'Type your answer...',

    /* ── Stats page ── */
    'stats.title': 'Statistics 📊',

    /* ── Chat page ── */
    'chat.title': 'AI Assistant 💬',
    'chat.subtitle': 'Ask about vocabulary, grammar, or how to learn English effectively',

    /* ── Trash page ── */
    'trash.title': 'Trash 🗑️',
    'trash.subtitle': 'Deleted sets — restore or delete permanently',
    'trash.clearAll': '🗑 Delete all',
    'trash.emptyTitle': 'Trash is empty.',
    'trash.emptyDesc': 'Deleted sets will appear here.',
    'trash.words': 'words',
    'trash.deletedAt': 'Deleted',
    'trash.restore': '↩ Restore',
    'trash.deletePerm': '🗑 Delete permanently',

    /* ── Mixed quiz ── */
    'mixedquiz.title': 'Mixed Quiz 🎯',
    'mixedquiz.subtitle': 'Select the sets to combine:',
    'mixedquiz.modeLabel': 'Quiz mode',
    'mixedquiz.modeMultiple': 'Multiple choice',
    'mixedquiz.modeEssay': 'Written answer',
    'mixedquiz.modeRandom': 'Random',
    'mixedquiz.countLabel': 'Number of questions',
    'mixedquiz.count10': '10 questions',
    'mixedquiz.count15': '15 questions',
    'mixedquiz.count20': '20 questions',
    'mixedquiz.count30': '30 questions',
    'mixedquiz.start': '🚀 Start quiz',
    'mixedquiz.selectAtLeast2': '👆 Select at least 2 sets to start the mixed quiz',

    /* ── Games hub ── */
    'games.title': 'Games 🎮',
    'games.subtitle': 'Choose a game to start:',
    'games.scramble.name': 'Word Scramble',
    'games.scramble.tagline': 'Unscramble the letters into the right word',
    'games.scramble.desc': 'Words are picked randomly from all the sets you are learning or have mastered.',
    'games.scramble.badge': '🌿 Relaxed',
    'games.race.name': 'Word Race',
    'games.race.tagline': 'Answer as fast as you can',
    'games.race.desc': 'Pick the correct meaning out of 4 choices. Correct +10 points, wrong −5 seconds. Answer as many as you can before time runs out!',
    'games.race.badge': '🏎️ High score',
    'games.detective.name': 'Word Detective',
    'games.detective.tagline': 'Guess the word from AI clues',
    'games.detective.desc': 'AI describes a word with 5 progressive clues — from vague to clear. Guess early to score higher!',
    'games.detective.badge': '🧠 AI hints',
    'games.hangman.name': 'Word Hangman',
    'games.hangman.tagline': 'Guess the letters before you run out of turns',
    'games.hangman.desc': 'Guess each letter to reveal the English word. 6 wrong guesses and you lose! Stuck? Ask AI for a hint.',
    'games.hangman.badge': '💀 6 wrong guesses',
    'games.bomb.name': 'Word Bomb',
    'games.bomb.tagline': 'Fill in the word before the bomb explodes',
    'games.bomb.desc': 'AI generates a sentence with one hidden word — fill it in before time runs out. Longer streaks, less time, higher score!',
    'games.bomb.badge': '💥 AI context',

    /* ── Stats page extra ── */
    'stats.progress': 'Learning progress',
    'stats.history': 'Review history',
    'stats.tab7': '7 days',
    'stats.tab30': '30 days',
    'stats.tabMonth': 'By month',
    'stats.view': 'View',
    'stats.dueWords': 'Words due for review soonest',
    'stats.less': 'Less',
    'stats.more': 'More',
    'stats.noSampleSets': 'No sample sets.',
    'stats.totalIn7': 'Total',
    'stats.reviewsIn7': 'reviews in 7 days',
    'stats.no7Data': 'No data this week',
    'stats.activeDays': 'active days',
    'stats.reviewsIn30': 'reviews in 30 days',
    'stats.no30Data': 'No data for these 30 days',
    'stats.reviewsInMonth': 'reviews this month',
    'stats.noMonthData': 'No data this month',
    'stats.dayNamesShort': 'Sun,Mon,Tue,Wed,Thu,Fri,Sat',
    'stats.monthNamesList': 'January,February,March,April,May,June,July,August,September,October,November,December',

    /* ── Home extra ── */
    'home.greetMorning': 'Good morning',
    'home.greetAfternoon': 'Good afternoon',
    'home.greetEvening': 'Good evening',
    'home.dueHintActive': "Study now so you don't forget!",
    'home.dueHintLearning': '↑ Coming up in 1–3 days',
    'home.dueHintStart': 'Time to start learning!',

    /* ── Settings modal ── */
    'settings.title': '⚙️ Settings',
    'settings.profile': 'Profile',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language',
    'settings.logout': 'Sign out',
    'settings.avatar': 'Profile picture',
    'settings.avatarNote': 'Taken from your Google account',
    'settings.displayName': 'Display name',
    'settings.displayNamePlaceholder': 'Enter your name...',
    'settings.save': 'Save',
    'settings.email': 'Email',
    'settings.colorMode': 'Color mode',
    'settings.themeSystem': 'System',
    'settings.themeLight': 'Light',
    'settings.themeDark': 'Dark',
    'settings.langTitle': 'Interface language',
    'settings.langSubtitle': 'Choose display language',
    'settings.langNote': '✅ Language switching is active. Select your preferred language above.',

    /* ── Notifications ── */
    'notif.langSwitched': 'Switched to English',
  }
};

/* ── Current language ── */
const LANG_KEY = 'vocalearn_lang';

function getLang() {
  return localStorage.getItem(LANG_KEY) || 'vi';
}

function t(key) {
  const lang = getLang();
  return (I18N[lang] && I18N[lang][key]) || (I18N['vi'] && I18N['vi'][key]) || key;
}

/* ── Templated translation: replaces {placeholders} with values ── */
function tf(key, params) {
  let str = t(key);
  if (params) {
    Object.keys(params).forEach(k => {
      str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
    });
  }
  return str;
}

/* ── Returns a comma-list translation key as an array ── */
function tList(key) {
  return t(key).split(',');
}

/* ── Apply translations to the DOM ── */
function applyLang(lang) {
  if (lang) localStorage.setItem(LANG_KEY, lang);
  const cur = getLang();

  // Update <html lang="">
  document.documentElement.lang = cur;

  // Apply all data-i18n attributes (text content)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (val) el.textContent = val;
  });

  // Apply data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const val = t(key);
    if (val) el.placeholder = val;
  });

  // Apply data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const val = t(key);
    if (val) el.title = val;
  });

  // Update page <title>
  document.title = cur === 'en'
    ? 'VocaLearn – Smart English Vocabulary Learning'
    : 'VocaLearn – Học từ vựng tiếng Anh thông minh';

  // Update lang note in settings
  const langNote = document.getElementById('settingsLangNote');
  if (langNote) langNote.textContent = t('settings.langNote');

  // Mark active lang button
  document.querySelectorAll('.settings-lang-opt').forEach(btn => {
    btn.classList.toggle('active', btn.id === 'slang-' + cur);
  });

  // Re-render dynamic (JS-generated) page content so it picks up the new language too
  if (typeof window.refreshDynamicPageText === 'function') {
    window.refreshDynamicPageText();
  }
}

/* Run on page load */
document.addEventListener('DOMContentLoaded', () => {
  applyLang();
});