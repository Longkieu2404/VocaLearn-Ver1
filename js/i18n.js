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
    'home.reviewBannerSub': 'Bạn có thẻ cần ôn để không bị quên.',
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

    /* ── Mixed quiz ── */
    'mixedquiz.title': 'Kiểm tra tổng hợp 🎯',

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
    'home.reviewBannerSub': 'You have cards due so you don\'t forget them.',
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

    /* ── Mixed quiz ── */
    'mixedquiz.title': 'Mixed Quiz 🎯',

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
}

/* Run on page load */
document.addEventListener('DOMContentLoaded', () => {
  applyLang();
});
