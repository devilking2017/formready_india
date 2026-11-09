import type { Bi } from '../i18n';

export interface Guide {
  slug: string;
  title: Bi;
  desc: Bi;
  body: Bi[];
  tool: string;
  related: string[];
}

export const guides: Guide[] = [
  {
    slug: 'reduce-photo-size-for-online-form',
    title: { en: 'How to reduce photo size for an online form', hi: 'ऑनलाइन फॉर्म के लिए फोटो की साइज़ कैसे घटाएँ' },
    desc: {
      en: 'A practical way to bring a phone photo under a KB limit without making it unusable.',
      hi: 'फोन की फोटो को KB सीमा के नीचे लाने का व्यावहारिक तरीका, बिना उसे बेकार किए।',
    },
    tool: 'image-compressor',
    related: ['photo-resizer', 'signature-resizer'],
    body: [
      {
        en: 'Phone cameras produce photos of several megabytes. Most forms accept only a few dozen or hundred kilobytes, so two things usually have to change: the number of pixels and the compression quality.',
        hi: 'फोन कैमरे कई मेगाबाइट की फोटो बनाते हैं। ज़्यादातर फॉर्म कुछ दर्जन या सौ किलोबाइट ही स्वीकार करते हैं, इसलिए आमतौर पर दो चीज़ें बदलनी पड़ती हैं: पिक्सेल की संख्या और कंप्रेशन क्वालिटी।',
      },
      {
        en: 'Start by reading the form instructions carefully. Note the required width and height (if any), the file type and the maximum size. Use the Photo Resizer first if exact pixel dimensions are needed, then use the Image Compressor if the file is still above the limit.',
        hi: 'सबसे पहले फॉर्म के निर्देश ध्यान से पढ़ें। माँगी गई चौड़ाई-ऊँचाई (यदि हो), फ़ाइल प्रकार और अधिकतम साइज़ नोट करें। सटीक पिक्सेल आयाम चाहिए तो पहले फोटो रिसाइज़र, और फ़ाइल फिर भी सीमा से ऊपर हो तो इमेज कंप्रेसर इस्तेमाल करें।',
      },
      {
        en: 'JPEG is usually the best format for photos because quality can be tuned smoothly. PNG keeps sharp edges but gives large files for photographs. Avoid taking a screenshot of a photo: it lowers the quality for no benefit.',
        hi: 'फोटो के लिए आमतौर पर JPEG सबसे अच्छा है क्योंकि क्वालिटी धीरे-धीरे ट्यून की जा सकती है। PNG तेज़ किनारे रखता है पर फोटो के लिए बड़ी फ़ाइल देता है। फोटो का स्क्रीनशॉट न लें: इससे बिना लाभ के क्वालिटी घटती है।',
      },
      {
        en: 'After compressing, look at the preview. Faces and text should still be clear. If they are not, the target may be too small for the image; try a different original photo with good light and a plain background.',
        hi: 'कंप्रेस करने के बाद प्रीव्यू देखें। चेहरे और टेक्स्ट साफ़ दिखने चाहिए। न दिखें तो लक्ष्य इमेज के लिए बहुत छोटा हो सकता है; अच्छी रोशनी और सादे बैकग्राउंड वाली दूसरी मूल फोटो आज़माएँ।',
      },
    ],
  },
  {
    slug: 'signature-size-for-online-forms',
    title: { en: 'Preparing a signature image for online forms', hi: 'ऑनलाइन फॉर्म के लिए हस्ताक्षर की इमेज तैयार करना' },
    desc: {
      en: 'How to photograph, crop and resize a signature so it stays readable.',
      hi: 'हस्ताक्षर की फोटो लेने, क्रॉप करने और रिसाइज़ करने का तरीका ताकि वह पढ़ने योग्य रहे।',
    },
    tool: 'signature-resizer',
    related: ['photo-resizer', 'image-compressor'],
    body: [
      {
        en: 'Use a dark pen on plain white paper. Place the paper on a flat surface near a window, and take the photo straight from above so the lines are not tilted or shadowed.',
        hi: 'सादे सफ़ेद कागज़ पर गहरे रंग का पेन इस्तेमाल करें। कागज़ को खिड़की के पास समतल सतह पर रखें और ऊपर से सीधी फोटो लें ताकि रेखाएँ तिरछी या छायादार न हों।',
      },
      {
        en: 'Crop the picture close to the signature before resizing; a lot of empty paper wastes pixels. Then enter the width and height your form asks for. Signature boxes are usually wide and short, so keep the same shape.',
        hi: 'रिसाइज़ से पहले तस्वीर को हस्ताक्षर के पास तक क्रॉप करें; बहुत सारा खाली कागज़ पिक्सेल बर्बाद करता है। फिर फॉर्म में माँगी चौड़ाई और ऊँचाई भरें। सिग्नेचर बॉक्स आमतौर पर चौड़े और कम ऊँचे होते हैं, इसलिए वही आकार रखें।',
      },
      {
        en: 'Check the preview. Thin strokes should still be visible. If you need a transparent background, save as PNG; many government forms ask for JPG instead, so follow the form.',
        hi: 'प्रीव्यू देखें। पतली रेखाएँ अब भी दिखनी चाहिए। पारदर्शी बैकग्राउंड चाहिए तो PNG में सेव करें; कई सरकारी फॉर्म JPG माँगते हैं, इसलिए फॉर्म के अनुसार चलें।',
      },
    ],
  },
  {
    slug: 'pdf-too-large-what-to-do',
    title: { en: 'PDF too large to upload? What to do', hi: 'PDF अपलोड के लिए बहुत बड़ी है? क्या करें' },
    desc: {
      en: 'Understand why PDFs get big and the safe order of steps to shrink them.',
      hi: 'समझें कि PDF बड़ी क्यों होती है और उसे छोटा करने के सुरक्षित क्रम।',
    },
    tool: 'pdf-compressor',
    related: ['pdf-merger', 'jpg-to-pdf'],
    body: [
      {
        en: 'A PDF made from scanned pages or phone photos is large because every page is a big picture. A PDF exported from a word processor is mostly text and is already small.',
        hi: 'स्कैन किए पन्नों या फोन की फोटो से बनी PDF इसलिए बड़ी होती है क्योंकि हर पन्ना एक बड़ी तस्वीर होता है। वर्ड प्रोसेसर से निकली PDF ज़्यादातर टेक्स्ट होती है और पहले से छोटी होती है।',
      },
      {
        en: 'First try lossless structure optimisation; it never changes how the document looks. If the file is still too big, recompress the pages as images and lower the resolution or quality step by step, checking readability each time.',
        hi: 'पहले लॉसलेस संरचना ऑप्टिमाइज़ेशन आज़माएँ; यह दस्तावेज़ का रूप नहीं बदलता। फ़ाइल फिर भी बड़ी हो तो पन्नों को इमेज की तरह दोबारा कंप्रेस करें और रिज़ॉल्यूशन या क्वालिटी धीरे-धीरे घटाएँ, हर बार पढ़ने योग्यता जाँचें।',
      },
      {
        en: 'If you are building the PDF from photos, shrink the photos first or lower the quality in JPG to PDF. Fewer pages also help: combine only the pages the form asks for.',
        hi: 'यदि PDF फोटो से बना रहे हैं, तो पहले फोटो छोटी करें या JPG से PDF में क्वालिटी घटाएँ। कम पन्ने भी मदद करते हैं: फॉर्म में जितने पन्ने माँगे हों उतने ही जोड़ें।',
      },
    ],
  },
  {
    slug: 'document-upload-checklist',
    title: { en: 'Checklist before uploading documents to a form', hi: 'फॉर्म में डॉक्यूमेंट अपलोड करने से पहले की चेकलिस्ट' },
    desc: {
      en: 'A short list to avoid rejected uploads and to protect your personal information.',
      hi: 'अपलोड अस्वीकार होने से बचने और अपनी निजी जानकारी सुरक्षित रखने की छोटी सूची।',
    },
    tool: 'image-compressor',
    related: ['photo-resizer', 'pdf-compressor', 'jpg-to-pdf'],
    body: [
      {
        en: 'Read the official notification for the exact photo size, signature size, file type and maximum KB. Rules differ between exams and institutions, and they can change between years.',
        hi: 'सटीक फोटो साइज़, सिग्नेचर साइज़, फ़ाइल प्रकार और अधिकतम KB के लिए आधिकारिक अधिसूचना पढ़ें। नियम परीक्षाओं और संस्थानों में अलग होते हैं और हर साल बदल सकते हैं।',
      },
      {
        en: 'Rename files clearly, keep the original files safe, and open each processed file once before uploading to make sure it looks right.',
        hi: 'फ़ाइलों के नाम साफ़ रखें, मूल फ़ाइलें सुरक्षित रखें और अपलोड से पहले हर प्रोसेस की गई फ़ाइल एक बार खोलकर जाँच लें।',
      },
      {
        en: 'Protect your privacy: share identity documents only on the official form you are filling. Use tools that process files locally, as FormReady India does, and never type passwords or identity numbers into unknown websites.',
        hi: 'अपनी गोपनीयता सुरक्षित रखें: पहचान पत्र केवल उसी आधिकारिक फॉर्म पर दें जिसे आप भर रहे हैं। ऐसे टूल इस्तेमाल करें जो फ़ाइलें स्थानीय रूप से प्रोसेस करते हों, जैसे FormReady India, और अज्ञात वेबसाइटों पर पासवर्ड या पहचान संख्या कभी न लिखें।',
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
