import { ImageDown, Crop, PenLine, FileDown, FileImage, Merge, type LucideIcon } from 'lucide-react';
import type { Bi } from '../i18n';

export interface Faq {
  q: Bi;
  a: Bi;
}

export interface ToolInfo {
  slug: string;
  icon: LucideIcon;
  popular: boolean;
  name: Bi;
  short: Bi;
  seoTitle: Bi;
  seoDesc: Bi;
  intro: Bi;
  formats: Bi;
  steps: Bi[];
  limits: Bi[];
  faqs: Faq[];
  relatedTools: string[];
  relatedGuides: string[];
}

export const tools: ToolInfo[] = [
  {
    slug: 'image-compressor',
    icon: ImageDown,
    popular: true,
    name: { en: 'Image Compressor', hi: 'इमेज कंप्रेसर' },
    short: {
      en: 'Reduce JPG, PNG or WebP size to 20 KB, 50 KB, 100 KB, 200 KB or your own limit.',
      hi: 'JPG, PNG या WebP की साइज़ 20 KB, 50 KB, 100 KB, 200 KB या अपनी सीमा तक घटाएँ।',
    },
    seoTitle: { en: 'Free Image Compressor – Reduce Photo Size in KB', hi: 'फ़्री इमेज कंप्रेसर – फोटो की साइज़ KB में घटाएँ' },
    seoDesc: {
      en: 'Compress JPG, PNG and WebP images to a target size such as 20 KB, 50 KB or 100 KB. Runs in your browser; files are never uploaded.',
      hi: 'JPG, PNG और WebP इमेज को 20 KB, 50 KB या 100 KB जैसी लक्षित साइज़ तक छोटा करें। ब्राउज़र में चलता है; फ़ाइलें अपलोड नहीं होतीं।',
    },
    intro: {
      en: 'Many online forms reject images above a fixed size. This tool re-encodes your image inside your browser and searches for the best quality that fits your target size. The size shown after compression is the real size of the file you download, measured from the actual output.',
      hi: 'कई ऑनलाइन फॉर्म तय साइज़ से बड़ी इमेज स्वीकार नहीं करते। यह टूल आपकी इमेज को आपके ब्राउज़र में ही दोबारा एन्कोड करता है और लक्षित साइज़ में फिट होने वाली सबसे अच्छी क्वालिटी खोजता है। कंप्रेशन के बाद दिखने वाली साइज़ असली आउटपुट फ़ाइल की मापी हुई साइज़ है।',
    },
    formats: { en: 'Input: JPG, JPEG, PNG, WebP. Output: JPEG, PNG or WebP.', hi: 'इनपुट: JPG, JPEG, PNG, WebP। आउटपुट: JPEG, PNG या WebP।' },
    steps: [
      { en: 'Choose your image.', hi: 'अपनी इमेज चुनें।' },
      { en: 'Pick a target size (or switch to the quality slider) and an output format.', hi: 'लक्षित साइज़ (या क्वालिटी स्लाइडर) और आउटपुट फ़ॉर्मैट चुनें।' },
      { en: 'Press Compress and check the real size shown.', hi: 'कंप्रेस दबाएँ और दिखाई गई असली साइज़ देखें।' },
      { en: 'Download the result and upload it to your form.', hi: 'परिणाम डाउनलोड करें और अपने फॉर्म में अपलोड करें।' },
    ],
    limits: [
      { en: 'Very small targets need lower quality or fewer pixels; the tool tells you when it had to reduce pixel size.', hi: 'बहुत छोटी लक्षित साइज़ के लिए क्वालिटी या पिक्सेल घटाने पड़ते हैं; टूल बताता है कि पिक्सेल साइज़ घटाई गई या नहीं।' },
      { en: 'PNG has no quality setting, so only reducing pixels can make it smaller. JPEG or WebP usually gives smaller files for photos.', hi: 'PNG में क्वालिटी सेटिंग नहीं होती, इसलिए केवल पिक्सेल घटाकर साइज़ कम होती है। फोटो के लिए JPEG या WebP आमतौर पर छोटी फ़ाइल देते हैं।' },
      { en: 'JPEG cannot store transparency; transparent areas are filled with white.', hi: 'JPEG पारदर्शिता सहेज नहीं सकता; पारदर्शी हिस्से सफ़ेद भर दिए जाते हैं।' },
    ],
    faqs: [
      {
        q: { en: 'Is my image uploaded anywhere?', hi: 'क्या मेरी इमेज कहीं अपलोड होती है?' },
        a: { en: 'No. Compression happens in your browser using the Canvas API. The file never leaves your device.', hi: 'नहीं। कंप्रेशन आपके ब्राउज़र में Canvas API से होता है। फ़ाइल आपके डिवाइस से बाहर नहीं जाती।' },
      },
      {
        q: { en: 'Why is my result larger than the target?', hi: 'मेरा परिणाम लक्षित साइज़ से बड़ा क्यों है?' },
        a: { en: 'If even the lowest allowed quality (and allowed pixel reduction) stays above the target, the tool shows the smallest result it could make and says the target was not reached. Try JPEG, or allow pixel reduction.', hi: 'यदि सबसे कम अनुमत क्वालिटी (और अनुमत पिक्सेल कटौती) पर भी साइज़ लक्ष्य से ऊपर रहती है, तो टूल सबसे छोटा संभव परिणाम दिखाता है और बताता है कि लक्ष्य पूरा नहीं हुआ। JPEG चुनें या पिक्सेल घटाने की अनुमति दें।' },
      },
    ],
    relatedTools: ['photo-resizer', 'signature-resizer', 'jpg-to-pdf'],
    relatedGuides: ['reduce-photo-size-for-online-form', 'document-upload-checklist'],
  },
  {
    slug: 'photo-resizer',
    icon: Crop,
    popular: true,
    name: { en: 'Photo Resizer', hi: 'फोटो रिसाइज़र' },
    short: {
      en: 'Set exact width and height in pixels, crop or fit, and reach a custom file size.',
      hi: 'पिक्सेल में सटीक चौड़ाई-ऊँचाई तय करें, क्रॉप या फ़िट चुनें और कस्टम फ़ाइल साइज़ पाएँ।',
    },
    seoTitle: { en: 'Photo Resizer – Resize Photo to Exact Pixels and KB', hi: 'फोटो रिसाइज़र – फोटो को सटीक पिक्सेल और KB में बदलें' },
    seoDesc: {
      en: 'Resize a photo to exact width and height in pixels with crop or fit options and an optional KB limit. Editable presets. Browser-only processing.',
      hi: 'फोटो को सटीक चौड़ाई-ऊँचाई (पिक्सेल) में बदलें, क्रॉप/फ़िट विकल्प और वैकल्पिक KB सीमा के साथ। संपादन योग्य प्रीसेट। केवल ब्राउज़र में प्रोसेस।',
    },
    intro: {
      en: 'Forms often ask for a passport-style photo at specific pixel dimensions. Enter the width and height your form asks for, choose how the photo should fit, and optionally set a maximum file size. The presets are common examples only; always type the values from your own notification.',
      hi: 'फॉर्म अक्सर तय पिक्सेल आयाम की पासपोर्ट-स्टाइल फोटो माँगते हैं। अपने फॉर्म में माँगी गई चौड़ाई और ऊँचाई भरें, फोटो कैसे फ़िट हो यह चुनें और चाहें तो अधिकतम फ़ाइल साइज़ तय करें। प्रीसेट केवल सामान्य उदाहरण हैं; मान हमेशा अपनी अधिसूचना से ही भरें।',
    },
    formats: { en: 'Input: JPG, JPEG, PNG, WebP. Output: JPEG, PNG or WebP.', hi: 'इनपुट: JPG, JPEG, PNG, WebP। आउटपुट: JPEG, PNG या WebP।' },
    steps: [
      { en: 'Choose your photo.', hi: 'अपनी फोटो चुनें।' },
      { en: 'Enter width and height (or tap a preset and edit it).', hi: 'चौड़ाई और ऊँचाई भरें (या प्रीसेट दबाकर बदलें)।' },
      { en: 'Choose Fit, Crop to fill or Stretch, and an optional size limit in KB.', hi: 'फ़िट, क्रॉप टू फ़िल या स्ट्रेच चुनें, और चाहें तो KB सीमा भरें।' },
      { en: 'Press Resize, check the preview and download.', hi: 'रिसाइज़ दबाएँ, प्रीव्यू देखें और डाउनलोड करें।' },
    ],
    limits: [
      { en: 'Pixel dimensions are kept exactly as you enter them. If the size limit cannot be met at those dimensions, the tool says so instead of silently changing the dimensions.', hi: 'पिक्सेल आयाम वैसे ही रहते हैं जैसे आप भरते हैं। यदि उन आयामों पर साइज़ सीमा पूरी नहीं हो सकती, तो टूल चुपचाप आयाम बदलने की बजाय यह बताता है।' },
      { en: 'Stretch changes the look of the face. Prefer Fit or Crop to fill.', hi: 'स्ट्रेच से चेहरे का आकार बदल जाता है। फ़िट या क्रॉप टू फ़िल बेहतर है।' },
      { en: 'Presets are not official requirements.', hi: 'प्रीसेट आधिकारिक आवश्यकताएँ नहीं हैं।' },
    ],
    faqs: [
      {
        q: { en: 'Which size should I enter?', hi: 'मुझे कौन-सी साइज़ भरनी चाहिए?' },
        a: { en: 'Use the exact size written in your form or official notification. FormReady India is independent and does not know your form’s requirements.', hi: 'अपने फॉर्म या आधिकारिक अधिसूचना में लिखी सटीक साइज़ का उपयोग करें। FormReady India स्वतंत्र है और आपके फॉर्म की आवश्यकताएँ नहीं जानता।' },
      },
      {
        q: { en: 'What is the difference between Fit and Crop?', hi: 'फ़िट और क्रॉप में क्या अंतर है?' },
        a: { en: 'Fit shows the whole photo and adds a background colour if the shapes differ. Crop to fill covers the whole area and cuts off the edges.', hi: 'फ़िट पूरी फोटो दिखाता है और आकार अलग होने पर बैकग्राउंड रंग जोड़ता है। क्रॉप टू फ़िल पूरा क्षेत्र भरता है और किनारे काट देता है।' },
      },
    ],
    relatedTools: ['image-compressor', 'signature-resizer', 'jpg-to-pdf'],
    relatedGuides: ['reduce-photo-size-for-online-form', 'document-upload-checklist'],
  },
  {
    slug: 'signature-resizer',
    icon: PenLine,
    popular: true,
    name: { en: 'Signature Resizer', hi: 'सिग्नेचर रिसाइज़र' },
    short: {
      en: 'Resize a JPG or PNG signature to the width, height and KB your form needs.',
      hi: 'JPG या PNG हस्ताक्षर को अपने फॉर्म की चौड़ाई, ऊँचाई और KB में बदलें।',
    },
    seoTitle: { en: 'Signature Resizer – Resize Signature Image in Pixels and KB', hi: 'सिग्नेचर रिसाइज़र – हस्ताक्षर इमेज को पिक्सेल और KB में बदलें' },
    seoDesc: {
      en: 'Resize a JPG or PNG signature to exact pixels and a target KB. Keeps transparent PNG when you choose PNG. Processed in your browser.',
      hi: 'JPG या PNG हस्ताक्षर को सटीक पिक्सेल और लक्षित KB में बदलें। PNG चुनने पर पारदर्शिता बनी रहती है। ब्राउज़र में प्रोसेस।',
    },
    intro: {
      en: 'Sign on white paper, take a clear photo, and use this tool to bring it to the size your form asks for. A signature must stay readable: very small pixel sizes or very low quality can make thin strokes disappear, so always check the preview before downloading.',
      hi: 'सफ़ेद कागज़ पर हस्ताक्षर करें, साफ़ फोटो लें और इस टूल से उसे फॉर्म की माँगी साइज़ में लाएँ। हस्ताक्षर पढ़ने योग्य रहना चाहिए: बहुत छोटे पिक्सेल या बहुत कम क्वालिटी से पतली रेखाएँ गायब हो सकती हैं, इसलिए डाउनलोड से पहले प्रीव्यू ज़रूर देखें।',
    },
    formats: { en: 'Input: JPG, JPEG, PNG. Output: JPEG or PNG.', hi: 'इनपुट: JPG, JPEG, PNG। आउटपुट: JPEG या PNG।' },
    steps: [
      { en: 'Choose your signature image.', hi: 'अपने हस्ताक्षर की इमेज चुनें।' },
      { en: 'Enter width and height, or tap a preset and edit it.', hi: 'चौड़ाई और ऊँचाई भरें, या प्रीसेट दबाकर बदलें।' },
      { en: 'Choose JPEG or PNG and an optional size limit in KB.', hi: 'JPEG या PNG चुनें और चाहें तो KB सीमा भरें।' },
      { en: 'Resize, check that the signature is readable, then download.', hi: 'रिसाइज़ करें, जाँचें कि हस्ताक्षर पढ़ने योग्य है, फिर डाउनलोड करें।' },
    ],
    limits: [
      { en: 'Choose PNG to keep a transparent background. JPEG fills transparent areas with white.', hi: 'पारदर्शी बैकग्राउंड बनाए रखने के लिए PNG चुनें। JPEG पारदर्शी हिस्सों को सफ़ेद भर देता है।' },
      { en: 'PNG files cannot be compressed by quality, so a tight KB limit may not be reachable; use JPEG if your form allows it.', hi: 'PNG फ़ाइलें क्वालिटी से कंप्रेस नहीं होतीं, इसलिए कड़ी KB सीमा पूरी न हो सके; फॉर्म अनुमति दे तो JPEG चुनें।' },
      { en: 'Signature presets are examples, not official rules.', hi: 'सिग्नेचर प्रीसेट उदाहरण हैं, आधिकारिक नियम नहीं।' },
    ],
    faqs: [
      {
        q: { en: 'Why does my signature look faint?', hi: 'मेरा हस्ताक्षर हल्का क्यों दिख रहा है?' },
        a: { en: 'Thin pen strokes lose detail at small sizes or low quality. Sign with a dark pen, photograph in good light, and raise the quality or size.', hi: 'पतली रेखाएँ छोटी साइज़ या कम क्वालिटी पर बारीकी खो देती हैं। गहरे पेन से हस्ताक्षर करें, अच्छी रोशनी में फोटो लें और क्वालिटी या साइज़ बढ़ाएँ।' },
      },
      {
        q: { en: 'Can I remove the background?', hi: 'क्या मैं बैकग्राउंड हटा सकता हूँ?' },
        a: { en: 'This tool does not remove backgrounds. It only keeps transparency that already exists in a PNG.', hi: 'यह टूल बैकग्राउंड नहीं हटाता। यह केवल PNG में पहले से मौजूद पारदर्शिता बनाए रखता है।' },
      },
    ],
    relatedTools: ['photo-resizer', 'image-compressor', 'jpg-to-pdf'],
    relatedGuides: ['signature-size-for-online-forms', 'document-upload-checklist'],
  },
  {
    slug: 'pdf-compressor',
    icon: FileDown,
    popular: true,
    name: { en: 'PDF Compressor', hi: 'पीडीएफ कंप्रेसर' },
    short: {
      en: 'Optimise a PDF’s structure, or recompress its pages as images, and see the verified size.',
      hi: 'PDF की संरचना ऑप्टिमाइज़ करें, या पन्नों को इमेज की तरह दोबारा कंप्रेस करें, और सत्यापित साइज़ देखें।',
    },
    seoTitle: { en: 'PDF Compressor – Reduce PDF File Size Online', hi: 'पीडीएफ कंप्रेसर – PDF फ़ाइल की साइज़ घटाएँ' },
    seoDesc: {
      en: 'Reduce PDF size in your browser: lossless structure optimisation or optional page recompression. The result size shown is the real output size.',
      hi: 'अपने ब्राउज़र में PDF की साइज़ घटाएँ: लॉसलेस संरचना ऑप्टिमाइज़ेशन या वैकल्पिक पेज रीकंप्रेशन। दिखाई गई साइज़ असली आउटपुट की है।',
    },
    intro: {
      en: 'There are two modes. “Optimise structure” rewrites the PDF without touching text or pictures; it is safe but often saves little. “Recompress pages as images” redraws every page as a JPEG, which can shrink scanned or picture-heavy PDFs a lot, but text is no longer selectable and quality drops. The tool never promises a size: it shows the measured size of the file it actually produced.',
      hi: 'दो मोड हैं। “संरचना ऑप्टिमाइज़ करें” PDF को टेक्स्ट या तस्वीरें छेड़े बिना दोबारा लिखता है; यह सुरक्षित है पर अक्सर कम बचत देता है। “पन्नों को इमेज की तरह कंप्रेस करें” हर पन्ने को JPEG की तरह दोबारा बनाता है, जिससे स्कैन या तस्वीरों वाली PDF काफ़ी छोटी हो सकती है, पर टेक्स्ट चुना नहीं जा सकता और क्वालिटी घटती है। टूल कभी साइज़ का वादा नहीं करता: वह बनाई गई फ़ाइल की मापी हुई साइज़ दिखाता है।',
    },
    formats: { en: 'Input: PDF (not password-protected). Output: PDF.', hi: 'इनपुट: PDF (पासवर्ड रहित)। आउटपुट: PDF।' },
    steps: [
      { en: 'Choose your PDF and check its size and page count.', hi: 'अपनी PDF चुनें और उसकी साइज़ व पेज संख्या देखें।' },
      { en: 'Pick a mode. Start with Optimise structure.', hi: 'मोड चुनें। पहले संरचना ऑप्टिमाइज़ करके देखें।' },
      { en: 'If it is still too large, use page recompression and set quality, resolution and an optional target.', hi: 'यदि अब भी बड़ी है, तो पेज रीकंप्रेशन चुनें और क्वालिटी, रिज़ॉल्यूशन व वैकल्पिक लक्ष्य तय करें।' },
      { en: 'Compare sizes, then download only if the result suits you.', hi: 'साइज़ की तुलना करें, और परिणाम ठीक लगे तभी डाउनलोड करें।' },
    ],
    limits: [
      { en: 'Some PDFs cannot be reduced much: text-only PDFs and PDFs already compressed are often close to their minimum size.', hi: 'कुछ PDF ज़्यादा छोटी नहीं हो सकतीं: केवल टेक्स्ट वाली और पहले से कंप्रेस की गई PDF अक्सर न्यूनतम साइज़ के पास होती हैं।' },
      { en: 'Page recompression removes selectable text, links and form fields.', hi: 'पेज रीकंप्रेशन से चुनने योग्य टेक्स्ट, लिंक और फॉर्म फ़ील्ड हट जाते हैं।' },
      { en: 'Password-protected PDFs are not supported. Very large PDFs may be slow on phones.', hi: 'पासवर्ड वाली PDF समर्थित नहीं हैं। बहुत बड़ी PDF फोन पर धीमी हो सकती हैं।' },
    ],
    faqs: [
      {
        q: { en: 'Can you make my PDF exactly 200 KB?', hi: 'क्या आप मेरी PDF ठीक 200 KB कर सकते हैं?' },
        a: { en: 'Not exactly. In page recompression mode you may set a target; the tool tries several settings and reports whether the real output is under it. If not, it says so.', hi: 'ठीक उतनी नहीं। पेज रीकंप्रेशन मोड में आप लक्ष्य रख सकते हैं; टूल कई सेटिंग आज़माता है और बताता है कि असली आउटपुट उससे कम है या नहीं। न हो तो वह यह साफ़ बताता है।' },
      },
      {
        q: { en: 'Is the PDF uploaded?', hi: 'क्या PDF अपलोड होती है?' },
        a: { en: 'No. pdf-lib and PDF.js run inside your browser.', hi: 'नहीं। pdf-lib और PDF.js आपके ब्राउज़र के अंदर चलते हैं।' },
      },
    ],
    relatedTools: ['pdf-merger', 'jpg-to-pdf', 'image-compressor'],
    relatedGuides: ['pdf-too-large-what-to-do', 'document-upload-checklist'],
  },
  {
    slug: 'jpg-to-pdf',
    icon: FileImage,
    popular: true,
    name: { en: 'JPG to PDF', hi: 'जेपीजी से पीडीएफ' },
    short: {
      en: 'Turn one or many images into a single PDF with page size, orientation and margins.',
      hi: 'एक या कई इमेज को पेज साइज़, ओरिएंटेशन और मार्जिन के साथ एक PDF में बदलें।',
    },
    seoTitle: { en: 'JPG to PDF Converter – Combine Images into One PDF', hi: 'JPG से PDF कन्वर्टर – कई इमेज से एक PDF बनाएँ' },
    seoDesc: {
      en: 'Convert JPG, PNG and WebP images to a PDF. Reorder pages, choose A4, Letter or custom size, set margins. Works in your browser.',
      hi: 'JPG, PNG और WebP इमेज को PDF में बदलें। पेज क्रम बदलें, A4, Letter या कस्टम साइज़ चुनें, मार्जिन तय करें। ब्राउज़र में काम करता है।',
    },
    intro: {
      en: 'Select your photos or scans, put them in the right order, and choose the page setup. Each image becomes one page, scaled to fit inside the margins without distortion.',
      hi: 'अपनी फोटो या स्कैन चुनें, उन्हें सही क्रम में रखें और पेज सेटअप चुनें। हर इमेज एक पन्ना बनती है, जो बिना बिगड़े मार्जिन के भीतर फ़िट होती है।',
    },
    formats: { en: 'Input: JPG, JPEG, PNG, WebP (several at once). Output: PDF.', hi: 'इनपुट: JPG, JPEG, PNG, WebP (एक साथ कई)। आउटपुट: PDF।' },
    steps: [
      { en: 'Add one or more images.', hi: 'एक या अधिक इमेज जोड़ें।' },
      { en: 'Use the up and down buttons to set the page order.', hi: 'ऊपर-नीचे बटन से पेज का क्रम तय करें।' },
      { en: 'Choose page size, orientation, margin and image quality.', hi: 'पेज साइज़, ओरिएंटेशन, मार्जिन और इमेज क्वालिटी चुनें।' },
      { en: 'Create the PDF, preview it and download.', hi: 'PDF बनाएँ, प्रीव्यू देखें और डाउनलोड करें।' },
    ],
    limits: [
      { en: 'Lower image quality gives a smaller PDF. Photos from phones can be large, so many pages may need a lower quality setting.', hi: 'कम इमेज क्वालिटी से PDF छोटी बनती है। फोन की फोटो बड़ी होती हैं, इसलिए कई पन्नों के लिए कम क्वालिटी चुननी पड़ सकती है।' },
      { en: 'Transparent PNG pages keep transparency (shown on a white PDF page in most viewers).', hi: 'पारदर्शी PNG पन्ने पारदर्शिता बनाए रखते हैं (ज़्यादातर व्यूअर में सफ़ेद पन्ने पर दिखते हैं)।' },
    ],
    faqs: [
      {
        q: { en: 'Will my images be distorted?', hi: 'क्या मेरी इमेज बिगड़ जाएँगी?' },
        a: { en: 'No. Each image keeps its proportions and is centred inside the margins.', hi: 'नहीं। हर इमेज अपना अनुपात बनाए रखती है और मार्जिन के भीतर बीच में रखी जाती है।' },
      },
      {
        q: { en: 'How many images can I add?', hi: 'मैं कितनी इमेज जोड़ सकता हूँ?' },
        a: { en: 'There is no fixed count, but each file can be up to 25 MB and phones may slow down with very many large images.', hi: 'कोई निश्चित संख्या नहीं है, पर हर फ़ाइल 25 MB तक हो सकती है और बहुत सारी बड़ी इमेज पर फोन धीमा हो सकता है।' },
      },
    ],
    relatedTools: ['pdf-merger', 'pdf-compressor', 'image-compressor'],
    relatedGuides: ['pdf-too-large-what-to-do', 'document-upload-checklist'],
  },
  {
    slug: 'pdf-merger',
    icon: Merge,
    popular: true,
    name: { en: 'PDF Merger', hi: 'पीडीएफ मर्जर' },
    short: {
      en: 'Combine several PDFs into one file in the order you choose.',
      hi: 'कई PDF को आपके चुने क्रम में एक फ़ाइल में जोड़ें।',
    },
    seoTitle: { en: 'PDF Merger – Combine PDF Files Online', hi: 'पीडीएफ मर्जर – कई PDF फ़ाइलें एक में जोड़ें' },
    seoDesc: {
      en: 'Merge multiple PDF files into one in any order. Shows page counts, verifies the merged file, runs in your browser.',
      hi: 'कई PDF फ़ाइलों को किसी भी क्रम में एक में जोड़ें। पेज संख्या दिखाता है, जुड़ी फ़ाइल जाँचता है, ब्राउज़र में चलता है।',
    },
    intro: {
      en: 'Add your PDFs, check each file’s page count, arrange the order and merge. After merging, the tool re-opens the new file and checks that its page count equals the total of the inputs.',
      hi: 'अपनी PDF जोड़ें, हर फ़ाइल की पेज संख्या देखें, क्रम तय करें और मर्ज करें। मर्ज के बाद टूल नई फ़ाइल को दोबारा खोलकर जाँचता है कि उसके पेज इनपुट के कुल पेज के बराबर हैं।',
    },
    formats: { en: 'Input: PDF (not password-protected). Output: PDF.', hi: 'इनपुट: PDF (पासवर्ड रहित)। आउटपुट: PDF।' },
    steps: [
      { en: 'Add two or more PDFs.', hi: 'दो या अधिक PDF जोड़ें।' },
      { en: 'Reorder with the up and down buttons; remove any you do not need.', hi: 'ऊपर-नीचे बटन से क्रम बदलें; जो नहीं चाहिए उसे हटाएँ।' },
      { en: 'Press Merge.', hi: 'मर्ज दबाएँ।' },
      { en: 'Download the merged PDF.', hi: 'जुड़ी हुई PDF डाउनलोड करें।' },
    ],
    limits: [
      { en: 'Password-protected or damaged PDFs are rejected with a message.', hi: 'पासवर्ड वाली या खराब PDF संदेश के साथ अस्वीकार की जाती हैं।' },
      { en: 'Interactive form fields and bookmarks may not be preserved in the merged file.', hi: 'जुड़ी फ़ाइल में इंटरैक्टिव फॉर्म फ़ील्ड और बुकमार्क सुरक्षित न रहें, यह संभव है।' },
    ],
    faqs: [
      {
        q: { en: 'Does merging reduce quality?', hi: 'क्या मर्ज करने से क्वालिटी घटती है?' },
        a: { en: 'No. Pages are copied as they are, without recompression.', hi: 'नहीं। पन्ने बिना दोबारा कंप्रेस किए जैसे हैं वैसे कॉपी होते हैं।' },
      },
      {
        q: { en: 'The merged file is too big. What now?', hi: 'जुड़ी फ़ाइल बहुत बड़ी है। अब क्या करें?' },
        a: { en: 'Open the PDF Compressor and try structure optimisation, then page recompression if needed.', hi: 'PDF कंप्रेसर खोलें और पहले संरचना ऑप्टिमाइज़ेशन, फिर ज़रूरत हो तो पेज रीकंप्रेशन आज़माएँ।' },
      },
    ],
    relatedTools: ['pdf-compressor', 'jpg-to-pdf', 'image-compressor'],
    relatedGuides: ['pdf-too-large-what-to-do', 'document-upload-checklist'],
  },
];

export function getTool(slug: string): ToolInfo | undefined {
  return tools.find((t) => t.slug === slug);
}
