// '3urfti — sample data for the prototype.
// In the real app these come from the database (see ARCHITECTURE.md §3).

// The regions universities belong to (shown under each name in the college search).
// Each region's name in English and Arabic is in js/i18n.js ("region.me", "region.uk", …).
const UNI_REGIONS = ["me", "uk", "us", "ca", "au", "asia"];

const UNIVERSITIES = [
  // Middle East & North Africa
  { key: "kuniv", region: "me", en: "Kuwait University", ar: "جامعة الكويت" },
  { key: "auk", region: "me", en: "American University of Kuwait", ar: "الجامعة الأمريكية في الكويت" },
  { key: "gust", region: "me", en: "Gulf University for Science & Technology", ar: "جامعة الخليج للعلوم والتكنولوجيا" },
  { key: "aum", region: "me", en: "American University of the Middle East", ar: "الجامعة الأمريكية في الشرق الأوسط" },
  { key: "aub", region: "me", en: "American University of Beirut", ar: "الجامعة الأمريكية في بيروت" },
  { key: "aus", region: "me", en: "American University of Sharjah", ar: "الجامعة الأمريكية في الشارقة" },
  { key: "khalifa", region: "me", en: "Khalifa University", ar: "جامعة خليفة" },
  { key: "nyuad", region: "me", en: "NYU Abu Dhabi", ar: "جامعة نيويورك أبوظبي" },
  { key: "qu", region: "me", en: "Qatar University", ar: "جامعة قطر" },
  { key: "ksu", region: "me", en: "King Saud University", ar: "جامعة الملك سعود" },
  { key: "kfupm", region: "me", en: "King Fahd University of Petroleum & Minerals", ar: "جامعة الملك فهد للبترول والمعادن" },
  { key: "uob", region: "me", en: "University of Bahrain", ar: "جامعة البحرين" },
  { key: "squ", region: "me", en: "Sultan Qaboos University", ar: "جامعة السلطان قابوس" },
  { key: "uj", region: "me", en: "University of Jordan", ar: "الجامعة الأردنية" },
  { key: "auc", region: "me", en: "American University in Cairo", ar: "الجامعة الأمريكية بالقاهرة" },
  { key: "abdullahsalem", region: "me", en: "Abdullah Al Salem University", ar: "جامعة عبدالله السالم" },
  { key: "au", region: "me", en: "Australian University (Kuwait)", ar: "الجامعة الأسترالية (الكويت)" },
  { key: "kcst", region: "me", en: "Kuwait College of Science & Technology", ar: "كلية الكويت للعلوم والتكنولوجيا" },
  { key: "acm", region: "me", en: "American College of the Middle East", ar: "الكلية الأمريكية في الشرق الأوسط" },
  { key: "kilaw", region: "me", en: "Kuwait International Law School", ar: "كلية القانون الكويتية العالمية" },
  { key: "aou", region: "me", en: "Arab Open University", ar: "الجامعة العربية المفتوحة" },
  { key: "boxhill", region: "me", en: "Box Hill College Kuwait", ar: "كلية بوكس هيل الكويت" },
  { key: "paaet", region: "me", en: "PAAET (Public Authority for Applied Education & Training)", ar: "الهيئة العامة للتعليم التطبيقي والتدريب" },
  { key: "uaeu", region: "me", en: "UAE University", ar: "جامعة الإمارات العربية المتحدة" },
  { key: "sharjah", region: "me", en: "University of Sharjah", ar: "جامعة الشارقة" },
  { key: "zu", region: "me", en: "Zayed University", ar: "جامعة زايد" },
  { key: "aud", region: "me", en: "American University in Dubai", ar: "الجامعة الأمريكية في دبي" },
  { key: "sorbonne", region: "me", en: "Sorbonne University Abu Dhabi", ar: "جامعة السوربون أبوظبي" },
  { key: "hct", region: "me", en: "Higher Colleges of Technology", ar: "كليات التقنية العليا" },
  { key: "kau", region: "me", en: "King Abdulaziz University", ar: "جامعة الملك عبدالعزيز" },
  { key: "kaust", region: "me", en: "King Abdullah University of Science & Technology", ar: "جامعة الملك عبدالله للعلوم والتقنية" },
  { key: "pnu", region: "me", en: "Princess Nourah bint Abdulrahman University", ar: "جامعة الأميرة نورة بنت عبدالرحمن" },
  { key: "iau", region: "me", en: "Imam Abdulrahman Bin Faisal University", ar: "جامعة الإمام عبدالرحمن بن فيصل" },
  { key: "alfaisal", region: "me", en: "Alfaisal University", ar: "جامعة الفيصل" },
  { key: "effat", region: "me", en: "Effat University", ar: "جامعة عفت" },
  { key: "psu-sa", region: "me", en: "Prince Sultan University", ar: "جامعة الأمير سلطان" },
  { key: "hbku", region: "me", en: "Hamad Bin Khalifa University", ar: "جامعة حمد بن خليفة" },
  { key: "wcmq", region: "me", en: "Weill Cornell Medicine – Qatar", ar: "وايل كورنيل للطب – قطر" },
  { key: "guq", region: "me", en: "Georgetown University in Qatar", ar: "جامعة جورجتاون في قطر" },
  { key: "tamuq", region: "me", en: "Texas A&M University at Qatar", ar: "جامعة تكساس إي أند أم في قطر" },
  { key: "cmuq", region: "me", en: "Carnegie Mellon University in Qatar", ar: "جامعة كارنيجي ميلون في قطر" },
  { key: "agu", region: "me", en: "Arabian Gulf University", ar: "جامعة الخليج العربي" },
  { key: "rcsib", region: "me", en: "RCSI Bahrain", ar: "الكلية الملكية للجراحين في أيرلندا – البحرين" },
  { key: "gutech", region: "me", en: "German University of Technology in Oman", ar: "الجامعة الألمانية للتكنولوجيا في عُمان" },
  { key: "just", region: "me", en: "Jordan University of Science & Technology", ar: "جامعة العلوم والتكنولوجيا الأردنية" },
  { key: "psut", region: "me", en: "Princess Sumaya University for Technology", ar: "جامعة الأميرة سمية للتكنولوجيا" },
  { key: "gju", region: "me", en: "German Jordanian University", ar: "الجامعة الألمانية الأردنية" },
  { key: "lau", region: "me", en: "Lebanese American University", ar: "الجامعة اللبنانية الأمريكية" },
  { key: "usj", region: "me", en: "Saint Joseph University of Beirut", ar: "جامعة القديس يوسف في بيروت" },
  { key: "cu", region: "me", en: "Cairo University", ar: "جامعة القاهرة" },
  { key: "asu-eg", region: "me", en: "Ain Shams University", ar: "جامعة عين شمس" },
  { key: "alexu", region: "me", en: "Alexandria University", ar: "جامعة الإسكندرية" },
  { key: "guc", region: "me", en: "German University in Cairo", ar: "الجامعة الألمانية بالقاهرة" },
  { key: "bue", region: "me", en: "British University in Egypt", ar: "الجامعة البريطانية في مصر" },
  { key: "aui", region: "me", en: "Al Akhawayn University", ar: "جامعة الأخوين" },
  { key: "um5", region: "me", en: "Mohammed V University in Rabat", ar: "جامعة محمد الخامس بالرباط" },
  { key: "uobaghdad", region: "me", en: "University of Baghdad", ar: "جامعة بغداد" },

  // UK & Ireland
  { key: "manchester", region: "uk", en: "University of Manchester", ar: "جامعة مانشستر" },
  { key: "ucl", region: "uk", en: "University College London (UCL)", ar: "كلية لندن الجامعية" },
  { key: "kcl", region: "uk", en: "King's College London", ar: "كينغز كوليدج لندن" },
  { key: "imperial", region: "uk", en: "Imperial College London", ar: "إمبريال كوليدج لندن" },
  { key: "leeds", region: "uk", en: "University of Leeds", ar: "جامعة ليدز" },
  { key: "nottingham", region: "uk", en: "University of Nottingham", ar: "جامعة نوتنغهام" },
  { key: "birmingham", region: "uk", en: "University of Birmingham", ar: "جامعة برمنغهام" },
  { key: "edinburgh", region: "uk", en: "University of Edinburgh", ar: "جامعة إدنبرة" },
  { key: "newcastle", region: "uk", en: "Newcastle University", ar: "جامعة نيوكاسل" },
  { key: "rcsi", region: "uk", en: "RCSI (Royal College of Surgeons in Ireland)", ar: "الكلية الملكية للجراحين في أيرلندا" },
  { key: "glasgow", region: "uk", en: "University of Glasgow", ar: "جامعة غلاسكو" },
  { key: "bristol", region: "uk", en: "University of Bristol", ar: "جامعة بريستول" },
  { key: "southampton", region: "uk", en: "University of Southampton", ar: "جامعة ساوثهامبتون" },
  { key: "cardiff", region: "uk", en: "Cardiff University", ar: "جامعة كارديف" },
  { key: "qmul", region: "uk", en: "Queen Mary University of London", ar: "جامعة الملكة ماري في لندن" },
  { key: "sheffield", region: "uk", en: "University of Sheffield", ar: "جامعة شيفيلد" },
  { key: "coventry", region: "uk", en: "Coventry University", ar: "جامعة كوفنتري" },
  { key: "lboro", region: "uk", en: "Loughborough University", ar: "جامعة لافبرا" },
  { key: "tcd", region: "uk", en: "Trinity College Dublin", ar: "كلية ترينيتي دبلن" },
  { key: "ucd", region: "uk", en: "University College Dublin", ar: "كلية دبلن الجامعية" },

  // United States
  { key: "nyu", region: "us", en: "New York University", ar: "جامعة نيويورك" },
  { key: "bu", region: "us", en: "Boston University", ar: "جامعة بوسطن" },
  { key: "neu", region: "us", en: "Northeastern University", ar: "جامعة نورث إيسترن" },
  { key: "gwu", region: "us", en: "George Washington University", ar: "جامعة جورج واشنطن" },
  { key: "usc", region: "us", en: "University of Southern California", ar: "جامعة جنوب كاليفورنيا" },
  { key: "asu", region: "us", en: "Arizona State University", ar: "جامعة ولاية أريزونا" },
  { key: "psu", region: "us", en: "Penn State University", ar: "جامعة ولاية بنسلفانيا" },
  { key: "osu", region: "us", en: "Ohio State University", ar: "جامعة ولاية أوهايو" },
  { key: "umich", region: "us", en: "University of Michigan", ar: "جامعة ميشيغان" },
  { key: "purdue", region: "us", en: "Purdue University", ar: "جامعة بيردو" },
  { key: "uw", region: "us", en: "University of Washington", ar: "جامعة واشنطن" },
  { key: "georgetown", region: "us", en: "Georgetown University", ar: "جامعة جورجتاون" },
  { key: "utaustin", region: "us", en: "University of Texas at Austin", ar: "جامعة تكساس في أوستن" },
  { key: "msu", region: "us", en: "Michigan State University", ar: "جامعة ولاية ميشيغان" },
  { key: "colostate", region: "us", en: "Colorado State University", ar: "جامعة ولاية كولورادو" },
  { key: "arizona", region: "us", en: "University of Arizona", ar: "جامعة أريزونا" },
  { key: "pdx", region: "us", en: "Portland State University", ar: "جامعة ولاية بورتلاند" },
  { key: "miami", region: "us", en: "University of Miami", ar: "جامعة ميامي" },
  { key: "cwru", region: "us", en: "Case Western Reserve University", ar: "جامعة كيس ويسترن ريزيرف" },
  { key: "uiuc", region: "us", en: "University of Illinois Urbana-Champaign", ar: "جامعة إلينوي في أوربانا شامبين" },

  // Canada
  { key: "utoronto", region: "ca", en: "University of Toronto", ar: "جامعة تورنتو" },
  { key: "mcgill", region: "ca", en: "McGill University", ar: "جامعة ماكغيل" },
  { key: "ubc", region: "ca", en: "University of British Columbia", ar: "جامعة كولومبيا البريطانية" },
  { key: "waterloo", region: "ca", en: "University of Waterloo", ar: "جامعة واترلو" },
  { key: "concordia", region: "ca", en: "Concordia University", ar: "جامعة كونكورديا" },
  { key: "uottawa", region: "ca", en: "University of Ottawa", ar: "جامعة أوتاوا" },
  { key: "dal", region: "ca", en: "Dalhousie University", ar: "جامعة دالهوزي" },
  { key: "ucalgary", region: "ca", en: "University of Calgary", ar: "جامعة كالغاري" },
  { key: "yorku", region: "ca", en: "York University", ar: "جامعة يورك" },
  { key: "western", region: "ca", en: "Western University", ar: "جامعة ويسترن" },

  // Australia
  { key: "monash", region: "au", en: "Monash University", ar: "جامعة موناش" },
  { key: "unimelb", region: "au", en: "University of Melbourne", ar: "جامعة ملبورن" },
  { key: "usyd", region: "au", en: "University of Sydney", ar: "جامعة سيدني" },
  { key: "unsw", region: "au", en: "UNSW Sydney", ar: "جامعة نيو ساوث ويلز" },
  { key: "uq", region: "au", en: "University of Queensland", ar: "جامعة كوينزلاند" },
  { key: "anu", region: "au", en: "Australian National University", ar: "الجامعة الوطنية الأسترالية" },
  { key: "rmit", region: "au", en: "RMIT University", ar: "جامعة آر إم آي تي" },
  { key: "adelaide", region: "au", en: "University of Adelaide", ar: "جامعة أديلايد" },
  { key: "mq", region: "au", en: "Macquarie University", ar: "جامعة ماكواري" },

  // Turkey & Malaysia
  { key: "istanbul", region: "asia", en: "Istanbul University", ar: "جامعة إسطنبول" },
  { key: "koc", region: "asia", en: "Koç University", ar: "جامعة كوتش" },
  { key: "iium", region: "asia", en: "International Islamic University Malaysia", ar: "الجامعة الإسلامية العالمية بماليزيا" },
  { key: "um", region: "asia", en: "Universiti Malaya", ar: "جامعة مالايا" },
  { key: "sabanci", region: "asia", en: "Sabancı University", ar: "جامعة سابانجي" },
  { key: "metu", region: "asia", en: "Middle East Technical University", ar: "جامعة الشرق الأوسط التقنية" },
  { key: "bilkent", region: "asia", en: "Bilkent University", ar: "جامعة بيلكنت" },
  { key: "utm", region: "asia", en: "Universiti Teknologi Malaysia", ar: "الجامعة التكنولوجية الماليزية" },
  { key: "taylors", region: "asia", en: "Taylor's University", ar: "جامعة تايلور" },
  // TODO(student): add one more university on the line below, copying the pattern above
  { key: "other", en: "Other", ar: "أخرى" },
];

// Choices in the "Customize my look" window on the dashboard.
// An empty icon "" means "show my initials".
const AVATAR_ICONS = ["", "😊", "😎", "🤓", "🌸", "🦋", "🐱", "🦊", "🐼", "🦁", "🌙", "⭐", "☕", "📚", "🎮", "⚽", "🎨", "🎧"];

const AVATAR_COLORS = [
  { key: "teal", cls: "bg-brand-500" },
  { key: "orange", cls: "bg-sand-500" },
  { key: "rose", cls: "bg-rose-400" },
  { key: "indigo", cls: "bg-indigo-400" },
  { key: "green", cls: "bg-emerald-500" },
  { key: "sky", cls: "bg-sky-500" },
  { key: "pink", cls: "bg-fuchsia-400" },
  { key: "gold", cls: "bg-amber-500" },
];

const PAGE_BACKGROUNDS = [
  { key: "sand", css: "#fdf9f2" },
  { key: "mint", css: "#e6f7f3" },
  { key: "sky", css: "#e8f4fd" },
  { key: "rose", css: "#fdeef1" },
  { key: "lavender", css: "#f1eefc" },
  { key: "sunny", css: "#fdf6dc" },
  { key: "sunset", css: "linear-gradient(160deg, #fdf6dc, #fdeef1)" },
  { key: "ocean", css: "linear-gradient(160deg, #e8f4fd, #e6f7f3)" },
];

// Premium backgrounds: patterns and moving colours, locked until the student pays once.
// "animated: true" makes the colours slowly drift (see .bg-animated in css/styles.css).
const PREMIUM_PRICE = { en: "1.500 KD", ar: "1.500 د.ك" };
const PREMIUM_BACKGROUNDS = [
  { key: "aurora", animated: true, css: "linear-gradient(120deg, #c7f0e8, #dbeafe, #f5d0fe, #fde68a, #c7f0e8)" },
  { key: "candy", css: "radial-gradient(at 15% 15%, #fbcfe8 0, transparent 45%), radial-gradient(at 85% 10%, #bae6fd 0, transparent 45%), radial-gradient(at 75% 85%, #ddd6fe 0, transparent 45%), radial-gradient(at 10% 90%, #bbf7d0 0, transparent 45%), #fdf9f2" },
  { key: "sadu", css: "repeating-linear-gradient(45deg, rgba(190,111,38,.12) 0 10px, transparent 10px 20px), repeating-linear-gradient(-45deg, rgba(225,29,72,.08) 0 10px, transparent 10px 20px), #fdf6ec" },
  { key: "dots", css: "radial-gradient(#f9a8d4 2px, transparent 2.5px) 0 0 / 24px 24px, radial-gradient(#93c5fd 2px, transparent 2.5px) 12px 12px / 24px 24px, #fffafc" },
  { key: "stars", css: "radial-gradient(circle, #fbbf24 1.5px, transparent 2.5px) 0 0 / 56px 56px, radial-gradient(circle, #a5b4fc 1.5px, transparent 2.5px) 28px 28px / 56px 56px, linear-gradient(180deg, #eef2ff, #fdf4ff)" },
  { key: "dunes", css: "radial-gradient(ellipse 80% 40% at 25% 105%, #e8c282 0 60%, transparent 61%), radial-gradient(ellipse 90% 45% at 85% 110%, #f1dbb3 0 60%, transparent 61%), linear-gradient(180deg, #dbeafe, #fdf6dc 70%)" },
];

// "words" are extra ways people might type the interest when talking to the chatbot
const INTERESTS = [
  { key: "football", emoji: "⚽", en: "Football", ar: "كرة القدم", words: ["soccer", "كورة", "كرة"] },
  { key: "padel", emoji: "🎾", en: "Padel", ar: "البادل", words: ["tennis", "بادل", "تنس"] },
  { key: "gym", emoji: "🏋️", en: "Gym", ar: "النادي الرياضي", words: ["workout", "fitness", "جيم", "نادي", "تمارين"] },
  { key: "swimming", emoji: "🏊", en: "Swimming", ar: "السباحة", words: ["swim", "سباحة"] },
  { key: "hiking", emoji: "🥾", en: "Hiking", ar: "المشي في الطبيعة", words: ["hike", "camping", "كشتة", "مشي"] },
  { key: "gaming", emoji: "🎮", en: "Gaming", ar: "الألعاب الإلكترونية", words: ["games", "video games", "playstation", "بلايستيشن", "قيمز"] },
  { key: "boardgames", emoji: "🎲", en: "Board games", ar: "ألعاب الطاولة", words: ["board game", "chess", "شطرنج", "كيرم"] },
  { key: "coding", emoji: "💻", en: "Coding", ar: "البرمجة", words: ["programming", "code", "برمجة"] },
  { key: "reading", emoji: "📚", en: "Reading", ar: "القراءة", words: ["books", "read", "كتب", "قراءة"] },
  { key: "cooking", emoji: "🍳", en: "Cooking", ar: "الطبخ", words: ["cook", "food", "طبخ", "أكل"] },
  { key: "coffee", emoji: "☕", en: "Coffee", ar: "القهوة", words: ["cafe", "café", "قهوة", "كوفي"] },
  { key: "art", emoji: "🎨", en: "Art", ar: "الفن", words: ["drawing", "painting", "رسم", "فن"] },
  { key: "photography", emoji: "📷", en: "Photography", ar: "التصوير", words: ["photos", "camera", "تصوير", "كاميرا"] },
  { key: "music", emoji: "🎵", en: "Music", ar: "الموسيقى", words: ["oud", "guitar", "عود", "موسيقى"] },
  { key: "movies", emoji: "🎬", en: "Movies", ar: "الأفلام", words: ["films", "cinema", "series", "أفلام", "سينما", "مسلسلات"] },
  { key: "travel", emoji: "✈️", en: "Travel", ar: "السفر", words: ["trips", "سفر", "رحلات"] },
  { key: "fashion", emoji: "👗", en: "Fashion", ar: "الموضة", words: ["style", "clothes", "موضة", "أزياء"] },
  { key: "volunteering", emoji: "🤝", en: "Volunteering", ar: "التطوع", words: ["volunteer", "charity", "تطوع", "خيري"] },
];

const uniName = (key) => loc(UNIVERSITIES.find((u) => u.key === key)) || "";
// A student's university name: the one they typed if they picked "Other", otherwise the name from the list
const studentUni = (p) => (p.university === "other" && p.customUni) || uniName(p.university);
const interestInfo = (key) => INTERESTS.find((i) => i.key === key);
const interestLabel = (key) => { const i = interestInfo(key); return i ? `${i.emoji} ${loc(i)}` : key; };

// Majors for the type-to-search box. "words" are other ways people might search for it.
const MAJORS = [
  { en: "Accounting", ar: "المحاسبة" },
  { en: "Aerospace Engineering", ar: "هندسة الطيران والفضاء" },
  { en: "Agriculture", ar: "الزراعة" },
  { en: "Arabic Language & Literature", ar: "اللغة العربية وآدابها", words: ["arabic", "عربي"] },
  { en: "Architecture", ar: "العمارة" },
  { en: "Art & Design", ar: "الفنون والتصميم" },
  { en: "Artificial Intelligence", ar: "الذكاء الاصطناعي", words: ["ai"] },
  { en: "Biology", ar: "الأحياء" },
  { en: "Biomedical Engineering", ar: "الهندسة الطبية الحيوية" },
  { en: "Biotechnology", ar: "التقنية الحيوية" },
  { en: "Business Administration", ar: "إدارة الأعمال", words: ["business", "bba", "mba"] },
  { en: "Chemical Engineering", ar: "الهندسة الكيميائية" },
  { en: "Chemistry", ar: "الكيمياء" },
  { en: "Civil Engineering", ar: "الهندسة المدنية" },
  { en: "Computer Engineering", ar: "هندسة الحاسوب" },
  { en: "Computer Science", ar: "علوم الحاسوب", words: ["cs", "programming", "برمجة", "كمبيوتر"] },
  { en: "Cybersecurity", ar: "الأمن السيبراني", words: ["security"] },
  { en: "Data Science", ar: "علم البيانات" },
  { en: "Dentistry", ar: "طب الأسنان", words: ["dental"] },
  { en: "Early Childhood Education", ar: "تربية الطفولة المبكرة" },
  { en: "Economics", ar: "الاقتصاد" },
  { en: "Education", ar: "التربية", words: ["teaching", "تعليم"] },
  { en: "Electrical Engineering", ar: "الهندسة الكهربائية" },
  { en: "English Literature", ar: "الأدب الإنجليزي", words: ["english", "انجليزي"] },
  { en: "Entrepreneurship", ar: "ريادة الأعمال" },
  { en: "Environmental Science", ar: "العلوم البيئية" },
  { en: "Fashion Design", ar: "تصميم الأزياء" },
  { en: "Film Studies", ar: "دراسات السينما", words: ["cinema", "سينما"] },
  { en: "Finance", ar: "التمويل" },
  { en: "Geology", ar: "الجيولوجيا" },
  { en: "Graphic Design", ar: "التصميم الجرافيكي" },
  { en: "History", ar: "التاريخ" },
  { en: "Human Resources", ar: "الموارد البشرية", words: ["hr"] },
  { en: "Industrial Engineering", ar: "الهندسة الصناعية" },
  { en: "Information Systems", ar: "نظم المعلومات", words: ["it", "information technology", "تقنية المعلومات"] },
  { en: "Interior Design", ar: "التصميم الداخلي" },
  { en: "International Relations", ar: "العلاقات الدولية" },
  { en: "Islamic Studies", ar: "الدراسات الإسلامية", words: ["sharia", "شريعة"] },
  { en: "Journalism", ar: "الصحافة" },
  { en: "Law", ar: "القانون", words: ["حقوق"] },
  { en: "Linguistics", ar: "اللسانيات" },
  { en: "Management", ar: "الإدارة" },
  { en: "Marine Science", ar: "علوم البحار" },
  { en: "Marketing", ar: "التسويق" },
  { en: "Mass Communication", ar: "الإعلام", words: ["media", "communications"] },
  { en: "Mathematics", ar: "الرياضيات", words: ["math"] },
  { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" },
  { en: "Medical Laboratory Sciences", ar: "علوم المختبرات الطبية", words: ["lab"] },
  { en: "Medicine", ar: "الطب", words: ["mbbs", "doctor", "طبيب"] },
  { en: "Music", ar: "الموسيقى" },
  { en: "Nursing", ar: "التمريض" },
  { en: "Nutrition", ar: "التغذية", words: ["dietetics"] },
  { en: "Optometry", ar: "البصريات" },
  { en: "Petroleum Engineering", ar: "هندسة البترول", words: ["oil", "نفط"] },
  { en: "Pharmacy", ar: "الصيدلة" },
  { en: "Philosophy", ar: "الفلسفة" },
  { en: "Physical Therapy", ar: "العلاج الطبيعي", words: ["physiotherapy"] },
  { en: "Physics", ar: "الفيزياء" },
  { en: "Political Science", ar: "العلوم السياسية", words: ["politics"] },
  { en: "Psychology", ar: "علم النفس" },
  { en: "Public Health", ar: "الصحة العامة" },
  { en: "Radiology", ar: "الأشعة" },
  { en: "Social Work", ar: "الخدمة الاجتماعية" },
  { en: "Sociology", ar: "علم الاجتماع" },
  { en: "Software Engineering", ar: "هندسة البرمجيات", words: ["programming", "برمجة"] },
  { en: "Special Education", ar: "التربية الخاصة" },
  { en: "Sports Science", ar: "علوم الرياضة" },
  { en: "Statistics", ar: "الإحصاء" },
  { en: "Supply Chain Management", ar: "إدارة سلاسل الإمداد", words: ["logistics"] },
  { en: "Tourism & Hospitality", ar: "السياحة والضيافة" },
  { en: "Translation", ar: "الترجمة" },
  { en: "Urban Planning", ar: "التخطيط العمراني" },
  { en: "Veterinary Medicine", ar: "الطب البيطري", words: ["vet"] },
  { en: "Undecided", ar: "لم أحدد بعد", words: ["undeclared", "not sure"] },
];

// Countries for the optional "Where are you from?". Students can also type a city or anywhere else.
const COUNTRIES = [
  { key: "kw", en: "Kuwait", ar: "الكويت" },
  { key: "sa", en: "Saudi Arabia", ar: "السعودية", words: ["ksa"] },
  { key: "ae", en: "United Arab Emirates", ar: "الإمارات", words: ["uae"] },
  { key: "qa", en: "Qatar", ar: "قطر" },
  { key: "bh", en: "Bahrain", ar: "البحرين" },
  { key: "om", en: "Oman", ar: "عُمان" },
  { key: "ye", en: "Yemen", ar: "اليمن" },
  { key: "iq", en: "Iraq", ar: "العراق" },
  { key: "jo", en: "Jordan", ar: "الأردن" },
  { key: "ps", en: "Palestine", ar: "فلسطين" },
  { key: "lb", en: "Lebanon", ar: "لبنان" },
  { key: "sy", en: "Syria", ar: "سوريا" },
  { key: "eg", en: "Egypt", ar: "مصر" },
  { key: "sd", en: "Sudan", ar: "السودان" },
  { key: "ly", en: "Libya", ar: "ليبيا" },
  { key: "tn", en: "Tunisia", ar: "تونس" },
  { key: "dz", en: "Algeria", ar: "الجزائر" },
  { key: "ma", en: "Morocco", ar: "المغرب" },
  { key: "mr", en: "Mauritania", ar: "موريتانيا" },
  { key: "so", en: "Somalia", ar: "الصومال" },
  { key: "dj", en: "Djibouti", ar: "جيبوتي" },
  { key: "km", en: "Comoros", ar: "جزر القمر" },
  { key: "tr", en: "Turkey", ar: "تركيا" },
  { key: "ir", en: "Iran", ar: "إيران" },
  { key: "pk", en: "Pakistan", ar: "باكستان" },
  { key: "in", en: "India", ar: "الهند" },
  { key: "gb", en: "United Kingdom", ar: "المملكة المتحدة", words: ["uk", "england", "britain"] },
  { key: "us", en: "United States", ar: "الولايات المتحدة", words: ["usa", "america"] },
  { key: "ca", en: "Canada", ar: "كندا" },
  { key: "au", en: "Australia", ar: "أستراليا" },
];
// A country as { en, ar }, e.g. country("kw") → { en: "Kuwait", ar: "الكويت" }
const country = (key) => { const c = COUNTRIES.find((x) => x.key === key); return { en: c.en, ar: c.ar }; };

// Currencies for the rent budget, each with the country (or place) that uses it.
// perDollar = roughly how many of it make 1 US dollar. Only used to compare budgets in different
// currencies, so it doesn't need to be exact (a real app would fetch today's rates).
const CURRENCIES = [
  { code: "KWD", perDollar: 0.307, short: { en: "KD", ar: "د.ك" }, name: { en: "Kuwaiti dinar", ar: "دينار كويتي" }, where: { en: "Kuwait", ar: "الكويت" } },
  { code: "SAR", perDollar: 3.75, short: { en: "SAR", ar: "ر.س" }, name: { en: "Saudi riyal", ar: "ريال سعودي" }, where: { en: "Saudi Arabia", ar: "السعودية" } },
  { code: "AED", perDollar: 3.6725, short: { en: "AED", ar: "د.إ" }, name: { en: "UAE dirham", ar: "درهم إماراتي" }, where: { en: "United Arab Emirates", ar: "الإمارات" } },
  { code: "QAR", perDollar: 3.64, short: { en: "QAR", ar: "ر.ق" }, name: { en: "Qatari riyal", ar: "ريال قطري" }, where: { en: "Qatar", ar: "قطر" } },
  { code: "BHD", perDollar: 0.376, short: { en: "BD", ar: "د.ب" }, name: { en: "Bahraini dinar", ar: "دينار بحريني" }, where: { en: "Bahrain", ar: "البحرين" } },
  { code: "OMR", perDollar: 0.385, short: { en: "OMR", ar: "ر.ع" }, name: { en: "Omani rial", ar: "ريال عماني" }, where: { en: "Oman", ar: "عُمان" } },
  { code: "JOD", perDollar: 0.709, short: { en: "JD", ar: "د.أ" }, name: { en: "Jordanian dinar", ar: "دينار أردني" }, where: { en: "Jordan", ar: "الأردن" } },
  { code: "EGP", perDollar: 48.5, short: { en: "EGP", ar: "ج.م" }, name: { en: "Egyptian pound", ar: "جنيه مصري" }, where: { en: "Egypt", ar: "مصر" } },
  { code: "MAD", perDollar: 9.9, short: { en: "MAD", ar: "د.م" }, name: { en: "Moroccan dirham", ar: "درهم مغربي" }, where: { en: "Morocco", ar: "المغرب" } },
  { code: "IQD", perDollar: 1310, short: { en: "IQD", ar: "د.ع" }, name: { en: "Iraqi dinar", ar: "دينار عراقي" }, where: { en: "Iraq", ar: "العراق" } },
  { code: "TRY", perDollar: 34, short: { en: "TL", ar: "ل.ت" }, name: { en: "Turkish lira", ar: "ليرة تركية" }, where: { en: "Turkey", ar: "تركيا" } },
  { code: "MYR", perDollar: 4.4, short: { en: "RM", ar: "رينغيت" }, name: { en: "Malaysian ringgit", ar: "رينغيت ماليزي" }, where: { en: "Malaysia", ar: "ماليزيا" } },
  { code: "USD", perDollar: 1, short: { en: "$", ar: "دولار" }, name: { en: "US dollar", ar: "دولار أمريكي" }, where: { en: "United States", ar: "الولايات المتحدة" } },
  { code: "GBP", perDollar: 0.79, short: { en: "£", ar: "جنيه إسترليني" }, name: { en: "British pound", ar: "جنيه إسترليني" }, where: { en: "United Kingdom", ar: "المملكة المتحدة" } },
  { code: "EUR", perDollar: 0.92, short: { en: "€", ar: "يورو" }, name: { en: "Euro", ar: "يورو" }, where: { en: "Europe (Ireland, France…)", ar: "أوروبا (أيرلندا، فرنسا…)" } },
  { code: "CAD", perDollar: 1.37, short: { en: "CA$", ar: "دولار كندي" }, name: { en: "Canadian dollar", ar: "دولار كندي" }, where: { en: "Canada", ar: "كندا" } },
  { code: "AUD", perDollar: 1.52, short: { en: "A$", ar: "دولار أسترالي" }, name: { en: "Australian dollar", ar: "دولار أسترالي" }, where: { en: "Australia", ar: "أستراليا" } },
];
const currencyInfo = (code) => CURRENCIES.find((c) => c.code === code) || CURRENCIES[0]; // unknown → KD
// e.g. "Kuwaiti dinar (KD) — Kuwait", for drop-down lists
const currencyOption = (code) => { const c = currencyInfo(code); return `${loc(c.name)} (${loc(c.short)}) — ${loc(c.where)}`; };

// Monthly rent budget: { min, max, currency }. Either min or max can be empty (null).
// makeBudget turns what was typed in the two boxes (plus the currency picked) into that, or null if both are empty.
function makeBudget(minText, maxText, currency = "KWD") {
  const num = (v) => (String(v ?? "").trim() === "" ? null : Math.max(0, Math.round(Number(v)) || 0));
  let min = num(minText);
  let max = num(maxText);
  if (min == null && max == null) return null;
  if (min != null && max != null && min > max) [min, max] = [max, min]; // typed them the wrong way round
  return { min, max, currency };
}
// "150–250 KD / month", "Up to £600 / month" style text, in the student's own currency
function budgetText(b) {
  if (!b || (b.min == null && b.max == null)) return "";
  const cur = loc(currencyInfo(b.currency).short);
  // In English, symbols go first (£500, $600); letters go after (150 KD). In Arabic the currency always goes after.
  const symbolFirst = Lang.current === "en" && /[$£€]/.test(cur);
  const money = (numbers) => (symbolFirst ? `${cur}${numbers}` : `${numbers} ${cur}`);
  if (b.min != null && b.max != null) return t("budget.range", { amount: money(`${b.min.toLocaleString()}–${b.max.toLocaleString()}`) });
  return b.max != null ? t("budget.upTo", { amount: money(b.max.toLocaleString()) }) : t("budget.from", { amount: money(b.min.toLocaleString()) });
}
// A budget turned into US dollars, so budgets in different currencies can be compared
function budgetInDollars(b) {
  const rate = currencyInfo(b.currency).perDollar;
  return { min: b.min == null ? 0 : b.min / rate, max: b.max == null ? Infinity : b.max / rate };
}

// College year, from first year to graduate school. Labels are in js/i18n.js ("year.y1", …).
const COLLEGE_YEARS = ["y1", "y2", "y3", "y4", "y5", "grad"];
const yearLabel = (key) => (key ? t("year." + key) : "");

// The lists the type-to-search boxes look through (see UI.searchBox in js/ui.js)
// They also include colleges and majors other students typed themselves (not in our lists),
// so the next student from the same place can find it too.
function universityItems() {
  const listed = UNIVERSITIES.filter((u) => u.key !== "other").map((u) => ({
    value: u.key, label: loc(u), sub: t("region." + u.region), search: [u.en, u.ar, u.key].join(" "), names: [u.en, u.ar],
  }));
  const typed = Store.typedColleges().map((name) => ({ value: "other", label: name, sub: t("search.addedByStudents"), search: name }));
  return [...listed, ...typed];
}
function placeItems() {
  return COUNTRIES.map((c) => ({ place: { en: c.en, ar: c.ar }, label: loc(c), search: [c.en, c.ar, ...(c.words || [])].join(" "), names: [c.en, c.ar] }));
}
function majorItems() {
  const listed = MAJORS.map((m) => ({ major: m, label: loc(m), search: [m.en, m.ar, ...(m.words || [])].join(" "), names: [m.en, m.ar] }));
  const typed = Store.typedMajors().map((name) => ({ major: { en: name, ar: name }, label: name, sub: t("search.addedByStudents"), search: name }));
  return [...listed, ...typed];
}

// 24 pretend students (12 female, 12 male) so the dashboard has something to show.
const SAMPLE_PROFILES = [
  // ---------- Female ----------
  { id: "f01", gender: "female", year: "y2", from: country("kw"), university: "kuniv", lookingFor: "roommate", budget: { min: 120, max: 200, currency: "KWD" },
    name: { en: "Noor Al-Sabah", ar: "نور الصباح" }, major: { en: "Architecture", ar: "العمارة" },
    interests: ["reading", "coffee", "art", "photography"],
    bio: { en: "Third-year architecture student. Quiet, tidy, and always sketching. Looking for a calm roommate near campus.",
           ar: "طالبة عمارة في السنة الثالثة. هادئة ومرتّبة وأحب الرسم دائماً. أبحث عن شريكة سكن هادئة قرب الجامعة." } },
  { id: "f02", gender: "female", year: "y4", from: country("jo"), university: "auk", lookingFor: "both", budget: { min: 150, max: 250, currency: "KWD" },
    name: { en: "Fatima Hassan", ar: "فاطمة حسن" }, major: { en: "Biology", ar: "الأحياء" },
    interests: ["cooking", "gym", "travel", "coffee"],
    bio: { en: "Pre-med dreamer who loves cooking big family-style dinners. Morning gym person!",
           ar: "أحلم بدراسة الطب وأحب طبخ العزائم الكبيرة. أذهب للنادي صباحاً!" } },
  { id: "f03", gender: "female", year: "y1", from: country("kw"), university: "gust", lookingFor: "friends",
    name: { en: "Sara Al-Mutairi", ar: "سارة المطيري" }, major: { en: "Computer Science", ar: "علوم الحاسوب" },
    interests: ["gaming", "coding", "movies", "music"],
    bio: { en: "First-year CS student. Let's build an app, play some games, or watch a movie marathon.",
           ar: "طالبة علوم حاسوب في السنة الأولى. لنصنع تطبيقاً أو نلعب أو نشاهد ماراثون أفلام." } },
  { id: "f04", gender: "female", year: "y3", from: country("kw"), university: "manchester", lookingFor: "roommate", budget: { min: 500, max: 750, currency: "GBP" },
    name: { en: "Maryam Khalil", ar: "مريم خليل" }, major: { en: "Pharmacy", ar: "الصيدلة" },
    interests: ["reading", "volunteering", "coffee", "cooking"],
    bio: { en: "Pharmacy student, early sleeper, loves a clean kitchen and a good book.",
           ar: "طالبة صيدلة، أنام مبكراً، وأحب المطبخ النظيف والكتاب الجيد." } },
  { id: "f05", gender: "female", year: "y5", from: country("lb"), university: "aub", lookingFor: "both", budget: { min: 600, max: 850, currency: "USD" },
    name: { en: "Layla Mansour", ar: "ليلى منصور" }, major: { en: "Media Studies", ar: "الإعلام" },
    interests: ["photography", "travel", "hiking", "art"],
    bio: { en: "Always carrying a camera. Weekend hikes and new cafés are my thing.",
           ar: "الكاميرا لا تفارقني. رحلات المشي في نهاية الأسبوع والمقاهي الجديدة هوايتي." } },
  { id: "f06", gender: "female", year: "y2", from: country("kw"), university: "aum", lookingFor: "friends",
    name: { en: "Huda Al-Rashid", ar: "هدى الراشد" }, major: { en: "Industrial Engineering", ar: "الهندسة الصناعية" },
    interests: ["padel", "gym", "swimming"],
    bio: { en: "Looking for padel partners and gym buddies near AUM!",
           ar: "أبحث عن شريكات للبادل والنادي الرياضي قرب الجامعة!" } },
  { id: "f07", gender: "female", year: "grad", from: country("ae"), university: "aus", lookingFor: "roommate", budget: { min: 2500, max: 3500, currency: "AED" },
    name: { en: "Reem Saleh", ar: "ريم صالح" }, major: { en: "Interior Design", ar: "التصميم الداخلي" },
    interests: ["fashion", "art", "music", "coffee"],
    bio: { en: "Master's student in design. I'll make our apartment look amazing, promise.",
           ar: "طالبة ماجستير تصميم. أعدك أن شقتنا ستكون رائعة." } },
  { id: "f08", gender: "female", year: "y1", university: "auk", lookingFor: "friends",
    name: { en: "Dana Al-Kandari", ar: "دانة الكندري" }, major: { en: "Business", ar: "إدارة الأعمال" },
    interests: ["movies", "boardgames", "cooking"],
    bio: { en: "Brand new to campus and want to meet people. Board-game nights, anyone?",
           ar: "جديدة في الجامعة وأريد التعرّف على صديقات. من تحب ليالي ألعاب الطاولة؟" } },
  { id: "f09", gender: "female", year: "y4", from: country("qa"), university: "qu", lookingFor: "place", budget: { min: 1200, max: 2000, currency: "QAR" },
    name: { en: "Aisha Omar", ar: "عائشة عمر" }, major: { en: "Education", ar: "التربية" },
    interests: ["volunteering", "reading", "cooking"],
    bio: { en: "Future teacher. Organised, friendly and happy to share cooking duties.",
           ar: "معلّمة المستقبل. منظّمة وودودة وسعيدة بتقاسم مهام الطبخ." } },
  { id: "f10", gender: "female", year: "y3", from: country("jo"), university: "uj", lookingFor: "both", budget: { min: 150, max: 250, currency: "JOD" },
    name: { en: "Yasmin Haddad", ar: "ياسمين حداد" }, major: { en: "Psychology", ar: "علم النفس" },
    interests: ["music", "travel", "coffee", "photography"],
    bio: { en: "Psychology student who plays the oud. Good listener, better coffee maker.",
           ar: "طالبة علم نفس أعزف العود. مستمعة جيدة، وأصنع قهوة أفضل." } },
  { id: "f11", gender: "female", year: "y2", from: country("kw"), university: "utoronto", lookingFor: "both", budget: { min: 1200, max: 1800, currency: "CAD" },
    name: { en: "Lulwa Al-Enezi", ar: "لولوة العنزي" }, major: { en: "Software Engineering", ar: "هندسة البرمجيات" },
    interests: ["coding", "gaming", "boardgames", "reading"],
    bio: { en: "Hackathon fan. Looking for a roommate who doesn't mind late-night coding sessions.",
           ar: "أحب الهاكاثونات. أبحث عن شريكة سكن لا تمانع جلسات البرمجة الليلية." } },
  { id: "f12", gender: "female", year: "grad", from: country("sa"), university: "ksu", lookingFor: "place", budget: { min: 1500, max: 2500, currency: "SAR" },
    name: { en: "Ghada Nasser", ar: "غادة ناصر" }, major: { en: "Medicine", ar: "الطب" },
    interests: ["hiking", "reading", "swimming"],
    bio: { en: "Medical intern with long shifts — I need a peaceful, respectful home.",
           ar: "طبيبة امتياز بمناوبات طويلة — أحتاج إلى سكن هادئ ومحترم." } },

  // ---------- Male ----------
  { id: "m01", gender: "male", year: "y3", from: country("kw"), university: "kuniv", lookingFor: "roommate", budget: { min: 100, max: 180, currency: "KWD" },
    name: { en: "Ahmad Al-Azmi", ar: "أحمد العازمي" }, major: { en: "Petroleum Engineering", ar: "هندسة البترول" },
    interests: ["football", "gym", "gaming", "coffee"],
    bio: { en: "Engineering student, plays football every Thursday. Easy-going and clean.",
           ar: "طالب هندسة، ألعب كرة القدم كل خميس. بسيط ومرتّب." } },
  { id: "m02", gender: "male", year: "y4", from: country("lb"), university: "aub", lookingFor: "both", budget: { min: 500, max: 750, currency: "USD" },
    name: { en: "Yousef Haddad", ar: "يوسف حداد" }, major: { en: "Computer Science", ar: "علوم الحاسوب" },
    interests: ["coding", "coffee", "music"],
    bio: { en: "Building my first startup. Will trade coding help for good coffee.",
           ar: "أبني أول شركة ناشئة لي. أساعدك في البرمجة مقابل قهوة جيدة." } },
  { id: "m03", gender: "male", year: "y1", university: "gust", lookingFor: "friends",
    name: { en: "Omar Farouk", ar: "عمر فاروق" }, major: { en: "Finance", ar: "التمويل" },
    interests: ["football", "padel", "movies"],
    bio: { en: "Padel at night, movies on the weekend. Looking for people to hang out with.",
           ar: "بادل في الليل وأفلام في نهاية الأسبوع. أبحث عن ربع أطلع معهم." } },
  { id: "m04", gender: "male", year: "y5", from: country("kw"), university: "asu", lookingFor: "roommate", budget: { min: 800, max: 1100, currency: "USD" },
    name: { en: "Khalid Al-Shammari", ar: "خالد الشمري" }, major: { en: "Marketing", ar: "التسويق" },
    interests: ["travel", "photography", "hiking"],
    bio: { en: "I travel a lot, so you'll often have the place to yourself. Respectful and tidy.",
           ar: "أسافر كثيراً، لذا سيكون السكن لك غالباً. محترم ومرتّب." } },
  { id: "m05", gender: "male", year: "y2", from: country("eg"), university: "aum", lookingFor: "both", budget: { min: 120, max: 200, currency: "KWD" },
    name: { en: "Hamad Al-Hajri", ar: "حمد الهاجري" }, major: { en: "Electrical Engineering", ar: "الهندسة الكهربائية" },
    interests: ["gaming", "boardgames", "coding"],
    bio: { en: "PC builder and chess player. Looking for a roommate and a gaming squad.",
           ar: "أجمّع أجهزة الكمبيوتر وألعب الشطرنج. أبحث عن شريك سكن وفريق ألعاب." } },
  { id: "m06", gender: "male", year: "grad", from: country("sa"), university: "ksu", lookingFor: "place", budget: { min: 1500, max: 2500, currency: "SAR" },
    name: { en: "Faisal Al-Otaibi", ar: "فيصل العتيبي" }, major: { en: "Law", ar: "القانون" },
    interests: ["reading", "volunteering", "coffee"],
    bio: { en: "Law student who studies a lot. Quiet evenings, early mornings.",
           ar: "طالب قانون أذاكر كثيراً. أمسيات هادئة وصباح مبكر." } },
  { id: "m07", gender: "male", year: "y3", from: country("jo"), university: "uj", lookingFor: "friends",
    name: { en: "Ali Mahmoud", ar: "علي محمود" }, major: { en: "Pharmacy", ar: "الصيدلة" },
    interests: ["cooking", "music", "football"],
    bio: { en: "Makes the best mansaf on campus (ask anyone). Always up for a match.",
           ar: "أطبخ أفضل منسف في الجامعة (اسأل أي أحد). جاهز دائماً لمباراة." } },
  { id: "m08", gender: "male", year: "y1", from: country("kw"), university: "kuniv", lookingFor: "both", budget: { min: 80, max: 150, currency: "KWD" },
    name: { en: "Bader Al-Rashidi", ar: "بدر الرشيدي" }, major: { en: "Sports Science", ar: "علوم الرياضة" },
    interests: ["swimming", "gym", "padel"],
    bio: { en: "Freshman and swimmer. Looking for training partners and maybe a roommate.",
           ar: "طالب مستجد وسبّاح. أبحث عن شركاء تمرين وربما شريك سكن." } },
  { id: "m09", gender: "male", year: "y4", from: country("ae"), university: "aus", lookingFor: "roommate", budget: { min: 2500, max: 3500, currency: "AED" },
    name: { en: "Hassan Najjar", ar: "حسن النجار" }, major: { en: "Architecture", ar: "العمارة" },
    interests: ["art", "photography", "movies", "coffee"],
    bio: { en: "Architecture student, night owl during project weeks. Good cook, bad singer.",
           ar: "طالب عمارة، أسهر في أسابيع المشاريع. طبّاخ جيد ومغنٍّ سيئ." } },
  { id: "m10", gender: "male", year: "y2", from: country("qa"), university: "qu", lookingFor: "friends",
    name: { en: "Saud Al-Dosari", ar: "سعود الدوسري" }, major: { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" },
    interests: ["football", "gaming", "travel"],
    bio: { en: "FIFA tournaments and road trips. Let's make university fun.",
           ar: "بطولات فيفا ورحلات برية. لنجعل الجامعة ممتعة." } },
  { id: "m11", gender: "male", year: "y5", from: country("kw"), university: "rcsi", lookingFor: "place", budget: { min: 700, max: 1000, currency: "EUR" },
    name: { en: "Mohammed Ibrahim", ar: "محمد إبراهيم" }, major: { en: "Medicine", ar: "الطب" },
    interests: ["reading", "hiking", "cooking"],
    bio: { en: "Final-year medical student. Calm, clean, and happy to share meals.",
           ar: "طالب طب في السنة الأخيرة. هادئ ونظيف وأحب مشاركة الوجبات." } },
  { id: "m12", gender: "male", year: "y1", from: country("ps"), university: "auk", lookingFor: "both", budget: { min: 100, max: 160, currency: "KWD" },
    name: { en: "Tariq Zayed", ar: "طارق زايد" }, major: { en: "Computer Engineering", ar: "هندسة الحاسوب" },
    interests: ["music", "coding", "boardgames"],
    bio: { en: "Guitar, code, repeat. New in Kuwait and looking for friends.",
           ar: "جيتار، برمجة، ثم نعيد. جديد في الكويت وأبحث عن أصدقاء." } },
];
