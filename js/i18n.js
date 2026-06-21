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
/* ── Game UI HTML strings ── */
    'game.correct': 'Đúng',
    'game.wrong': 'Sai',
    'game.wrongSkip': 'Sai/Bỏ',
    'game.wrongAvg': 'Sai TB/từ',
    'game.backToGames': '← Quay lại trò chơi',
    'game.start': 'Bắt đầu!',
    'game.startInvestigate': '🕵️ Bắt đầu điều tra!',
    'game.startBomb': '💣 Bắt đầu!',
    'game.startScramble': '🧩 Bắt đầu!',
    'game.startRace': '🏎️ Bắt đầu!',
    'game.startHangman': '🎯 Bắt đầu!',
    'game.hint': '💡 Gợi ý',
    'game.hintCost': '(-5 điểm)',
    'game.nextHint': 'Gợi ý tiếp (−150đ)',
    'race.dur30label': '30 giây',
    'race.dur30desc': 'Thử nhanh',
    'race.dur60label': '60 giây',
    'race.dur60desc': 'Tiêu chuẩn',
    'race.dur90label': '90 giây',
    'race.dur90desc': 'Thử thách',
    'race.scoring': '✅ Đúng: <b>+10 điểm</b> &nbsp; ❌ Sai: <b>−5 giây</b>',
    'scramble.dur90desc': '30 giây mỗi từ',
    'scramble.dur90label': 'Thử thách',
    'bomb.legendFast': '⚡ Nhanh',
    'bomb.legendStreak': '🔥 Streak',
    'bomb.legendCorrect': '✅ Đúng',
    'bomb.legendWrong': '💥 Sai',
    'hangman.scoring': '💀 Sai <b>6 lần</b> là thua &nbsp;|&nbsp; 💡 Quỹ gợi ý: <b>60đ/từ</b> (Mở ô −25đ • AI −30đ)',

    'settings.aiKeyPrompt': 'Nhập Gemini API Key để sử dụng trợ lý AI',
/* ── Detective game ── */
    'det.poolInfo': 'Word Detective — {n} từ trong pool',
    'det.diffEasy': 'Dễ',
    'det.diffNormal': 'Thường',
    'det.diffHard': 'Khó',
    'det.langVI': 'Tiếng Việt',
    'det.langEN': 'English',
    'det.langBilingual': 'Song ngữ',
    'det.answerPlaceholder': 'Nhập từ tiếng Anh bạn đoán...',
    'det.submitBtn': '✔ Trả lời',
    'det.skipBtn': '⏭ Bỏ qua',
    'det.exitBtn': '← Thoát',
    'det.progressText': 'Từ {cur} / {total}',

    /* ── Scramble game ── */
    'scramble.poolInfo': '🧩 Word Scramble — {n} từ đang học & đã thuộc',
    'scramble.relaxLabel': 'Thư giãn',
    'scramble.relaxDesc': 'Không giới hạn thời gian',
    'scramble.wordUnit': '{n} từ',
    'scramble.exitBtn': '← Thoát',

    /* ── Hangman game ── */
    'hangman.poolInfo': '🎯 Word Hangman — {n} từ trong pool',
    'hangman.wordUnit': '{n} từ',
    'hangman.progressText': 'Từ {cur} / {total}',
    'hangman.skipBtn': '⏭ Bỏ qua',
    'hangman.exitBtn': '← Thoát',
    'hangman.loseSkip': 'Thua/Bỏ qua',

    /* ── Race game ── */
    'race.exitBtn': '← Thoát',

    /* ── Bomb game ── */
    'bomb.exitBtn': '← Thoát',
    'bomb.backBtn': '← Trở về',

    /* ── Review / Quiz ── */
    'review.exitBtn': '← Thoát',
    'quiz.exitMixed': '← Thoát',
    'quiz.questionLabel': 'Nghĩa tiếng Việt của từ này là gì?',
    'mixed.questionLabel': 'Nghĩa tiếng Việt là gì?',
    'mixed.questionLabel2': 'Nghĩa là gì?',

    /* ── Chat page ── */
    'chat.newConversation': '✏️ Cuộc hội thoại mới',
    'chat.newConversationTitle': 'Cuộc hội thoại mới',
    'chat.inputPlaceholder': 'Nhập câu hỏi của bạn...',
    'chat.fileSupport': 'Hỗ trợ: Ảnh (JPG/PNG/WEBP), PDF, Word (.docx), TXT',
    'chat.keySaved': '✅ Gemini API Key đã được lưu',
    'chat.changeKey': 'Đổi key',

    /* ── Create/Edit set modal ── */
    'modal.cancel': 'Hủy',
    'modal.saveSet': 'Lưu bộ thẻ',
    'modal.thumbHint': 'Nhấn để tải ảnh bìa lên',
    'modal.thumbOptional': '(tuỳ chọn)',
    'modal.confirmCancel': 'Hủy',

    /* ── AI modal ── */
    'ai.modalTitle': '✨ Tạo bộ thẻ bằng AI',
    'ai.tabText': '📝 Nhập chủ đề',
    'ai.tabImage': '🖼️ Từ ảnh',
    'ai.tabFile': '📄 Từ file văn bản',
    'ai.imageSupport': 'Hỗ trợ: JPG, PNG, WEBP (tối đa 5MB)',
    'ai.fileSupport': 'Hỗ trợ: TXT (tối đa 2MB)',
    'ai.cancelBtn': 'Hủy',
    'ai.generateBtn': '✨ Tạo bằng AI',
    'ai.saveBtn': '💾 Lưu bộ thẻ',

    /* ── Prompt/Confirm modal ── */
    'promptModal.cancel': 'Hủy',

/* ── Form labels / section headers ── */
    'label.gameMode': 'Chế độ chơi',
    'label.wordCount': 'Số lượng từ',
    'label.timeMode': 'Thời gian chơi',
    'label.wordCountPlay': 'Số từ chơi',
    'label.numWords': '📚 Số từ',
    'label.difficulty': '⚡ Độ khó gợi ý',
    'label.hintLang': '🌐 Ngôn ngữ gợi ý',
    'label.timePerQ': '⏱ Thời gian / câu',
    'label.setName': 'Tên bộ thẻ',
    'label.color': 'Màu sắc',
    'label.wordList': 'Danh sách từ',
    'label.wordListHint': '(mỗi dòng: từ tiếng Anh | phiên âm | nghĩa | ví dụ)',
    'label.topic': 'Chủ đề hoặc danh sách từ muốn học',
    'label.wordCountCreate': 'Số lượng từ muốn tạo',
    'label.uploadImage': 'Tải lên ảnh (ảnh bài học, trang sách, ghi chú...)',
    'label.uploadFile': 'Tải lên file văn bản',
    'label.wordCountExtract': 'Số lượng từ muốn trích xuất',
    'label.wordListEdit': 'Danh sách từ (có thể chỉnh sửa)',
    'label.setNameResult': 'Tên bộ thẻ',
    'label.colorResult': 'Màu sắc',

    /* ── Scramble game session ── */
    'scramble.clueLabel': 'Nghĩa tiếng Việt:',
    'scramble.clearBtn': '🔄 Xóa hết',
    'scramble.checkBtn': '✓ Xác nhận',
    'scramble.readyText': 'Sẵn sàng chưa?',

    /* ── Race game session ── */
    'race.wordLabel': 'Từ tiếng Anh:',

    /* ── Detective game ── */
    'det.configSub': 'Đoán từ qua các gợi ý bí ẩn từ AI',
    'det.aiThinking': 'AI đang nghĩ gợi ý',

    /* ── Hangman game ── */
    'hangman.hintBudget': 'Quỹ gợi ý: {n}đ',
    'hangman.revealBtn': '🔓 Mở ô chữ (−25đ)',
    'hangman.aiHintBtn': '🤖 Gợi ý AI (−30đ)',
    'hangman.revealTitle': 'Mở 1 ô chữ (−25đ)',

    /* ── Bomb game ── */
    'bomb.configSub': 'Điền từ bị ẩn trước khi bom phát nổ!',
    'bomb.inputPlaceholder': 'Nhập từ còn thiếu...',
    'bomb.submitBtn': 'Nổ 💥',
    'bomb.exitTitle': 'Thoát game?',
    'bomb.exitDesc': 'Tiến trình hiện tại sẽ không được lưu.<br>Bạn có chắc muốn thoát không?',
    'bomb.continueBtn': '← Tiếp tục',
    'bomb.exitConfirmBtn': 'Thoát',

    /* ── Mixed quiz ── */
    'mixed.confirmBtn': 'Xác nhận ✓',

/* ── Status badges ── */
    'status.new': 'Chưa học',
    'status.learning': 'Đang học',
    'status.mastered': 'Đã thuộc',

    /* ── Set detail modal buttons ── */
    'set.studyNow': '🎴 Học ngay',
    'set.quizNow': '🧠 Kiểm tra',

    /* ── AI done message ── */
    'ai.doneMsg': '✅ AI đã tạo xong! Kiểm tra và chỉnh sửa nếu cần:',

/* ── Quiz / Study session ── */
    'quiz.nextBtn': 'Câu tiếp →',
    'quiz.scoreBadge': 'Điểm:',
    'quiz.listenBtn': '🔊 Nghe phát âm',
    'quiz.listenTitle': 'Nghe phát âm',
    'quiz.qLabelReview': 'TỪ TIẾNG ANH NÀY NGHĨA LÀ GÌ?',

    /* ── Quiz mode modal ── */
    'quizMode.title': 'Chọn hình thức kiểm tra',
    'quizMode.subtitle': 'Bạn muốn làm bài theo kiểu nào?',
    'quizMode.multiple': 'Trắc nghiệm',
    'quizMode.multipleDesc': 'Chọn đáp án trong 4 lựa chọn',
    'quizMode.essay': 'Tự luận',
    'quizMode.essayDesc': 'Tự nhập nghĩa của từ',
    'quizMode.cancel': 'Huỷ',

    'quiz.qLabelReverse': 'Từ tiếng Anh của nghĩa này là gì?',
    'mixedquiz.title2': 'Tổng hợp',
    'notif.langSwitched': 'Đã chuyển sang Tiếng Việt',

    /* ── Set card buttons ── */
    'set.words': 'từ vựng',
    'set.study': '📖 Học',
    'set.quiz': '✏️ Kiểm tra',
    'set.studyTitle': 'Học thẻ',
    'set.quizTitle': 'Kiểm tra',
    'set.showAll': 'Hiện tất cả ({n} bộ thẻ)',
    'set.seeAll': 'Xem tất cả ({n} bộ thẻ) →',
    'set.seeAllEmpty': 'Xem bộ thẻ của tôi →',
    'set.noUserSets': 'Chưa có bộ thẻ nào. Nhấn + để tạo!',
    'set.modalCreate': 'Tạo bộ thẻ mới',
    'set.modalEdit': 'Sửa bộ thẻ',

    /* ── Validation / Notifications ── */
    'notif.loginFail': 'Đăng nhập thất bại hoặc bị huỷ.',
    'notif.needName': 'Vui lòng nhập <strong>tên bộ thẻ</strong>!',
    'notif.needWords': 'Vui lòng nhập ít nhất <strong>một từ</strong>!',
    'notif.badFormat': 'Định dạng: <code>từ | phiên âm | nghĩa | ví dụ</code>',
    'notif.storageFull': '⚠️ Hết dung lượng lưu trữ! Hãy xóa bớt bộ thẻ cũ rồi thử lại.',
    'notif.deleted': 'Đã chuyển "<strong>{name}</strong>" vào thùng rác.',
    'notif.need2sets': 'Vui lòng chọn <strong>ít nhất 2 bộ thẻ</strong>!',
    'notif.imgTooBig': 'Ảnh quá lớn! Vui lòng chọn ảnh <strong>nhỏ hơn 5MB</strong>.',
    'notif.fileTooBig': 'File quá lớn! Vui lòng chọn file <strong>nhỏ hơn 2MB</strong>.',
    'notif.needTopic': 'Vui lòng nhập <strong>chủ đề</strong> hoặc danh sách từ!',
    'notif.needImage': 'Vui lòng <strong>tải lên ảnh</strong>!',
    'notif.needFile': 'Vui lòng <strong>tải lên file</strong> văn bản!',
    'notif.noWords': 'Không có từ hợp lệ!',
    'notif.needMissingName': 'Thiếu <strong>tên</strong> hoặc danh sách từ!',
    'notif.noReviewToday': 'Không còn thẻ nào cần ôn tập hôm nay! 🎉',
    'notif.imported': 'Đã nhập thành công <strong>{n} bộ thẻ</strong>!',
    'notif.importError': 'Lỗi khi đọc file: <br><small>{msg}</small>',
    'notif.restored': 'Đã khôi phục bộ thẻ <strong>"{name}"</strong>!',
    'notif.deletedPerm': 'Đã xóa vĩnh viễn bộ thẻ.',
    'notif.trashCleared': 'Đã làm trống thùng rác.',
    'notif.geminiSaved': 'Đã lưu Gemini API Key thành công!',
    'notif.geminiSavedSync': 'Đã lưu Gemini API Key thành công! Đang đồng bộ...',
    'notif.geminiInvalid': 'Vui lòng nhập <strong>Gemini API Key</strong> hợp lệ!',
    'notif.aiError': 'Không gửi được tin nhắn 😓 Vui lòng nhấn 🔄 để thử lại.',

    /* ── AI errors ── */
    'ai.badKey': '🔑 <strong>API Key không hợp lệ.</strong><br>Vui lòng kiểm tra và nhập lại key đúng.<br>',
    'ai.noNet': '📡 <strong>Không có kết nối mạng.</strong><br>Vui lòng kiểm tra internet và thử lại.',
    'ai.timeout': '⌛ <strong>Yêu cầu quá thời gian chờ.</strong><br>Vui lòng thử lại.',
    'ai.overload': '🔄 <strong>Server AI của Google đang quá tải.</strong><br>Tất cả model đều tạm thời bận. Vui lòng thử lại sau ít phút.',
    'ai.unavail': '🔄 <strong>Model AI không khả dụng.</strong><br>Đang thử model khác... Vui lòng thử lại.',
    'ai.generic': '❌ <strong>Không thể kết nối AI.</strong><br>Vui lòng kiểm tra API Key và thử lại.',

    /* ── Login page (hardcoded in renderLogin) ── */
    'login.taglineHard': 'Học từ vựng thông minh — mọi lúc, mọi nơi',

    /* ── Race game ── */
    'race.poolInfo': '🏎️ Word Race — {n} từ trong pool',
    'race.needWords': 'Bạn cần học ít nhất 4 từ trước khi chơi! Hãy học thêm từ vựng 📚',
    'race.progress': '{correct} đúng · {wrong} sai',
    'race.excellent': 'Xuất sắc!',
    'race.good': 'Tốt lắm!',
    'race.tryHarder': 'Cố lên!',
    'race.points': '{n} điểm',
    'race.newRecord': '🎉 Kỷ lục mới: {n} điểm!',
    'race.record': 'Kỷ lục: {n} điểm',

    /* ── Bomb game ── */
    'bomb.poolInfo': 'Word Bomb — {n} từ trong pool',
    'bomb.needWords': 'Bạn cần học ít nhất 5 từ trước khi chơi! Hãy học thêm từ vựng nhé 📚',
    'bomb.wordUnit': '{n} từ',
    'bomb.progress': 'Từ {cur} / {total}',
    'bomb.timeOut': 'Hết giờ! Bom nổ!',
    'bomb.answer': 'Đáp án:',
    'bomb.correct': 'Chính xác!',
    'bomb.wrong': 'Sai rồi!',
    'bomb.excellent': '🎉 Xuất sắc! Không bom nào nổ được!',
    'bomb.good': '👍 Tốt lắm! Luyện thêm để phá kỷ lục!',
    'bomb.tryHarder': '💪 Cố lên! Học ngữ cảnh nhiều hơn nhé!',
    'bomb.resultTitle': 'Kết quả Word Bomb',
    'bomb.totalScore': 'Tổng điểm',
    'bomb.highScore': 'Kỷ lục',
    'bomb.correct2': 'Đúng',
    'bomb.maxStreak': 'Streak cao nhất',
    'bomb.statusTimeout': 'Hết giờ',
    'bomb.statusCorrect': 'Đúng',
    'bomb.statusWrong': 'Sai',
    'bomb.playAgain': '🔄 Chơi lại',
    'bomb.back': '← Trở về',
    'bomb.aiError': 'Lỗi AI: {msg}',

    /* ── Chat ── */
    'chat.greeting': 'Tôi là trợ lý AI của VocaLearn. Tôi có thể giúp bạn:<br><br>• Giải thích nghĩa và cách dùng từ vựng<br>• Giải thích ngữ pháp tiếng Anh<br>• Gợi ý cách học từ vựng hiệu quả<br>• Đặt câu ví dụ với từ bạn muốn<br><br>Bạn muốn hỏi gì nào? 😊',
    'chat.offerText': '📚 Bạn muốn tạo bộ thẻ từ vựng về chủ đề gì? Hãy xác nhận hoặc chỉnh sửa bên dưới:',
    'chat.creating': '📚 Đang tạo bộ thẻ từ vựng...',
    'chat.enterTopic': 'Vui lòng nhập chủ đề!',
    'chat.retryBtn': '🔄 Thử lại',

    /* ── Profile modal ── */
    'profile.enterName': 'Nhập tên của bạn:',
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
/* ── Game UI HTML strings ── */
    'game.correct': 'Correct',
    'game.wrong': 'Wrong',
    'game.wrongSkip': 'Wrong/Skip',
    'game.wrongAvg': 'Wrong avg',
    'game.backToGames': '← Back to games',
    'game.start': 'Start!',
    'game.startInvestigate': '🕵️ Start investigating!',
    'game.startBomb': '💣 Start!',
    'game.startScramble': '🧩 Start!',
    'game.startRace': '🏎️ Start!',
    'game.startHangman': '🎯 Start!',
    'game.hint': '💡 Hint',
    'game.hintCost': '(-5 pts)',
    'game.nextHint': 'Next hint (−150pts)',
    'race.dur30label': '30 sec',
    'race.dur30desc': 'Quick',
    'race.dur60label': '60 sec',
    'race.dur60desc': 'Standard',
    'race.dur90label': '90 sec',
    'race.dur90desc': 'Challenge',
    'race.scoring': '✅ Correct: <b>+10 pts</b> &nbsp; ❌ Wrong: <b>−5 sec</b>',
    'scramble.dur90desc': '30 sec per word',
    'scramble.dur90label': 'Challenge',
    'bomb.legendFast': '⚡ Fast',
    'bomb.legendStreak': '🔥 Streak',
    'bomb.legendCorrect': '✅ Correct',
    'bomb.legendWrong': '💥 Wrong',
    'hangman.scoring': '💀 <b>6 wrong</b> and you lose &nbsp;|&nbsp; 💡 Hint budget: <b>60pts/word</b> (Reveal −25pts • AI −30pts)',

    'settings.aiKeyPrompt': 'Enter Gemini API Key to use the AI assistant',
/* ── Detective game ── */
    'det.poolInfo': 'Word Detective — {n} words in pool',
    'det.diffEasy': 'Easy',
    'det.diffNormal': 'Normal',
    'det.diffHard': 'Hard',
    'det.langVI': 'Vietnamese',
    'det.langEN': 'English',
    'det.langBilingual': 'Bilingual',
    'det.answerPlaceholder': 'Type the English word...',
    'det.submitBtn': '✔ Answer',
    'det.skipBtn': '⏭ Skip',
    'det.exitBtn': '← Exit',
    'det.progressText': 'Word {cur} / {total}',

    /* ── Scramble game ── */
    'scramble.poolInfo': '🧩 Word Scramble — {n} words learning & mastered',
    'scramble.relaxLabel': 'Relaxed',
    'scramble.relaxDesc': 'No time limit',
    'scramble.wordUnit': '{n} words',
    'scramble.exitBtn': '← Exit',

    /* ── Hangman game ── */
    'hangman.poolInfo': '🎯 Word Hangman — {n} words in pool',
    'hangman.wordUnit': '{n} words',
    'hangman.progressText': 'Word {cur} / {total}',
    'hangman.skipBtn': '⏭ Skip',
    'hangman.exitBtn': '← Exit',
    'hangman.loseSkip': 'Lost/Skipped',

    /* ── Race game ── */
    'race.exitBtn': '← Exit',

    /* ── Bomb game ── */
    'bomb.exitBtn': '← Exit',
    'bomb.backBtn': '← Back',

    /* ── Review / Quiz ── */
    'review.exitBtn': '← Exit',
    'quiz.exitMixed': '← Exit',
    'quiz.questionLabel': 'What is the Vietnamese meaning of this word?',
    'mixed.questionLabel': 'What is the Vietnamese meaning?',
    'mixed.questionLabel2': 'What is the meaning?',

    /* ── Chat page ── */
    'chat.newConversation': '✏️ New conversation',
    'chat.newConversationTitle': 'New conversation',
    'chat.inputPlaceholder': 'Ask a question...',
    'chat.fileSupport': 'Supports: Images (JPG/PNG/WEBP), PDF, Word (.docx), TXT',
    'chat.keySaved': '✅ Gemini API Key saved',
    'chat.changeKey': 'Change key',

    /* ── Create/Edit set modal ── */
    'modal.cancel': 'Cancel',
    'modal.saveSet': 'Save set',
    'modal.thumbHint': 'Click to upload cover image',
    'modal.thumbOptional': '(optional)',
    'modal.confirmCancel': 'Cancel',

    /* ── AI modal ── */
    'ai.modalTitle': '✨ Create set with AI',
    'ai.tabText': '📝 Enter topic',
    'ai.tabImage': '🖼️ From image',
    'ai.tabFile': '📄 From text file',
    'ai.imageSupport': 'Supports: JPG, PNG, WEBP (max 5MB)',
    'ai.fileSupport': 'Supports: TXT (max 2MB)',
    'ai.cancelBtn': 'Cancel',
    'ai.generateBtn': '✨ Generate with AI',
    'ai.saveBtn': '💾 Save set',

    /* ── Prompt/Confirm modal ── */
    'promptModal.cancel': 'Cancel',

/* ── Form labels / section headers ── */
    'label.gameMode': 'Game mode',
    'label.wordCount': 'Number of words',
    'label.timeMode': 'Time mode',
    'label.wordCountPlay': 'Words to play',
    'label.numWords': '📚 Words',
    'label.difficulty': '⚡ Hint difficulty',
    'label.hintLang': '🌐 Hint language',
    'label.timePerQ': '⏱ Time / question',
    'label.setName': 'Set name',
    'label.color': 'Color',
    'label.wordList': 'Word list',
    'label.wordListHint': '(each line: English word | phonetic | meaning | example)',
    'label.topic': 'Topic or word list to learn',
    'label.wordCountCreate': 'Number of words to create',
    'label.uploadImage': 'Upload image (lesson photo, book page, notes...)',
    'label.uploadFile': 'Upload text file',
    'label.wordCountExtract': 'Number of words to extract',
    'label.wordListEdit': 'Word list (editable)',
    'label.setNameResult': 'Set name',
    'label.colorResult': 'Color',

    /* ── Scramble game session ── */
    'scramble.clueLabel': 'Vietnamese meaning:',
    'scramble.clearBtn': '🔄 Clear',
    'scramble.checkBtn': '✓ Confirm',
    'scramble.readyText': 'Ready?',

    /* ── Race game session ── */
    'race.wordLabel': 'English word:',

    /* ── Detective game ── */
    'det.configSub': 'Guess words from mysterious AI clues',
    'det.aiThinking': 'AI is thinking of hints',

    /* ── Hangman game ── */
    'hangman.hintBudget': 'Hint budget: {n}pts',
    'hangman.revealBtn': '🔓 Reveal letter (−25pts)',
    'hangman.aiHintBtn': '🤖 AI hint (−30pts)',
    'hangman.revealTitle': 'Reveal 1 letter (−25pts)',

    /* ── Bomb game ── */
    'bomb.configSub': 'Fill in the missing word before the bomb explodes!',
    'bomb.inputPlaceholder': 'Type the missing word...',
    'bomb.submitBtn': 'Boom 💥',
    'bomb.exitTitle': 'Exit game?',
    'bomb.exitDesc': 'Current progress will not be saved.<br>Are you sure you want to exit?',
    'bomb.continueBtn': '← Continue',
    'bomb.exitConfirmBtn': 'Exit',

    /* ── Mixed quiz ── */
    'mixed.confirmBtn': 'Confirm ✓',

/* ── Status badges ── */
    'status.new': 'New',
    'status.learning': 'Learning',
    'status.mastered': 'Mastered',

    /* ── Set detail modal buttons ── */
    'set.studyNow': '🎴 Study now',
    'set.quizNow': '🧠 Quiz',

    /* ── AI done message ── */
    'ai.doneMsg': '✅ AI finished! Review and edit if needed:',

/* ── Quiz / Study session ── */
    'quiz.nextBtn': 'Next →',
    'quiz.scoreBadge': 'Score:',
    'quiz.listenBtn': '🔊 Listen',
    'quiz.listenTitle': 'Listen',
    'quiz.qLabelReview': 'WHAT DOES THIS ENGLISH WORD MEAN?',

    /* ── Quiz mode modal ── */
    'quizMode.title': 'Choose quiz type',
    'quizMode.subtitle': 'How would you like to be tested?',
    'quizMode.multiple': 'Multiple choice',
    'quizMode.multipleDesc': 'Choose from 4 options',
    'quizMode.essay': 'Written',
    'quizMode.essayDesc': 'Type the meaning yourself',
    'quizMode.cancel': 'Cancel',

    'quiz.qLabelReverse': 'What English word has this meaning?',
    'mixedquiz.title2': 'Mixed quiz',
    'notif.langSwitched': 'Switched to English',

    /* ── Set card buttons ── */
    'set.words': 'words',
    'set.study': '📖 Study',
    'set.quiz': '✏️ Quiz',
    'set.studyTitle': 'Study cards',
    'set.quizTitle': 'Quiz',
    'set.showAll': 'Show all ({n} sets)',
    'set.seeAll': 'See all ({n} sets) →',
    'set.seeAllEmpty': 'Go to my sets →',
    'set.noUserSets': 'No sets yet. Tap + to create one!',
    'set.modalCreate': 'Create new set',
    'set.modalEdit': 'Edit set',

    /* ── Validation / Notifications ── */
    'notif.loginFail': 'Login failed or was cancelled.',
    'notif.needName': 'Please enter a <strong>set name</strong>!',
    'notif.needWords': 'Please enter at least <strong>one word</strong>!',
    'notif.badFormat': 'Format: <code>word | phonetic | meaning | example</code>',
    'notif.storageFull': '⚠️ Storage full! Please delete some old sets and try again.',
    'notif.deleted': 'Moved "<strong>{name}</strong>" to trash.',
    'notif.need2sets': 'Please select <strong>at least 2 sets</strong>!',
    'notif.imgTooBig': 'Image too large! Please choose an image <strong>smaller than 5MB</strong>.',
    'notif.fileTooBig': 'File too large! Please choose a file <strong>smaller than 2MB</strong>.',
    'notif.needTopic': 'Please enter a <strong>topic</strong> or word list!',
    'notif.needImage': 'Please <strong>upload an image</strong>!',
    'notif.needFile': 'Please <strong>upload a text file</strong>!',
    'notif.noWords': 'No valid words found!',
    'notif.needMissingName': 'Missing <strong>name</strong> or word list!',
    'notif.noReviewToday': 'No cards left for review today! 🎉',
    'notif.imported': 'Successfully imported <strong>{n} sets</strong>!',
    'notif.importError': 'Error reading file: <br><small>{msg}</small>',
    'notif.restored': 'Restored set <strong>"{name}"</strong>!',
    'notif.deletedPerm': 'Set permanently deleted.',
    'notif.trashCleared': 'Trash emptied.',
    'notif.geminiSaved': 'Gemini API Key saved successfully!',
    'notif.geminiSavedSync': 'Gemini API Key saved! Syncing...',
    'notif.geminiInvalid': 'Please enter a valid <strong>Gemini API Key</strong>!',
    'notif.aiError': 'Could not send message 😓 Please tap 🔄 to retry.',

    /* ── AI errors ── */
    'ai.badKey': '🔑 <strong>Invalid API Key.</strong><br>Please check and re-enter the correct key.<br>',
    'ai.noNet': '📡 <strong>No internet connection.</strong><br>Please check your connection and try again.',
    'ai.timeout': '⌛ <strong>Request timed out.</strong><br>Please try again.',
    'ai.overload': '🔄 <strong>Google AI servers are overloaded.</strong><br>All models are temporarily busy. Please try again in a moment.',
    'ai.unavail': '🔄 <strong>AI model unavailable.</strong><br>Trying another model... Please try again.',
    'ai.generic': '❌ <strong>Cannot connect to AI.</strong><br>Please check your API Key and try again.',

    /* ── Login page (hardcoded in renderLogin) ── */
    'login.taglineHard': 'Smart vocabulary learning — anytime, anywhere',

    /* ── Race game ── */
    'race.poolInfo': '🏎️ Word Race — {n} words in pool',
    'race.needWords': 'You need to study at least 4 words before playing! Learn more vocabulary 📚',
    'race.progress': '{correct} correct · {wrong} wrong',
    'race.excellent': 'Excellent!',
    'race.good': 'Well done!',
    'race.tryHarder': 'Keep going!',
    'race.points': '{n} points',
    'race.newRecord': '🎉 New record: {n} points!',
    'race.record': 'Record: {n} points',

    /* ── Bomb game ── */
    'bomb.poolInfo': 'Word Bomb — {n} words in pool',
    'bomb.needWords': 'You need to study at least 5 words before playing! Learn more vocabulary 📚',
    'bomb.wordUnit': '{n} words',
    'bomb.progress': 'Word {cur} / {total}',
    'bomb.timeOut': 'Time\'s up! Bomb exploded!',
    'bomb.answer': 'Answer:',
    'bomb.correct': 'Correct!',
    'bomb.wrong': 'Wrong!',
    'bomb.excellent': '🎉 Excellent! No bombs exploded!',
    'bomb.good': '👍 Well done! Practice more to beat the record!',
    'bomb.tryHarder': '💪 Keep going! Learn more context!',
    'bomb.resultTitle': 'Word Bomb Results',
    'bomb.totalScore': 'Total score',
    'bomb.highScore': 'Record',
    'bomb.correct2': 'Correct',
    'bomb.maxStreak': 'Best streak',
    'bomb.statusTimeout': 'Timed out',
    'bomb.statusCorrect': 'Correct',
    'bomb.statusWrong': 'Wrong',
    'bomb.playAgain': '🔄 Play again',
    'bomb.back': '← Back',
    'bomb.aiError': 'AI error: {msg}',

    /* ── Chat ── */
    'chat.greeting': 'I\'m VocaLearn\'s AI Assistant. I can help you:<br><br>• Explain word meanings and usage<br>• Explain English grammar<br>• Suggest effective vocabulary learning tips<br>• Make example sentences with any word<br><br>What would you like to ask? 😊',
    'chat.offerText': '📚 What topic would you like to create a vocabulary set about? Confirm or edit below:',
    'chat.creating': '📚 Creating vocabulary set...',
    'chat.enterTopic': 'Please enter a topic!',
    'chat.retryBtn': '🔄 Retry',

    /* ── Profile modal ── */
    'profile.enterName': 'Enter your name:',
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

  // Apply data-i18n-html (innerHTML for strings containing HTML tags)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    const val = t(key);
    if (val) el.innerHTML = val;
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