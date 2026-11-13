// Lightweight i18n. English and Hindi are fully implemented for the core learner
// experience (navigation, dashboard, lessons, quiz, settings). Other pages are English only.
export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', available: true },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', available: true },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', available: false },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', available: false },
  { code: 'mr', label: 'Marathi', native: 'मराठी', available: false },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', available: false },
];

const en = {
  'nav.skip': 'Skip to main content', 'nav.menu': 'Menu', 'nav.dashboard': 'Dashboard', 'nav.lessons': 'Lessons',
  'nav.learn': 'One Concept, Many Ways', 'nav.quiz': 'Quizzes', 'nav.tools': 'Study materials', 'nav.growth': 'GrowthQuest',
  'nav.parent': 'ParentBridge', 'nav.teacher': 'Teacher dashboard', 'nav.settings': 'Settings', 'nav.logout': 'Log out',
  'nav.learner': 'Learn', 'nav.family': 'Family and class', 'nav.account': 'Account',
  'common.back': 'Back', 'common.next': 'Next', 'common.previous': 'Previous', 'common.save': 'Save', 'common.cancel': 'Cancel',
  'common.delete': 'Delete', 'common.edit': 'Edit', 'common.close': 'Close', 'common.search': 'Search', 'common.all': 'All',
  'common.continue': 'Continue', 'common.retry': 'Try again', 'common.bookmark': 'Bookmark', 'common.bookmarked': 'Bookmarked',
  'common.language': 'Language', 'common.demo': 'Demo data', 'common.start': 'Start', 'common.open': 'Open', 'common.min': 'min',
  'common.beginner': 'Beginner', 'common.intermediate': 'Intermediate', 'common.sample': 'Sample data',
  'dash.hello': 'Welcome back, {name}', 'dash.sub': "Here's your learning plan for today.", 'dash.streak': 'day streak',
  'dash.xp': 'XP', 'dash.level': 'Level {n}', 'dash.continue': 'Continue learning', 'dash.recommended': 'Recommended for you',
  'dash.recent': 'Recently studied', 'dash.mastery': 'Topic mastery', 'dash.weekly': "This week's learning",
  'dash.goals': 'Learning goals', 'dash.quick': 'Quick links', 'dash.addGoal': 'Add goal', 'dash.goalPlaceholder': 'Write a new goal',
  'dash.emptyRecent': 'No lessons studied yet. Open a lesson to get started.', 'dash.minutesLabel': 'Minutes studied',
  'dash.whyRec': 'Why this lesson', 'dash.noGoals': 'No goals yet. Add one to stay on track.',
  'dash.quickQuiz': 'Take a quiz', 'dash.quickStudy': 'Transform study material', 'dash.quickBookmarks': 'Bookmarked lessons', 'dash.quickAccess': 'Language and accessibility',
  'dash.estimated': 'Minutes are estimated from lesson activity.',
  'lesson.simple': 'Simple explanation', 'lesson.visual': 'Visual summary', 'lesson.listen': 'Listen',
  'lesson.example': 'Real-life example', 'lesson.practice': 'Practice',
  'lesson.simpleShort': 'Simple', 'lesson.visualShort': 'Visual', 'lesson.listenShort': 'Listen', 'lesson.exampleShort': 'Example', 'lesson.practiceShort': 'Practice',
  'lesson.chooseTopic': 'Choose a topic', 'lesson.textSize': 'Text size', 'lesson.smaller': 'Smaller text', 'lesson.larger': 'Larger text',
  'lesson.reading': 'Reading mode', 'lesson.explored': '{n} of 5 ways explored', 'lesson.keyPoints': 'Key points',
  'lesson.complete': 'Mark lesson complete', 'lesson.done': 'Lesson complete', 'lesson.prev': 'Previous lesson', 'lesson.nextL': 'Next lesson',
  'lesson.fallback': 'This lesson has no Hindi version yet, so the English text is shown.',
  'lesson.play': 'Play', 'lesson.pause': 'Pause', 'lesson.resume': 'Resume', 'lesson.stop': 'Stop', 'lesson.speed': 'Speed',
  'lesson.noSpeech': "This browser doesn't support spoken audio. Read the transcript below instead.",
  'lesson.noVoice': "No Hindi voice was found on this device, so the voice may sound different or be silent. Try Chrome or Edge, or install a Hindi voice.",
  'lesson.transcript': 'Transcript', 'lesson.takeQuiz': 'Take the quiz for this lesson', 'lesson.practiceIntro': 'Pick an answer to get feedback straight away.',
  'lesson.connect': 'How the example connects', 'lesson.visualHint': 'Use the buttons and sliders to explore the diagram.', 'lesson.masteryHint': 'Updates after every quiz', 'lesson.options': 'Topic, language and reading options',
  'lesson.score': '{c} of {t} correct', 'lesson.practiceDone': 'Practice finished', 'lesson.listenHint': 'Listening to the lesson, one paragraph at a time.',
  'lesson.progress': 'Lesson progress', 'lesson.bookmarkAdded': 'Lesson bookmarked', 'lesson.bookmarkRemoved': 'Bookmark removed',
  'lesson.completedToast': 'Lesson complete. +20 XP', 'lesson.notFound': 'We could not find that lesson.', 'lesson.browse': 'Browse lessons',
  'lesson.focusMode': 'Focus', 'lesson.mastery': 'Your mastery', 'lesson.formatsTitle': 'Choose a way to learn',
  'lib.title': 'Lesson library', 'lib.search': 'Search lessons', 'lib.subject': 'Subject', 'lib.level': 'Level', 'lib.bookmarked': 'Bookmarked only',
  'lib.empty': 'No lessons match your filters.', 'lib.clear': 'Clear filters', 'lib.teacherMade': 'Teacher-made', 'lib.count': '{n} lessons',
  'quiz.title': 'Adaptive quiz', 'quiz.pick': 'Choose a quiz', 'quiz.mixed': 'Mixed review', 'quiz.mixedDesc': 'Questions from your weakest topics first.',
  'quiz.qOf': 'Question {n} of {t}', 'quiz.check': 'Check answer', 'quiz.next': 'Next question', 'quiz.see': 'See results',
  'quiz.correct': 'Correct', 'quiz.wrong': 'Not quite', 'quiz.yours': 'Your answer', 'quiz.right': 'Correct answer',
  'quiz.results': 'Your results', 'quiz.review': 'Review your answers', 'quiz.retryAll': 'Retry full quiz', 'quiz.retryMissed': 'Retry missed questions',
  'quiz.nextSteps': 'What to study next', 'quiz.best': 'Best score', 'quiz.leave': 'Leave quiz', 'quiz.selectOne': 'Select an answer to continue.',
  'quiz.explanation': 'Why', 'quiz.progressSaved': 'Progress saved on this device.', 'quiz.masteryUpdate': 'Mastery updated',
  'quiz.questions': '{n} questions', 'quiz.last': 'Last score', 'quiz.notTaken': 'Not taken yet', 'quiz.leaveBody': 'Your answers so far will not be saved.',
  'quiz.stay': 'Keep going', 'quiz.noQuestions': 'This lesson has no quiz questions yet.', 'quiz.topicBreakdown': 'By topic', 'quiz.open': 'Open lesson',
  'quiz.excellent': 'Excellent work', 'quiz.good': 'Good progress', 'quiz.keepGoing': "Keep going — this is how learning works", 'quiz.reviewFormat': 'Study this in the {format} format',
  'rec.prereq': 'You missed questions on {tags}. Start with this beginner lesson.',
  'rec.revisit': 'Revisit {tags} in a different format.',
  'rec.next': 'Strong result. Next, strengthen a topic where your mastery is lower.',
  'rec.profile': 'Matches your interests and level.', 'rec.low': 'Your mastery here is still growing.', 'rec.continue': 'Pick up where you left off.',
  'set.title': 'Language and accessibility', 'set.sub': 'Changes apply immediately and are saved on this device.',
  'set.language': 'Preferred language', 'set.languageNote': 'English and Hindi are fully available in navigation, dashboard, lessons, quizzes and settings. Other languages are not available yet.',
  'set.soon': 'Not available yet', 'set.textSize': 'Text size', 'set.motion': 'Reduce motion', 'set.motionDesc': 'Turns off animations and smooth scrolling.',
  'set.theme': 'Colour theme', 'set.light': 'Light', 'set.dark': 'Dark', 'set.contrast': 'High contrast', 'set.reading': 'Reading-friendly mode',
  'set.readingDesc': 'Uses the Lexend typeface, wider spacing and a calmer background.', 'set.format': 'Preferred lesson format',
  'set.audio': 'Audio playback', 'set.rate': 'Speaking speed', 'set.autoplay': 'Start audio when I open the Listen format', 'set.highlight': 'Highlight the paragraph being read',
  'set.preview': 'Live preview', 'set.previewText': 'Plants make their own food using sunlight, water and air. This preview follows your text size, theme and reading settings.',
  'set.reset': 'Reset to defaults', 'set.saved': 'Settings saved', 'set.data': 'Demo data', 'set.resetProgress': 'Reset demo progress', 'set.resetAll': 'Reset everything',
  'set.dataDesc': 'All data lives only in this browser. Nothing is sent anywhere.',
};

const hi = {
  'nav.skip': 'मुख्य सामग्री पर जाएँ', 'nav.menu': 'मेनू', 'nav.dashboard': 'डैशबोर्ड', 'nav.lessons': 'पाठ',
  'nav.learn': 'एक विचार, कई तरीके', 'nav.quiz': 'क्विज़', 'nav.tools': 'अध्ययन सामग्री', 'nav.growth': 'ग्रोथक्वेस्ट',
  'nav.parent': 'पेरेंटब्रिज', 'nav.teacher': 'शिक्षक डैशबोर्ड', 'nav.settings': 'सेटिंग्स', 'nav.logout': 'लॉग आउट',
  'nav.learner': 'सीखें', 'nav.family': 'परिवार और कक्षा', 'nav.account': 'खाता',
  'common.back': 'वापस', 'common.next': 'आगे', 'common.previous': 'पीछे', 'common.save': 'सहेजें', 'common.cancel': 'रद्द करें',
  'common.delete': 'हटाएँ', 'common.edit': 'संपादित करें', 'common.close': 'बंद करें', 'common.search': 'खोजें', 'common.all': 'सभी',
  'common.continue': 'जारी रखें', 'common.retry': 'फिर कोशिश करें', 'common.bookmark': 'बुकमार्क', 'common.bookmarked': 'बुकमार्क किया',
  'common.language': 'भाषा', 'common.demo': 'डेमो डेटा', 'common.start': 'शुरू करें', 'common.open': 'खोलें', 'common.min': 'मिनट',
  'common.beginner': 'शुरुआती', 'common.intermediate': 'मध्यम', 'common.sample': 'नमूना डेटा',
  'dash.hello': 'नमस्ते, {name}', 'dash.sub': 'आज के लिए आपकी सीखने की योजना यह रही।', 'dash.streak': 'दिन की लगातार सीख',
  'dash.xp': 'अनुभव अंक', 'dash.level': 'स्तर {n}', 'dash.continue': 'सीखना जारी रखें', 'dash.recommended': 'आपके लिए सुझाव',
  'dash.recent': 'हाल में पढ़े गए', 'dash.mastery': 'विषयों में पकड़', 'dash.weekly': 'इस सप्ताह की सीख',
  'dash.goals': 'सीखने के लक्ष्य', 'dash.quick': 'त्वरित लिंक', 'dash.addGoal': 'लक्ष्य जोड़ें', 'dash.goalPlaceholder': 'नया लक्ष्य लिखें',
  'dash.emptyRecent': 'अभी तक कोई पाठ नहीं पढ़ा। कोई पाठ खोलकर शुरू करें।', 'dash.minutesLabel': 'पढ़ाई के मिनट',
  'dash.whyRec': 'यह पाठ क्यों', 'dash.noGoals': 'अभी कोई लक्ष्य नहीं है। राह पर रहने के लिए एक जोड़ें।',
  'dash.quickQuiz': 'क्विज़ दें', 'dash.quickStudy': 'अध्ययन सामग्री बदलें', 'dash.quickBookmarks': 'बुकमार्क किए पाठ', 'dash.quickAccess': 'भाषा और सुलभता',
  'dash.estimated': 'मिनट पाठ की गतिविधि से अनुमानित हैं।',
  'lesson.simple': 'सरल व्याख्या', 'lesson.visual': 'दृश्य सारांश', 'lesson.listen': 'सुनें',
  'lesson.example': 'रोज़मर्रा का उदाहरण', 'lesson.practice': 'अभ्यास',
  'lesson.simpleShort': 'सरल', 'lesson.visualShort': 'दृश्य', 'lesson.listenShort': 'सुनें', 'lesson.exampleShort': 'उदाहरण', 'lesson.practiceShort': 'अभ्यास',
  'lesson.chooseTopic': 'विषय चुनें', 'lesson.textSize': 'अक्षर का आकार', 'lesson.smaller': 'अक्षर छोटे करें', 'lesson.larger': 'अक्षर बड़े करें',
  'lesson.reading': 'पढ़ने में आसान मोड', 'lesson.explored': '5 में से {n} तरीके देखे', 'lesson.keyPoints': 'मुख्य बातें',
  'lesson.complete': 'पाठ पूरा करें', 'lesson.done': 'पाठ पूरा हुआ', 'lesson.prev': 'पिछला पाठ', 'lesson.nextL': 'अगला पाठ',
  'lesson.fallback': 'इस पाठ का हिंदी संस्करण अभी उपलब्ध नहीं है, इसलिए अंग्रेज़ी पाठ दिखाया जा रहा है।',
  'lesson.play': 'चलाएँ', 'lesson.pause': 'रोकें', 'lesson.resume': 'फिर चलाएँ', 'lesson.stop': 'बंद करें', 'lesson.speed': 'गति',
  'lesson.noSpeech': 'इस ब्राउज़र में बोलकर पढ़ने की सुविधा नहीं है। इसके बजाय नीचे का लिखित पाठ पढ़ें।',
  'lesson.noVoice': 'इस डिवाइस पर हिंदी आवाज़ नहीं मिली, इसलिए आवाज़ अलग लग सकती है या चुप रह सकती है। Chrome या Edge आज़माएँ, या हिंदी आवाज़ इंस्टॉल करें।',
  'lesson.transcript': 'लिखित पाठ', 'lesson.takeQuiz': 'इस पाठ का क्विज़ दें', 'lesson.practiceIntro': 'उत्तर चुनें और तुरंत फ़ीडबैक पाएँ।',
  'lesson.connect': 'उदाहरण का पाठ से संबंध', 'lesson.visualHint': 'चित्र को समझने के लिए बटन और स्लाइडर इस्तेमाल करें।', 'lesson.masteryHint': 'हर क्विज़ के बाद अपडेट होता है', 'lesson.options': 'विषय, भाषा और पढ़ने के विकल्प',
  'lesson.score': '{t} में से {c} सही', 'lesson.practiceDone': 'अभ्यास पूरा हुआ', 'lesson.listenHint': 'पाठ एक-एक अनुच्छेद करके सुनाया जा रहा है।',
  'lesson.progress': 'पाठ की प्रगति', 'lesson.bookmarkAdded': 'पाठ बुकमार्क हो गया', 'lesson.bookmarkRemoved': 'बुकमार्क हटाया गया',
  'lesson.completedToast': 'पाठ पूरा हुआ। +20 XP', 'lesson.notFound': 'वह पाठ नहीं मिला।', 'lesson.browse': 'पाठ देखें',
  'lesson.focusMode': 'ध्यान', 'lesson.mastery': 'आपकी पकड़', 'lesson.formatsTitle': 'सीखने का तरीका चुनें',
  'lib.title': 'पाठ पुस्तकालय', 'lib.search': 'पाठ खोजें', 'lib.subject': 'विषय', 'lib.level': 'स्तर', 'lib.bookmarked': 'सिर्फ़ बुकमार्क किए',
  'lib.empty': 'आपके फ़िल्टर से कोई पाठ नहीं मिला।', 'lib.clear': 'फ़िल्टर हटाएँ', 'lib.teacherMade': 'शिक्षक द्वारा बनाया', 'lib.count': '{n} पाठ',
  'quiz.title': 'अनुकूली क्विज़', 'quiz.pick': 'क्विज़ चुनें', 'quiz.mixed': 'मिश्रित समीक्षा', 'quiz.mixedDesc': 'पहले आपके सबसे कमज़ोर विषयों के प्रश्न।',
  'quiz.qOf': 'प्रश्न {n} / {t}', 'quiz.check': 'उत्तर जाँचें', 'quiz.next': 'अगला प्रश्न', 'quiz.see': 'परिणाम देखें',
  'quiz.correct': 'सही', 'quiz.wrong': 'अभी सही नहीं', 'quiz.yours': 'आपका उत्तर', 'quiz.right': 'सही उत्तर',
  'quiz.results': 'आपके परिणाम', 'quiz.review': 'उत्तरों की समीक्षा', 'quiz.retryAll': 'पूरा क्विज़ दोबारा दें', 'quiz.retryMissed': 'छूटे प्रश्न दोबारा दें',
  'quiz.nextSteps': 'आगे क्या पढ़ें', 'quiz.best': 'सर्वश्रेष्ठ स्कोर', 'quiz.leave': 'क्विज़ छोड़ें', 'quiz.selectOne': 'आगे बढ़ने के लिए एक उत्तर चुनें।',
  'quiz.explanation': 'क्यों', 'quiz.progressSaved': 'प्रगति इस डिवाइस पर सहेज ली गई।', 'quiz.masteryUpdate': 'पकड़ अपडेट हुई',
  'quiz.questions': '{n} प्रश्न', 'quiz.last': 'पिछला स्कोर', 'quiz.notTaken': 'अभी नहीं दिया', 'quiz.leaveBody': 'अब तक के आपके उत्तर सहेजे नहीं जाएँगे।',
  'quiz.stay': 'जारी रखें', 'quiz.noQuestions': 'इस पाठ के लिए अभी कोई क्विज़ प्रश्न नहीं है।', 'quiz.topicBreakdown': 'विषय के अनुसार', 'quiz.open': 'पाठ खोलें',
  'quiz.excellent': 'शानदार काम', 'quiz.good': 'अच्छी प्रगति', 'quiz.keepGoing': 'लगे रहिए — सीखना ऐसे ही होता है', 'quiz.reviewFormat': 'इसे {format} तरीके से पढ़ें',
  'rec.prereq': 'आपने {tags} के प्रश्न छोड़े। पहले यह शुरुआती पाठ पढ़ें।',
  'rec.revisit': '{tags} को दूसरे तरीके से दोहराएँ।',
  'rec.next': 'बढ़िया नतीजा। अब उस विषय को मज़बूत करें जिसमें आपकी पकड़ कम है।',
  'rec.profile': 'आपकी रुचि और स्तर से मेल खाता है।', 'rec.low': 'यहाँ आपकी पकड़ अभी बढ़ रही है।', 'rec.continue': 'जहाँ छोड़ा था वहीं से शुरू करें।',
  'set.title': 'भाषा और सुलभता', 'set.sub': 'बदलाव तुरंत लागू होते हैं और इस डिवाइस पर सहेजे जाते हैं।',
  'set.language': 'पसंदीदा भाषा', 'set.languageNote': 'नेविगेशन, डैशबोर्ड, पाठ, क्विज़ और सेटिंग्स में अंग्रेज़ी और हिंदी पूरी तरह उपलब्ध हैं। अन्य भाषाएँ अभी उपलब्ध नहीं हैं।',
  'set.soon': 'अभी उपलब्ध नहीं', 'set.textSize': 'अक्षर का आकार', 'set.motion': 'गति कम करें', 'set.motionDesc': 'एनिमेशन और स्मूद स्क्रॉल बंद करता है।',
  'set.theme': 'रंग थीम', 'set.light': 'हल्की', 'set.dark': 'गहरी', 'set.contrast': 'उच्च कंट्रास्ट', 'set.reading': 'पढ़ने में आसान मोड',
  'set.readingDesc': 'Lexend फ़ॉन्ट, ज़्यादा दूरी और शांत पृष्ठभूमि का उपयोग करता है।', 'set.format': 'पसंदीदा पाठ तरीका',
  'set.audio': 'ऑडियो प्लेबैक', 'set.rate': 'बोलने की गति', 'set.autoplay': 'सुनें तरीका खोलते ही ऑडियो शुरू करें', 'set.highlight': 'जो अनुच्छेद पढ़ा जा रहा है उसे हाइलाइट करें',
  'set.preview': 'लाइव पूर्वावलोकन', 'set.previewText': 'पौधे सूरज की रोशनी, पानी और हवा से अपना भोजन खुद बनाते हैं। यह पूर्वावलोकन आपके अक्षर आकार, थीम और पढ़ने की सेटिंग दिखाता है।',
  'set.reset': 'डिफ़ॉल्ट पर लौटें', 'set.saved': 'सेटिंग्स सहेजी गईं', 'set.data': 'डेमो डेटा', 'set.resetProgress': 'डेमो प्रगति रीसेट करें', 'set.resetAll': 'सब कुछ रीसेट करें',
  'set.dataDesc': 'सारा डेटा सिर्फ़ इस ब्राउज़र में रहता है। कुछ भी कहीं भेजा नहीं जाता।',
};

export const STRINGS = { en, hi };

export function makeT(lang) {
  const dict = STRINGS[lang] || en;
  return (key, params) => {
    let s = dict[key] ?? en[key] ?? key;
    if (params) for (const [k, v] of Object.entries(params)) s = s.replaceAll(`{${k}}`, v);
    return s;
  };
}

/** Pick a localized value from {en, hi}. Falls back to English. */
export function pick(value, lang) {
  if (value == null) return value;
  if (typeof value === 'string' || Array.isArray(value)) return value;
  return value[lang] ?? value.en;
}
export const hasLang = (value, lang) => !!value && typeof value === 'object' && !Array.isArray(value) && value[lang] != null;
