// Demo lesson content. Every built-in lesson is fully available in English and Hindi.
// Shape: strings are {en, hi}; paragraph lists are {en: [...], hi: [...]}.

export const SUBJECTS = {
  Science: { en: 'Science', hi: 'विज्ञान' },
  Mathematics: { en: 'Mathematics', hi: 'गणित' },
  'Computer Science': { en: 'Computer Science', hi: 'कंप्यूटर विज्ञान' },
};

export const LESSONS = [
  {
    id: 'photosynthesis',
    subject: 'Science',
    stage: 'school',
    level: 'Beginner',
    minutes: 8,
    visual: 'photosynthesis',
    prereq: null,
    title: { en: 'Photosynthesis', hi: 'प्रकाश संश्लेषण' },
    tagline: { en: 'How plants make their own food from light.', hi: 'पौधे रोशनी से अपना भोजन कैसे बनाते हैं।' },
    simple: {
      en: [
        'Plants make their own food. This process is called photosynthesis, and it happens mostly in the leaves.',
        'A plant needs three things: sunlight, water from the soil, and carbon dioxide from the air. Inside the leaf, tiny green parts called chloroplasts catch the sunlight.',
        'Using that light energy, the plant turns water and carbon dioxide into glucose, a sugar it uses as food. Oxygen is left over, and the plant releases it into the air for us to breathe.',
      ],
      hi: [
        'पौधे अपना भोजन खुद बनाते हैं। इस प्रक्रिया को प्रकाश संश्लेषण कहते हैं, और यह ज़्यादातर पत्तियों में होती है।',
        'पौधे को तीन चीज़ें चाहिए: सूरज की रोशनी, मिट्टी से पानी और हवा से कार्बन डाइऑक्साइड। पत्ती के अंदर क्लोरोप्लास्ट नाम के छोटे हरे हिस्से सूरज की रोशनी को पकड़ते हैं।',
        'इस प्रकाश ऊर्जा की मदद से पौधा पानी और कार्बन डाइऑक्साइड को ग्लूकोज़ में बदलता है। ग्लूकोज़ एक शर्करा है, जो पौधे का भोजन है। ऑक्सीजन बच जाती है, जिसे पौधा हवा में छोड़ देता है और हम उसी में साँस लेते हैं।',
      ],
    },
    keyPoints: {
      en: ['Sunlight, water and carbon dioxide go in', 'Glucose (food) and oxygen come out', 'Chlorophyll in chloroplasts captures light', 'It happens mostly in leaves'],
      hi: ['सूरज की रोशनी, पानी और कार्बन डाइऑक्साइड अंदर जाते हैं', 'ग्लूकोज़ (भोजन) और ऑक्सीजन बाहर निकलते हैं', 'क्लोरोप्लास्ट का क्लोरोफ़िल रोशनी पकड़ता है', 'यह ज़्यादातर पत्तियों में होती है'],
    },
    example: {
      title: { en: 'A leaf is a tiny kitchen', hi: 'पत्ती एक छोटी रसोई है' },
      body: {
        en: [
          'Think of a leaf as a tiny kitchen. Sunlight is the heat of the stove, water arrives through the roots like a pipe, and carbon dioxide drifts in through small openings called stomata.',
          'The recipe makes glucose, the meal. Oxygen is the steam that leaves the kitchen. A plant left in a dark cupboard turns pale because with no light there is no cooking, so it slowly uses up its stored food.',
        ],
        hi: [
          'पत्ती को एक छोटी रसोई समझिए। सूरज की रोशनी चूल्हे की आँच है, पानी जड़ों से पाइप की तरह आता है, और कार्बन डाइऑक्साइड रंध्र नाम के छोटे छेदों से अंदर आती है।',
          'इस विधि से ग्लूकोज़ यानी भोजन बनता है। ऑक्सीजन रसोई से निकलती भाप है। अँधेरी अलमारी में रखा पौधा पीला पड़ जाता है, क्योंकि रोशनी के बिना खाना नहीं बनता और वह अपना जमा भोजन धीरे-धीरे खर्च करता है।',
        ],
      },
      mapsTo: {
        en: ['Sunlight is the stove heat', 'Water and CO₂ are the ingredients', 'Glucose is the finished meal'],
        hi: ['सूरज की रोशनी चूल्हे की आँच है', 'पानी और CO₂ सामग्री हैं', 'ग्लूकोज़ तैयार भोजन है'],
      },
    },
    questions: [
      {
        id: 'photo-1', tag: { en: 'Inputs', hi: 'ज़रूरी चीज़ें' },
        prompt: { en: 'Which gas do plants take in for photosynthesis?', hi: 'प्रकाश संश्लेषण के लिए पौधे कौन सी गैस लेते हैं?' },
        options: { en: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], hi: ['ऑक्सीजन', 'कार्बन डाइऑक्साइड', 'नाइट्रोजन', 'हाइड्रोजन'] },
        answer: 1,
        explain: { en: 'Plants take in carbon dioxide from the air through tiny openings in their leaves. Oxygen is what they release.', hi: 'पौधे पत्तियों के छोटे छेदों से हवा की कार्बन डाइऑक्साइड लेते हैं। ऑक्सीजन वे छोड़ते हैं।' },
      },
      {
        id: 'photo-2', tag: { en: 'Chlorophyll', hi: 'क्लोरोफ़िल' },
        prompt: { en: 'Which part of a leaf captures sunlight?', hi: 'पत्ती का कौन सा भाग सूरज की रोशनी पकड़ता है?' },
        options: { en: ['Roots', 'Chloroplasts', 'Petals', 'Stem'], hi: ['जड़ें', 'क्लोरोप्लास्ट', 'पंखुड़ियाँ', 'तना'] },
        answer: 1,
        explain: { en: 'Chloroplasts contain green chlorophyll, which absorbs light energy for the plant.', hi: 'क्लोरोप्लास्ट में हरा क्लोरोफ़िल होता है, जो पौधे के लिए प्रकाश ऊर्जा सोखता है।' },
      },
      {
        id: 'photo-3', tag: { en: 'Outputs', hi: 'बनने वाली चीज़ें' },
        prompt: { en: 'What does the plant make that it uses as food?', hi: 'पौधा भोजन के रूप में क्या बनाता है?' },
        options: { en: ['Oxygen', 'Glucose', 'Water', 'Carbon dioxide'], hi: ['ऑक्सीजन', 'ग्लूकोज़', 'पानी', 'कार्बन डाइऑक्साइड'] },
        answer: 1,
        explain: { en: 'Glucose is the sugar the plant uses for energy and growth. Oxygen is a by-product.', hi: 'ग्लूकोज़ वह शर्करा है जिसे पौधा ऊर्जा और बढ़ने के लिए इस्तेमाल करता है। ऑक्सीजन सह-उत्पाद है।' },
      },
      {
        id: 'photo-4', tag: { en: 'Role of light', hi: 'रोशनी की भूमिका' },
        prompt: { en: 'A plant is kept in a dark cupboard for a week. What is most likely to happen?', hi: 'एक पौधा एक हफ़्ते तक अँधेरी अलमारी में रखा गया। सबसे संभव क्या होगा?' },
        options: {
          en: ['It grows faster', 'It makes extra oxygen', 'It cannot make enough food and turns pale', 'Nothing changes'],
          hi: ['वह तेज़ी से बढ़ेगा', 'वह ज़्यादा ऑक्सीजन बनाएगा', 'वह पर्याप्त भोजन नहीं बना पाएगा और पीला पड़ेगा', 'कुछ नहीं बदलेगा'],
        },
        answer: 2,
        explain: { en: 'Without light the plant cannot photosynthesise, so it runs low on food and loses its green colour.', hi: 'रोशनी के बिना पौधा प्रकाश संश्लेषण नहीं कर पाता, इसलिए उसका भोजन घटता है और हरा रंग फीका पड़ता है।' },
      },
      {
        id: 'photo-5', tag: { en: 'Inputs', hi: 'ज़रूरी चीज़ें' },
        prompt: { en: 'Where does most of the water for photosynthesis enter the plant?', hi: 'प्रकाश संश्लेषण का ज़्यादातर पानी पौधे में कहाँ से आता है?' },
        options: { en: ['Leaves', 'Roots', 'Flowers', 'Fruit'], hi: ['पत्तियाँ', 'जड़ें', 'फूल', 'फल'] },
        answer: 1,
        explain: { en: 'Roots absorb water from the soil and it travels up the stem to the leaves.', hi: 'जड़ें मिट्टी से पानी सोखती हैं और वह तने से होकर पत्तियों तक पहुँचता है।' },
      },
    ],
  },

  {
    id: 'fractions',
    subject: 'Mathematics',
    stage: 'school',
    level: 'Beginner',
    minutes: 7,
    visual: 'fractions',
    prereq: null,
    title: { en: 'Fractions', hi: 'भिन्न (फ्रैक्शन)' },
    tagline: { en: 'Parts of a whole, and why equal pieces matter.', hi: 'पूरे के हिस्से, और बराबर टुकड़े क्यों ज़रूरी हैं।' },
    simple: {
      en: [
        'A fraction describes part of a whole. If you cut a roti into 4 equal pieces and eat 1, you have eaten one quarter, written 1/4.',
        'The bottom number (denominator) tells how many equal pieces the whole is cut into. The top number (numerator) tells how many pieces you are talking about.',
        'Fractions can look different but be equal. 1/2 and 2/4 are the same amount of roti. To compare fractions, first make the pieces the same size.',
      ],
      hi: [
        'भिन्न किसी पूरी चीज़ का एक हिस्सा बताती है। अगर आप एक रोटी को 4 बराबर टुकड़ों में काटें और 1 टुकड़ा खाएँ, तो आपने एक-चौथाई खाया, जिसे 1/4 लिखते हैं।',
        'नीचे की संख्या (हर) बताती है कि पूरी चीज़ कितने बराबर टुकड़ों में बाँटी गई। ऊपर की संख्या (अंश) बताती है कि हम कितने टुकड़ों की बात कर रहे हैं।',
        'भिन्न अलग दिख सकती हैं पर बराबर हो सकती हैं। 1/2 और 2/4 रोटी की उतनी ही मात्रा हैं। भिन्नों की तुलना के लिए पहले टुकड़ों का आकार बराबर करें।',
      ],
    },
    keyPoints: {
      en: ['Denominator: equal pieces in the whole', 'Numerator: pieces you have', 'Pieces must be equal in size', '1/2 = 2/4 = 4/8'],
      hi: ['हर: पूरे में बराबर टुकड़ों की संख्या', 'अंश: आपके पास टुकड़ों की संख्या', 'टुकड़े बराबर आकार के होने चाहिए', '1/2 = 2/4 = 4/8'],
    },
    example: {
      title: { en: 'Sharing a pizza fairly', hi: 'पिज़्ज़ा बराबर बाँटना' },
      body: {
        en: [
          'Four friends order one pizza cut into 8 equal slices. Each friend gets 2 slices, which is 2/8 of the pizza. That is exactly the same as 1/4.',
          'If one friend eats 3 slices, that is 3/8. Rewrite 1/4 as 2/8 and the comparison is easy: 3 slices is more than 2 slices, so 3/8 is larger than 1/4.',
        ],
        hi: [
          'चार दोस्त एक पिज़्ज़ा मँगाते हैं जो 8 बराबर टुकड़ों में कटा है। हर दोस्त को 2 टुकड़े मिलते हैं, यानी पिज़्ज़ा का 2/8। यह बिल्कुल 1/4 के बराबर है।',
          'अगर एक दोस्त 3 टुकड़े खाए, तो वह 3/8 है। 1/4 को 2/8 लिखिए तो तुलना आसान है: 3 टुकड़े 2 टुकड़ों से ज़्यादा हैं, इसलिए 3/8, 1/4 से बड़ा है।',
        ],
      },
      mapsTo: {
        en: ['8 slices in the pizza is the denominator', 'Slices you eat is the numerator', '2/8 and 1/4 are equal fractions'],
        hi: ['पिज़्ज़ा के 8 टुकड़े हर हैं', 'आपके खाए टुकड़े अंश हैं', '2/8 और 1/4 बराबर भिन्नें हैं'],
      },
    },
    questions: [
      {
        id: 'frac-1', tag: { en: 'Denominator', hi: 'हर' },
        prompt: { en: 'In the fraction 3/5, what does the 5 tell you?', hi: 'भिन्न 3/5 में 5 क्या बताता है?' },
        options: { en: ['You have 5 pieces', 'The whole is split into 5 equal parts', 'You have 3 wholes', 'There are 5 wholes'], hi: ['आपके पास 5 टुकड़े हैं', 'पूरा 5 बराबर भागों में बँटा है', 'आपके पास 3 पूरे हैं', 'वहाँ 5 पूरे हैं'] },
        answer: 1,
        explain: { en: 'The denominator counts the equal parts in the whole. The 3 is how many of those parts you have.', hi: 'हर पूरे में बराबर भागों को गिनता है। 3 बताता है कि आपके पास उनमें से कितने भाग हैं।' },
      },
      {
        id: 'frac-2', tag: { en: 'Equivalent fractions', hi: 'बराबर भिन्नें' },
        prompt: { en: 'Which fraction is equal to 1/2?', hi: 'कौन सी भिन्न 1/2 के बराबर है?' },
        options: { en: ['2/3', '2/4', '1/4', '3/4'], hi: ['2/3', '2/4', '1/4', '3/4'] },
        answer: 1,
        explain: { en: 'Doubling the top and bottom of 1/2 gives 2/4. Both describe the same amount.', hi: '1/2 के अंश और हर दोनों को दुगना करने पर 2/4 मिलता है। दोनों एक ही मात्रा हैं।' },
      },
      {
        id: 'frac-3', tag: { en: 'Numerator', hi: 'अंश' },
        prompt: { en: 'A chocolate bar has 10 equal squares. You eat 3. What fraction is left?', hi: 'एक चॉकलेट में 10 बराबर टुकड़े हैं। आप 3 खा लेते हैं। कितनी भिन्न बची?' },
        options: { en: ['3/10', '7/10', '7/3', '10/7'], hi: ['3/10', '7/10', '7/3', '10/7'] },
        answer: 1,
        explain: { en: '10 − 3 = 7 squares are left out of 10 equal squares, so 7/10.', hi: '10 में से 3 खाने पर 7 टुकड़े बचते हैं, यानी 7/10।' },
      },
      {
        id: 'frac-4', tag: { en: 'Comparing', hi: 'तुलना' },
        prompt: { en: 'Which is larger: 3/8 or 1/4?', hi: 'कौन बड़ी है: 3/8 या 1/4?' },
        options: { en: ['1/4', '3/8', 'They are equal', 'Cannot tell'], hi: ['1/4', '3/8', 'दोनों बराबर हैं', 'बताया नहीं जा सकता'] },
        answer: 1,
        explain: { en: 'Write 1/4 as 2/8. Now the pieces are the same size and 3 pieces beat 2 pieces.', hi: '1/4 को 2/8 लिखें। अब टुकड़े एक ही आकार के हैं और 3 टुकड़े 2 टुकड़ों से ज़्यादा हैं।' },
      },
      {
        id: 'frac-5', tag: { en: 'Equal parts', hi: 'बराबर भाग' },
        prompt: { en: 'Why must the pieces be equal for a fraction to make sense?', hi: 'भिन्न के लिए टुकड़ों का बराबर होना क्यों ज़रूरी है?' },
        options: {
          en: ['It looks tidier', '"1 out of 4" would not describe one fixed amount', 'Bigger pieces are always better', 'It does not matter'],
          hi: ['यह ज़्यादा साफ़ दिखता है', '"4 में से 1" एक निश्चित मात्रा नहीं बताएगा', 'बड़े टुकड़े हमेशा बेहतर होते हैं', 'इससे फ़र्क नहीं पड़ता'],
        },
        answer: 1,
        explain: { en: 'If pieces differ in size, "1 out of 4" could be a tiny or a huge amount. Equal pieces make the fraction exact.', hi: 'अगर टुकड़े अलग आकार के हों तो "4 में से 1" बहुत छोटा या बहुत बड़ा हो सकता है। बराबर टुकड़े भिन्न को सटीक बनाते हैं।' },
      },
    ],
  },

  {
    id: 'binary-search',
    subject: 'Computer Science',
    stage: 'college',
    level: 'Intermediate',
    minutes: 10,
    visual: 'binary-search',
    prereq: null,
    title: { en: 'Binary search', hi: 'बाइनरी सर्च' },
    tagline: { en: 'Find anything in a sorted list by halving the search area.', hi: 'सॉर्टेड सूची में खोज का दायरा आधा करते हुए कुछ भी ढूँढें।' },
    simple: {
      en: [
        'Binary search finds a value in a sorted list by repeatedly cutting the search area in half.',
        'Look at the middle item. If it is your target, you are done. If your target is smaller, it must be in the left half, so ignore the right half. If it is larger, ignore the left half. Repeat on the half that remains.',
        'Because each step removes half of the items, a list of 1,000 items needs at most about 10 steps. Checking one by one could need 1,000. The catch: the list must already be sorted.',
      ],
      hi: [
        'बाइनरी सर्च एक सॉर्टेड सूची में किसी मान को ढूँढने का तरीका है, जिसमें हर बार खोज का दायरा आधा कर दिया जाता है।',
        'पहले बीच वाला तत्व देखें। अगर वही आपका लक्ष्य है, तो काम खत्म। अगर लक्ष्य उससे छोटा है, तो वह बाएँ आधे हिस्से में होगा, इसलिए दायाँ हिस्सा छोड़ दें। अगर बड़ा है, तो बायाँ हिस्सा छोड़ दें। बचे हुए हिस्से पर यही दोहराएँ।',
        'हर कदम पर आधे तत्व हट जाते हैं, इसलिए 1,000 तत्वों की सूची में ज़्यादा से ज़्यादा लगभग 10 कदम लगते हैं। एक-एक करके देखने में 1,000 कदम तक लग सकते हैं। शर्त यह है कि सूची पहले से सॉर्टेड होनी चाहिए।',
      ],
    },
    keyPoints: {
      en: ['Works only on sorted data', 'Check the middle, then discard half', 'At most about log₂(n) steps', 'Linear search checks items one by one'],
      hi: ['सिर्फ़ सॉर्टेड डेटा पर काम करता है', 'बीच का तत्व देखें, फिर आधा हटाएँ', 'ज़्यादा से ज़्यादा लगभग log₂(n) कदम', 'लीनियर सर्च एक-एक तत्व देखता है'],
    },
    example: {
      title: { en: 'Finding a word in a dictionary', hi: 'शब्दकोश में शब्द ढूँढना' },
      body: {
        en: [
          'You want the word "mango". You open the dictionary in the middle and see "knife". Mango comes later in the alphabet, so you ignore the first half.',
          'Open the middle of what remains and repeat. In a few flips you land on the right page, and you never read every word.',
        ],
        hi: [
          'आपको शब्द "mango" ढूँढना है। आप शब्दकोश बीच से खोलते हैं और "knife" दिखता है। Mango वर्णमाला में बाद में आता है, इसलिए आप पहला आधा हिस्सा छोड़ देते हैं।',
          'बचे हिस्से का बीच खोलें और यही दोहराएँ। कुछ ही पन्ने पलटकर आप सही पन्ने पर पहुँच जाते हैं, और हर शब्द पढ़ना नहीं पड़ता।',
        ],
      },
      mapsTo: {
        en: ['Dictionary pages are the sorted list', 'Opening the middle is checking the mid item', 'Ignoring half is discarding half the range'],
        hi: ['शब्दकोश के पन्ने सॉर्टेड सूची हैं', 'बीच खोलना यानी मध्य तत्व जाँचना', 'आधा छोड़ना यानी आधा दायरा हटाना'],
      },
    },
    questions: [
      {
        id: 'bs-1', tag: { en: 'Sorted requirement', hi: 'सॉर्टेड होने की शर्त' },
        prompt: { en: 'What must be true before you can use binary search?', hi: 'बाइनरी सर्च इस्तेमाल करने से पहले क्या सही होना चाहिए?' },
        options: { en: ['The list has no duplicates', 'The list is sorted', 'The list has an even length', 'The list is short'], hi: ['सूची में दोहराव न हो', 'सूची सॉर्टेड हो', 'सूची की लंबाई सम हो', 'सूची छोटी हो'] },
        answer: 1,
        explain: { en: 'Discarding half is only safe because sorted order tells you which half the target is in.', hi: 'आधा हिस्सा हटाना तभी सुरक्षित है, क्योंकि क्रम से पता चलता है कि लक्ष्य किस आधे में है।' },
      },
      {
        id: 'bs-2', tag: { en: 'Halving', hi: 'आधा करना' },
        prompt: { en: 'Roughly how many items remain after one step on a list of 16 items?', hi: '16 तत्वों की सूची में एक कदम के बाद लगभग कितने तत्व बचते हैं?' },
        options: { en: ['15', '8', '4', '1'], hi: ['15', '8', '4', '1'] },
        answer: 1,
        explain: { en: 'Each step throws away half of the remaining items, so 16 becomes about 8.', hi: 'हर कदम बचे तत्वों का आधा हटा देता है, इसलिए 16 लगभग 8 रह जाते हैं।' },
      },
      {
        id: 'bs-3', tag: { en: 'Choosing a half', hi: 'आधा चुनना' },
        prompt: { en: 'You search for 23 and the middle item is 40. Where do you look next?', hi: 'आप 23 खोज रहे हैं और बीच का तत्व 40 है। अगला कदम?' },
        options: { en: ['The left half', 'The right half', 'The whole list again', 'Stop: 23 is missing'], hi: ['बायाँ आधा', 'दायाँ आधा', 'पूरी सूची फिर से', 'रुकें: 23 नहीं है'] },
        answer: 0,
        explain: { en: '23 is smaller than 40, and the list is sorted, so 23 can only be on the left.', hi: '23, 40 से छोटा है और सूची सॉर्टेड है, इसलिए 23 सिर्फ़ बाईं ओर हो सकता है।' },
      },
      {
        id: 'bs-4', tag: { en: 'Efficiency', hi: 'कुशलता' },
        prompt: { en: 'About how many comparisons does binary search need at most for 1,000 sorted items?', hi: '1,000 सॉर्टेड तत्वों के लिए बाइनरी सर्च को ज़्यादा से ज़्यादा लगभग कितनी तुलनाएँ चाहिए?' },
        options: { en: ['10', '100', '500', '1,000'], hi: ['10', '100', '500', '1,000'] },
        answer: 0,
        explain: { en: '2 to the power 10 is 1,024, so halving 1,000 items reaches one item in about 10 steps.', hi: '2 की घात 10 यानी 1,024 होती है, इसलिए 1,000 तत्वों को आधा करते-करते लगभग 10 कदम में एक तत्व बचता है।' },
      },
      {
        id: 'bs-5', tag: { en: 'Sorted requirement', hi: 'सॉर्टेड होने की शर्त' },
        prompt: { en: 'You run binary search for 5 on the unsorted list [9, 2, 7, 1, 5]. What is the risk?', hi: 'आप असॉर्टेड सूची [9, 2, 7, 1, 5] में 5 के लिए बाइनरी सर्च चलाते हैं। जोखिम क्या है?' },
        options: { en: ['It is always correct', 'It may wrongly decide 5 is missing', 'It runs faster', 'It sorts the list'], hi: ['यह हमेशा सही रहेगा', 'यह गलती से मान सकता है कि 5 नहीं है', 'यह तेज़ चलेगा', 'यह सूची को सॉर्ट कर देगा'] },
        answer: 1,
        explain: { en: 'The middle item is 7. 5 is smaller, so the search goes left and never sees the 5 on the right.', hi: 'बीच का तत्व 7 है। 5 छोटा है, इसलिए खोज बाईं ओर जाती है और दाईं ओर का 5 कभी नहीं देखती।' },
      },
    ],
  },

  {
    id: 'recursion-basics',
    subject: 'Computer Science',
    stage: 'college',
    level: 'Beginner',
    minutes: 6,
    visual: 'recursion-basics',
    prereq: null,
    title: { en: 'Recursion basics: Russian dolls', hi: 'रिकर्शन की शुरुआत: रूसी गुड़ियाँ' },
    tagline: { en: 'A gentle first look at problems that contain smaller copies of themselves.', hi: 'ऐसी समस्याओं की सरल शुरुआत जिनमें उन्हीं की छोटी कॉपी छिपी होती है।' },
    simple: {
      en: [
        'Imagine a set of Russian nesting dolls. You open one doll and find a smaller doll of exactly the same shape. You keep opening until you reach the smallest doll, which does not open.',
        'Recursion works the same way. A big problem contains a smaller copy of itself. You keep solving the smaller copy until you reach the smallest one, which you can answer directly.',
        'That smallest doll is called the base case. Without it you would keep opening dolls forever.',
      ],
      hi: [
        'रूसी नेस्टिंग गुड़ियों के सेट की कल्पना कीजिए। आप एक गुड़िया खोलते हैं और उसके अंदर बिल्कुल वैसी ही, पर छोटी गुड़िया मिलती है। आप तब तक खोलते जाते हैं जब तक सबसे छोटी गुड़िया न आ जाए, जो खुलती नहीं।',
        'रिकर्शन भी ऐसे ही काम करता है। बड़ी समस्या के अंदर उसी की छोटी कॉपी होती है। आप छोटी कॉपी को हल करते जाते हैं, जब तक सबसे छोटी न आ जाए, जिसका उत्तर सीधे दिया जा सकता है।',
        'वह सबसे छोटी गुड़िया बेस केस कहलाती है। उसके बिना आप हमेशा गुड़ियाँ खोलते ही रहेंगे।',
      ],
    },
    keyPoints: {
      en: ['A big problem contains a smaller copy of itself', 'Keep shrinking the problem', 'Stop at the smallest case you can answer directly'],
      hi: ['बड़ी समस्या में उसी की छोटी कॉपी होती है', 'समस्या को छोटा करते जाएँ', 'सबसे छोटे केस पर रुकें जिसका उत्तर सीधे पता हो'],
    },
    example: {
      title: { en: 'A countdown', hi: 'उल्टी गिनती' },
      body: {
        en: [
          'To do countdown(3): say 3, then do countdown(2). To do countdown(2): say 2, then do countdown(1). To do countdown(1): say 1, then do countdown(0).',
          'When the number reaches 0 we simply stop. That stopping point is the base case, and it is what makes the countdown finish.',
        ],
        hi: [
          'countdown(3) करने के लिए: 3 बोलें, फिर countdown(2) करें। countdown(2) के लिए: 2 बोलें, फिर countdown(1) करें। countdown(1) के लिए: 1 बोलें, फिर countdown(0) करें।',
          'जब संख्या 0 पर पहुँचती है तो हम बस रुक जाते हैं। यही रुकने की जगह बेस केस है, और इसी से गिनती खत्म होती है।',
        ],
      },
      mapsTo: {
        en: ['countdown(2) inside countdown(3) is the smaller copy', '0 is the smallest doll'],
        hi: ['countdown(3) के अंदर countdown(2) छोटी कॉपी है', '0 सबसे छोटी गुड़िया है'],
      },
    },
    questions: [
      {
        id: 'rb-1', tag: { en: 'Base case', hi: 'बेस केस' },
        prompt: { en: 'In the Russian doll picture, what is the base case?', hi: 'रूसी गुड़ियों की तस्वीर में बेस केस क्या है?' },
        options: { en: ['The biggest doll', 'The smallest doll that cannot be opened', 'The doll in the middle', 'The box the dolls came in'], hi: ['सबसे बड़ी गुड़िया', 'सबसे छोटी गुड़िया जो खुलती नहीं', 'बीच वाली गुड़िया', 'वह डिब्बा जिसमें गुड़ियाँ आईं'] },
        answer: 1,
        explain: { en: 'The base case is the simplest situation where you stop and answer directly.', hi: 'बेस केस सबसे आसान स्थिति है जहाँ आप रुककर सीधे उत्तर देते हैं।' },
      },
      {
        id: 'rb-2', tag: { en: 'Smaller subproblem', hi: 'छोटी उप-समस्या' },
        prompt: { en: 'What should happen to the problem each time we call ourselves again?', hi: 'हर बार खुद को दोबारा कॉल करने पर समस्या का क्या होना चाहिए?' },
        options: { en: ['It gets bigger', 'It stays exactly the same', 'It gets closer to the simplest case', 'It disappears'], hi: ['वह बड़ी हो', 'वह बिल्कुल वैसी ही रहे', 'वह सबसे आसान स्थिति के करीब आए', 'वह गायब हो जाए'] },
        answer: 2,
        explain: { en: 'Each call must shrink the problem so that we eventually reach the base case.', hi: 'हर कॉल को समस्या छोटी करनी चाहिए ताकि हम अंत में बेस केस तक पहुँचें।' },
      },
      {
        id: 'rb-3', tag: { en: 'Base case', hi: 'बेस केस' },
        prompt: { en: 'A countdown keeps going to −1, −2, −3 and never stops. What is missing?', hi: 'एक उल्टी गिनती −1, −2, −3 तक चलती जाती है और रुकती नहीं। क्या कमी है?' },
        options: { en: ['A base case that stops at 0', 'More numbers', 'A bigger computer', 'A louder voice'], hi: ['0 पर रोकने वाला बेस केस', 'और संख्याएँ', 'बड़ा कंप्यूटर', 'तेज़ आवाज़'] },
        answer: 0,
        explain: { en: 'Without a stopping rule the calls never end. The base case is that rule.', hi: 'रुकने के नियम के बिना कॉल कभी खत्म नहीं होतीं। बेस केस वही नियम है।' },
      },
      {
        id: 'rb-4', tag: { en: 'Definition', hi: 'परिभाषा' },
        prompt: { en: 'Which sentence best describes recursion?', hi: 'कौन सा वाक्य रिकर्शन को सबसे अच्छा बताता है?' },
        options: {
          en: ['Repeating the same line of code many times', 'Solving a problem using a smaller version of the same problem', 'Writing code very fast', 'Saving data to a file'],
          hi: ['कोड की एक ही पंक्ति कई बार दोहराना', 'उसी समस्या के छोटे रूप से समस्या हल करना', 'बहुत तेज़ कोड लिखना', 'डेटा को फ़ाइल में सहेजना'],
        },
        answer: 1,
        explain: { en: 'Recursion reuses the same idea on a smaller input until the answer is obvious.', hi: 'रिकर्शन उसी विचार को छोटे इनपुट पर तब तक दोहराता है जब तक उत्तर साफ़ न हो जाए।' },
      },
    ],
  },

  {
    id: 'recursion',
    subject: 'Computer Science',
    stage: 'college',
    level: 'Intermediate',
    minutes: 10,
    visual: 'recursion',
    prereq: 'recursion-basics',
    title: { en: 'Recursion', hi: 'रिकर्शन' },
    tagline: { en: 'Base cases, recursive cases and the call stack.', hi: 'बेस केस, रिकर्सिव केस और कॉल स्टैक।' },
    simple: {
      en: [
        'Recursion is when a function solves a problem by calling itself on a smaller version of the same problem.',
        'Every recursive function needs two parts. The base case is the simplest situation, where the answer is known and no more calls are needed. The recursive case shrinks the problem and calls the function again.',
        'For factorial, factorial(4) = 4 × factorial(3). This keeps shrinking until factorial(0), the base case, which is 1. Then the answers return back up the chain. Without a base case the calls never stop and the program crashes with a stack overflow.',
      ],
      hi: [
        'रिकर्शन वह तरीका है जिसमें एक फ़ंक्शन किसी समस्या को हल करने के लिए उसी समस्या के छोटे रूप पर खुद को ही कॉल करता है।',
        'हर रिकर्सिव फ़ंक्शन के दो हिस्से होते हैं। बेस केस सबसे आसान स्थिति है, जहाँ उत्तर पहले से पता होता है और आगे कॉल नहीं करनी पड़ती। रिकर्सिव केस समस्या को छोटा करता है और फ़ंक्शन को फिर से कॉल करता है।',
        'फ़ैक्टोरियल में factorial(4) = 4 × factorial(3) होता है। यह तब तक छोटा होता जाता है जब तक factorial(0) न आ जाए, जो बेस केस है और जिसका मान 1 है। फिर उत्तर श्रृंखला में वापस ऊपर लौटते हैं। बेस केस के बिना कॉल कभी नहीं रुकतीं और प्रोग्राम स्टैक ओवरफ़्लो से क्रैश हो जाता है।',
      ],
    },
    keyPoints: {
      en: ['The base case stops the recursion', 'Each call works on a smaller problem', 'Calls stack up, then answers return', 'No base case means stack overflow'],
      hi: ['बेस केस रिकर्शन को रोकता है', 'हर कॉल छोटी समस्या पर काम करती है', 'कॉल जमा होती हैं, फिर उत्तर लौटते हैं', 'बेस केस न हो तो स्टैक ओवरफ़्लो होता है'],
    },
    example: {
      title: { en: 'Counting people in a queue', hi: 'कतार में लोगों को गिनना' },
      body: {
        en: [
          'You cannot see the whole queue, so you ask the person ahead: "How many people are in front of you?" They ask the next person, and so on.',
          'The first person in line says 0. Each person adds 1 and passes the answer back. Nobody needed the full picture, only a smaller version of the same question.',
        ],
        hi: [
          'आप पूरी कतार नहीं देख सकते, इसलिए आप आगे वाले से पूछते हैं: "आपके आगे कितने लोग हैं?" वह अगले व्यक्ति से पूछता है, और इसी तरह आगे।',
          'कतार में सबसे आगे वाला कहता है 0। हर व्यक्ति 1 जोड़कर उत्तर वापस देता है। किसी को पूरी तस्वीर नहीं चाहिए थी, बस उसी सवाल का छोटा रूप चाहिए था।',
        ],
      },
      mapsTo: {
        en: ['Asking the person ahead is the recursive call', 'The first person (0) is the base case', 'Adding 1 on the way back combines results'],
        hi: ['आगे वाले से पूछना रिकर्सिव कॉल है', 'पहला व्यक्ति (0) बेस केस है', 'लौटते समय 1 जोड़ना परिणामों को मिलाना है'],
      },
    },
    questions: [
      {
        id: 'rec-1', tag: { en: 'Base case', hi: 'बेस केस' },
        prompt: { en: 'What is the base case of a recursive function?', hi: 'रिकर्सिव फ़ंक्शन का बेस केस क्या है?' },
        options: {
          en: ['The biggest input it can handle', 'The simplest case that returns without calling itself', 'The first line of the function', 'The line that calls itself'],
          hi: ['सबसे बड़ा इनपुट जिसे वह संभाल सके', 'सबसे आसान केस जो खुद को कॉल किए बिना लौटता है', 'फ़ंक्शन की पहली पंक्ति', 'वह पंक्ति जो खुद को कॉल करती है'],
        },
        answer: 1,
        explain: { en: 'The base case ends the chain of calls by returning a known answer directly.', hi: 'बेस केस सीधे ज्ञात उत्तर लौटाकर कॉल की श्रृंखला को खत्म करता है।' },
      },
      {
        id: 'rec-2', tag: { en: 'Base case', hi: 'बेस केस' },
        prompt: { en: 'What happens if a recursive function has no base case?', hi: 'अगर रिकर्सिव फ़ंक्शन में बेस केस न हो तो क्या होगा?' },
        options: {
          en: ['It returns 0', 'It runs once and stops', 'It keeps calling itself until a stack overflow', 'It sorts the input'],
          hi: ['वह 0 लौटाएगा', 'वह एक बार चलकर रुक जाएगा', 'वह स्टैक ओवरफ़्लो होने तक खुद को कॉल करता रहेगा', 'वह इनपुट को सॉर्ट करेगा'],
        },
        answer: 2,
        explain: { en: 'Each call waits on the next one. With nothing to stop them, the call stack fills up and the program crashes.', hi: 'हर कॉल अगली कॉल का इंतज़ार करती है। रोकने वाला कुछ न हो तो कॉल स्टैक भर जाता है और प्रोग्राम क्रैश हो जाता है।' },
      },
      {
        id: 'rec-3', tag: { en: 'Tracing calls', hi: 'कॉल का अनुसरण' },
        prompt: { en: 'With factorial(n) = n × factorial(n−1) and factorial(0) = 1, what is factorial(3)?', hi: 'factorial(n) = n × factorial(n−1) और factorial(0) = 1 हो तो factorial(3) क्या है?' },
        options: { en: ['3', '6', '9', '1'], hi: ['3', '6', '9', '1'] },
        answer: 1,
        explain: { en: 'factorial(3) = 3 × 2 × 1 × factorial(0) = 3 × 2 × 1 × 1 = 6.', hi: 'factorial(3) = 3 × 2 × 1 × factorial(0) = 3 × 2 × 1 × 1 = 6।' },
      },
      {
        id: 'rec-4', tag: { en: 'Progress toward base case', hi: 'बेस केस की ओर प्रगति' },
        prompt: { en: 'In the recursive case, the input must…', hi: 'रिकर्सिव केस में इनपुट को…' },
        options: {
          en: ['Stay the same', 'Move closer to the base case', 'Get larger each time', 'Be a negative number'],
          hi: ['वैसा ही रहना चाहिए', 'बेस केस के करीब आना चाहिए', 'हर बार बड़ा होना चाहिए', 'ऋणात्मक संख्या होना चाहिए'],
        },
        answer: 1,
        explain: { en: 'If the input does not move toward the base case, the function can never finish.', hi: 'अगर इनपुट बेस केस की ओर नहीं बढ़ता तो फ़ंक्शन कभी खत्म नहीं हो सकता।' },
      },
      {
        id: 'rec-5', tag: { en: 'Smaller subproblem', hi: 'छोटी उप-समस्या' },
        prompt: { en: 'Why does the queue-counting example count correctly?', hi: 'कतार गिनने वाला उदाहरण सही गिनती क्यों करता है?' },
        options: {
          en: ['Everyone shouts at once', 'Each person solves a smaller version: the queue ahead of them', 'The last person counts everyone', 'People guess the number'],
          hi: ['सब एक साथ चिल्लाते हैं', 'हर व्यक्ति छोटा रूप हल करता है: अपने आगे की कतार', 'आख़िरी व्यक्ति सबको गिनता है', 'लोग संख्या का अंदाज़ा लगाते हैं'],
        },
        answer: 1,
        explain: { en: 'Each person answers a slightly smaller question and builds on the answer they receive.', hi: 'हर व्यक्ति थोड़ा छोटा सवाल हल करता है और मिले उत्तर पर आगे बढ़ता है।' },
      },
    ],
  },

  {
    id: 'operating-systems',
    subject: 'Computer Science',
    stage: 'adult',
    level: 'Beginner',
    minutes: 9,
    visual: 'operating-systems',
    prereq: null,
    title: { en: 'Operating systems', hi: 'ऑपरेटिंग सिस्टम' },
    tagline: { en: 'The manager between your apps and your hardware.', hi: 'आपके ऐप्स और हार्डवेयर के बीच का मैनेजर।' },
    simple: {
      en: [
        'An operating system (OS) is the main program that manages a computer. Windows, macOS, Linux, Android and iOS are all operating systems.',
        'It does three big jobs. It shares the processor and memory between running programs. It manages files and storage. It lets programs use hardware such as the keyboard, screen and network without each program needing to know the details.',
        'Think of the OS as a manager between apps and hardware. Apps ask the OS for what they need, and the OS decides who gets what, and when.',
      ],
      hi: [
        'ऑपरेटिंग सिस्टम (OS) वह मुख्य प्रोग्राम है जो कंप्यूटर को संभालता है। विंडोज़, मैकओएस, लिनक्स, एंड्रॉइड और आईओएस सब ऑपरेटिंग सिस्टम हैं।',
        'इसके तीन बड़े काम हैं। यह चल रहे प्रोग्रामों के बीच प्रोसेसर और मेमोरी बाँटता है। यह फ़ाइलों और स्टोरेज को संभालता है। और यह प्रोग्रामों को कीबोर्ड, स्क्रीन और नेटवर्क जैसे हार्डवेयर इस्तेमाल करने देता है, ताकि हर प्रोग्राम को उनकी बारीकियाँ न जाननी पड़ें।',
        'OS को ऐप्स और हार्डवेयर के बीच का मैनेजर समझिए। ऐप्स OS से अपनी ज़रूरत माँगते हैं, और OS तय करता है कि किसे क्या मिलेगा, और कब।',
      ],
    },
    keyPoints: {
      en: ['Shares the processor and memory', 'Manages files and storage', 'Controls access to hardware', 'Sits between apps and hardware'],
      hi: ['प्रोसेसर और मेमोरी बाँटता है', 'फ़ाइलें और स्टोरेज संभालता है', 'हार्डवेयर तक पहुँच नियंत्रित करता है', 'ऐप्स और हार्डवेयर के बीच बैठता है'],
    },
    example: {
      title: { en: 'A restaurant manager', hi: 'रेस्तरां का मैनेजर' },
      body: {
        en: [
          'Customers (apps) want tables, kitchen time and waiters. The manager (the OS) assigns tables, decides which orders the kitchen cooks first and makes sure two customers never get the same table.',
          'Customers never walk into the kitchen (the hardware) themselves. They ask, and the manager arranges it fairly and safely.',
        ],
        hi: [
          'ग्राहक (ऐप्स) मेज़, रसोई का समय और वेटर चाहते हैं। मैनेजर (OS) मेज़ें देता है, तय करता है कि रसोई पहले कौन से ऑर्डर बनाए और यह पक्का करता है कि दो ग्राहकों को एक ही मेज़ न मिले।',
          'ग्राहक कभी खुद रसोई (हार्डवेयर) में नहीं जाते। वे माँगते हैं, और मैनेजर सब कुछ निष्पक्ष और सुरक्षित ढंग से सँभालता है।',
        ],
      },
      mapsTo: {
        en: ['Customers are apps', 'Kitchen and tables are hardware and memory', 'The manager is the operating system'],
        hi: ['ग्राहक ऐप्स हैं', 'रसोई और मेज़ें हार्डवेयर और मेमोरी हैं', 'मैनेजर ऑपरेटिंग सिस्टम है'],
      },
    },
    questions: [
      {
        id: 'os-1', tag: { en: 'What is an OS', hi: 'OS क्या है' },
        prompt: { en: 'Which of these is an operating system?', hi: 'इनमें से कौन सा ऑपरेटिंग सिस्टम है?' },
        options: { en: ['Chrome', 'Android', 'Photoshop', 'Excel'], hi: ['Chrome', 'Android', 'Photoshop', 'Excel'] },
        answer: 1,
        explain: { en: 'Android runs the phone itself. Chrome, Photoshop and Excel are apps that run on top of an OS.', hi: 'एंड्रॉइड फ़ोन को खुद चलाता है। Chrome, Photoshop और Excel ऐसे ऐप्स हैं जो OS के ऊपर चलते हैं।' },
      },
      {
        id: 'os-2', tag: { en: 'Main role', hi: 'मुख्य भूमिका' },
        prompt: { en: 'What is the main role of an operating system?', hi: 'ऑपरेटिंग सिस्टम की मुख्य भूमिका क्या है?' },
        options: {
          en: ['Design web pages', 'Manage hardware and share it among programs', 'Make the screen brighter', 'Store passwords'],
          hi: ['वेब पेज डिज़ाइन करना', 'हार्डवेयर संभालना और प्रोग्रामों में बाँटना', 'स्क्रीन को चमकदार बनाना', 'पासवर्ड सहेजना'],
        },
        answer: 1,
        explain: { en: 'The OS coordinates hardware resources so many programs can run safely together.', hi: 'OS हार्डवेयर संसाधनों का समन्वय करता है ताकि कई प्रोग्राम सुरक्षित रूप से साथ चल सकें।' },
      },
      {
        id: 'os-3', tag: { en: 'Scheduling', hi: 'शेड्यूलिंग' },
        prompt: { en: 'Two apps want the processor at the same moment. Who decides which goes first?', hi: 'दो ऐप्स को एक ही क्षण प्रोसेसर चाहिए। कौन तय करता है कि पहले कौन जाएगा?' },
        options: { en: ['The keyboard', 'The operating system', 'Each app decides alone', 'The monitor'], hi: ['कीबोर्ड', 'ऑपरेटिंग सिस्टम', 'हर ऐप अकेले तय करता है', 'मॉनिटर'] },
        answer: 1,
        explain: { en: 'The OS scheduler decides which program runs on the processor and for how long.', hi: 'OS का शेड्यूलर तय करता है कि कौन सा प्रोग्राम प्रोसेसर पर कितनी देर चलेगा।' },
      },
      {
        id: 'os-4', tag: { en: 'File management', hi: 'फ़ाइल प्रबंधन' },
        prompt: { en: 'Which of these is a job of the operating system?', hi: 'इनमें से कौन सा ऑपरेटिंग सिस्टम का काम है?' },
        options: { en: ['Managing files and folders', 'Writing emails', 'Editing photos', 'Designing logos'], hi: ['फ़ाइलें और फ़ोल्डर संभालना', 'ईमेल लिखना', 'फ़ोटो एडिट करना', 'लोगो डिज़ाइन करना'] },
        answer: 0,
        explain: { en: 'Saving, finding and protecting files on storage is handled by the OS file system.', hi: 'स्टोरेज पर फ़ाइलें सहेजना, ढूँढना और सुरक्षित रखना OS की फ़ाइल प्रणाली संभालती है।' },
      },
      {
        id: 'os-5', tag: { en: 'Hardware access', hi: 'हार्डवेयर तक पहुँच' },
        prompt: { en: 'Why do apps ask the OS for hardware instead of using it directly?', hi: 'ऐप्स हार्डवेयर सीधे इस्तेमाल करने के बजाय OS से क्यों माँगते हैं?' },
        options: {
          en: ['It is slower on purpose', 'So apps do not conflict and do not need hardware details', 'Hardware cannot be used at all', 'Only games may use it'],
          hi: ['जानबूझकर धीमा रखने के लिए', 'ताकि ऐप्स आपस में न टकराएँ और उन्हें हार्डवेयर की बारीकियाँ न जाननी पड़ें', 'हार्डवेयर इस्तेमाल हो ही नहीं सकता', 'सिर्फ़ गेम इसे इस्तेमाल कर सकते हैं'],
        },
        answer: 1,
        explain: { en: 'A shared, safe interface stops two apps from fighting over a device and hides complicated details.', hi: 'साझा और सुरक्षित इंटरफ़ेस दो ऐप्स को एक डिवाइस पर टकराने से रोकता है और जटिल बारीकियाँ छिपा देता है।' },
      },
    ],
  },
];

export const TOPIC_INTERESTS = [
  { id: 'Science', en: 'Science', hi: 'विज्ञान' },
  { id: 'Mathematics', en: 'Mathematics', hi: 'गणित' },
  { id: 'Computer Science', en: 'Computer science', hi: 'कंप्यूटर विज्ञान' },
  { id: 'Languages', en: 'Languages', hi: 'भाषाएँ' },
  { id: 'History', en: 'History', hi: 'इतिहास' },
  { id: 'Careers', en: 'Careers and skills', hi: 'करियर और कौशल' },
  { id: 'Finance', en: 'Money basics', hi: 'पैसे की बुनियादी बातें' },
  { id: 'Health', en: 'Health and wellbeing', hi: 'स्वास्थ्य और कल्याण' },
];
