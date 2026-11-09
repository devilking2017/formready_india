import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';
import Seo from '../components/Seo';
import { useLang } from '../i18n';
import { site, telHref } from '../config/site';

function Page({ path, title, desc, children }: { path: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="container page narrow">
      <Seo title={title} description={desc} path={path} />
      <h1>{title}</h1>
      {children}
    </div>
  );
}

const placeholder = (v: string, en: string, hi: string, tr: (a: string, b: string) => string) =>
  v.trim() ? v : tr(en, hi);

export function About() {
  const { tr } = useLang();
  return (
    <Page path="/about" title={tr('About Us', 'हमारे बारे में')} desc={tr('About FormReady India, a free independent set of browser-based photo, signature and PDF tools.', 'FormReady India के बारे में: फोटो, हस्ताक्षर और PDF के लिए मुफ़्त, स्वतंत्र, ब्राउज़र-आधारित टूल।')}>
      <p>{tr('FormReady India offers free tools that help people prepare photos, signatures and PDF documents for online forms such as job applications and college admissions.', 'FormReady India मुफ़्त टूल देता है जो लोगों को नौकरी आवेदन और कॉलेज प्रवेश जैसे ऑनलाइन फॉर्म के लिए फोटो, हस्ताक्षर और PDF दस्तावेज़ तैयार करने में मदद करते हैं।')}</p>
      <p>{tr('Every tool runs inside your browser. Your files are not uploaded to our servers.', 'हर टूल आपके ब्राउज़र में चलता है। आपकी फ़ाइलें हमारे सर्वर पर अपलोड नहीं होतीं।')}</p>
      <p><strong>{tr('Independence:', 'स्वतंत्रता:')}</strong> {tr('FormReady India is an independent utility website and is not affiliated with any government department, exam body or university.', 'FormReady India एक स्वतंत्र यूटिलिटी वेबसाइट है और किसी सरकारी विभाग, परीक्षा निकाय या विश्वविद्यालय से संबद्ध नहीं है।')}</p>
      <p><strong>{tr('Operated by:', 'संचालक:')}</strong> {placeholder(site.ownerName, '[Owner name – to be added by the site owner]', '[मालिक का नाम – साइट के मालिक द्वारा जोड़ा जाएगा]', tr)}</p>
      <p><Link to="/contact">{tr('Contact us', 'संपर्क करें')}</Link></p>
    </Page>
  );
}

export function Contact() {
  const { tr } = useLang();
  return (
    <Page path="/contact" title={tr('Contact Us', 'संपर्क करें')} desc={tr('How to contact the FormReady India site owner.', 'FormReady India के साइट मालिक से संपर्क कैसे करें।')}>
      <p>{tr('Questions about the tools, feedback or a problem to report? Use the contact details below.', 'टूल के बारे में प्रश्न, सुझाव या कोई समस्या बतानी है? नीचे दिए संपर्क विवरण का उपयोग करें।')}</p>
      <ul className="contact-card">
        <li><Mail size={18} /> {site.contactEmail ? <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> : <em>{tr('[Email – to be added by the site owner]', '[ईमेल – साइट के मालिक द्वारा जोड़ा जाएगा]')}</em>}</li>
        <li><Phone size={18} /> {site.contactPhone ? <a href={telHref(site.contactPhone)}>{site.contactPhone}</a> : <em>{tr('[Phone – optional, to be added by the site owner]', '[फ़ोन – वैकल्पिक, साइट के मालिक द्वारा जोड़ा जाएगा]')}</em>}</li>
        <li><MapPin size={18} /> {site.address ? site.address : <em>{tr('[Address – optional, to be added by the site owner]', '[पता – वैकल्पिक, साइट के मालिक द्वारा जोड़ा जाएगा]')}</em>}</li>
      </ul>
      <p className="muted small">{tr('Please do not send passwords, Aadhaar numbers or other sensitive documents by email. We never need them.', 'कृपया ईमेल से पासवर्ड, आधार नंबर या अन्य संवेदनशील दस्तावेज़ न भेजें। हमें उनकी कभी आवश्यकता नहीं होती।')}</p>
    </Page>
  );
}

export function Privacy() {
  const { tr } = useLang();
  return (
    <Page path="/privacy-policy" title={tr('Privacy Policy', 'गोपनीयता नीति')} desc={tr('How FormReady India handles your files and data.', 'FormReady India आपकी फ़ाइलों और डेटा को कैसे संभालता है।')}>
      <p className="muted small">{tr('Last updated', 'अंतिम अपडेट')}: {site.lastUpdated}</p>
      <h2>{tr('Your files', 'आपकी फ़ाइलें')}</h2>
      <p>{tr('Photos, signatures and PDFs you select are processed locally in your browser. They are not uploaded to our servers and are not stored in local storage or any database. They are released from memory when you reset a tool or leave the page.', 'आपकी चुनी हुई फोटो, हस्ताक्षर और PDF आपके ब्राउज़र में स्थानीय रूप से प्रोसेस होती हैं। वे हमारे सर्वर पर अपलोड नहीं होतीं और लोकल स्टोरेज या किसी डेटाबेस में सहेजी नहीं जातीं। टूल रीसेट करने या पेज छोड़ने पर वे मेमोरी से हट जाती हैं।')}</p>
      <h2>{tr('What we store', 'हम क्या सहेजते हैं')}</h2>
      <p>{tr('Only your language choice is saved in your browser so the site opens in the language you picked.', 'केवल आपकी भाषा की पसंद आपके ब्राउज़र में सहेजी जाती है ताकि साइट आपकी चुनी भाषा में खुले।')}</p>
      <h2>{tr('Advertising', 'विज्ञापन')}</h2>
      <p>{tr('This site is supported by advertising from the third-party ad network Adsterra. It may show banner ads, native ads, a social bar, a pop-under and sponsored links. Ad networks may use cookies or similar technologies to show and measure ads. To keep your work uninterrupted, pop-under and social-bar ads load only on guide and About pages, never on the Home page, the tools list or any tool page. Ads run separately from the tools and cannot access your files. Please read the ad network’s own privacy policy for details.', 'यह साइट तृतीय-पक्ष विज्ञापन नेटवर्क Adsterra के विज्ञापनों से समर्थित है। इसमें बैनर विज्ञापन, नेटिव विज्ञापन, सोशल बार, पॉप-अंडर और प्रायोजित लिंक दिख सकते हैं। विज्ञापन नेटवर्क विज्ञापन दिखाने और मापने के लिए कुकी या समान तकनीक का उपयोग कर सकते हैं। आपका काम बाधित न हो, इसलिए पॉप-अंडर और सोशल-बार विज्ञापन केवल गाइड और About पेज पर लोड होते हैं, होम पेज, टूल सूची या किसी भी टूल पेज पर कभी नहीं। विज्ञापन टूल से अलग चलते हैं और आपकी फ़ाइलों तक नहीं पहुँच सकते। विवरण के लिए विज्ञापन नेटवर्क की अपनी गोपनीयता नीति पढ़ें।')}</p>
      <h2>{tr('What we never ask for', 'हम क्या कभी नहीं माँगते')}</h2>
      <p>{tr('We never ask for Aadhaar numbers, passwords or other unnecessary personal details.', 'हम आधार नंबर, पासवर्ड या अन्य अनावश्यक निजी जानकारी कभी नहीं माँगते।')}</p>
      <h2>{tr('Contact', 'संपर्क')}</h2>
      <p>{tr('For privacy questions, see the', 'गोपनीयता संबंधी प्रश्नों के लिए')} <Link to="/contact">{tr('Contact page', 'संपर्क पेज')}</Link>.</p>
    </Page>
  );
}

export function Terms() {
  const { tr } = useLang();
  return (
    <Page path="/terms" title={tr('Terms and Conditions', 'नियम और शर्तें')} desc={tr('Terms for using FormReady India tools.', 'FormReady India टूल उपयोग करने की शर्तें।')}>
      <p className="muted small">{tr('Last updated', 'अंतिम अपडेट')}: {site.lastUpdated}</p>
      <p>{tr('By using this website you agree to these terms. If you do not agree, please do not use it.', 'इस वेबसाइट का उपयोग करके आप इन शर्तों से सहमत होते हैं। सहमत न हों तो कृपया उपयोग न करें।')}</p>
      <ul>
        <li>{tr('The tools are provided free and “as is”, without any guarantee that results will be accepted by any website, exam body or institution.', 'टूल मुफ़्त और “जैसे हैं वैसे” उपलब्ध कराए जाते हैं, इस गारंटी के बिना कि परिणाम किसी वेबसाइट, परीक्षा निकाय या संस्था द्वारा स्वीकार किए जाएँगे।')}</li>
        <li>{tr('You are responsible for checking that your output meets your form’s official requirements and for keeping copies of your original files.', 'आप स्वयं जाँचने के लिए ज़िम्मेदार हैं कि आउटपुट आपके फॉर्म की आधिकारिक आवश्यकताएँ पूरी करता है और मूल फ़ाइलों की प्रतियाँ सुरक्षित रखें।')}</li>
        <li>{tr('Use the tools only with files you have the right to use.', 'टूल का उपयोग केवल उन्हीं फ़ाइलों के साथ करें जिनके उपयोग का आपको अधिकार है।')}</li>
        <li>{tr('We may change or remove tools or content at any time.', 'हम किसी भी समय टूल या सामग्री बदल या हटा सकते हैं।')}</li>
        <li>{tr('To the extent allowed by law, we are not liable for loss arising from use of the site.', 'कानून द्वारा अनुमत सीमा तक, साइट के उपयोग से होने वाली हानि के लिए हम उत्तरदायी नहीं हैं।')}</li>
      </ul>
    </Page>
  );
}

export function Disclaimer() {
  const { tr } = useLang();
  return (
    <Page path="/disclaimer" title={tr('Disclaimer', 'अस्वीकरण')} desc={tr('FormReady India is independent and not affiliated with any government body.', 'FormReady India स्वतंत्र है और किसी सरकारी निकाय से संबद्ध नहीं है।')}>
      <p><strong>{tr('FormReady India is an independent utility website and is not affiliated with any government department, ministry, exam body, university or official application portal.', 'FormReady India एक स्वतंत्र यूटिलिटी वेबसाइट है और किसी सरकारी विभाग, मंत्रालय, परीक्षा निकाय, विश्वविद्यालय या आधिकारिक आवेदन पोर्टल से संबद्ध नहीं है।')}</strong></p>
      <p>{tr('Size presets shown in the tools are common examples only. They are not official requirements. Requirements differ for each form and can change; always follow the official notification for your application.', 'टूल में दिखाए गए साइज़ प्रीसेट केवल सामान्य उदाहरण हैं। वे आधिकारिक आवश्यकताएँ नहीं हैं। आवश्यकताएँ हर फॉर्म के लिए अलग होती हैं और बदल सकती हैं; अपने आवेदन की आधिकारिक अधिसूचना का ही पालन करें।')}</p>
      <p>{tr('Image and PDF compression is lossy in some modes and may reduce quality. Check every result before you submit it.', 'कुछ मोड में इमेज और PDF कंप्रेशन लॉसी होता है और क्वालिटी घट सकती है। जमा करने से पहले हर परिणाम जाँचें।')}</p>
      <p>{tr('We do not guarantee that any output will be accepted by a third-party website.', 'हम गारंटी नहीं देते कि कोई भी आउटपुट किसी तृतीय-पक्ष वेबसाइट द्वारा स्वीकार किया जाएगा।')}</p>
    </Page>
  );
}

export function NotFound() {
  const { tr } = useLang();
  return (
    <Page path="/404" title={tr('Page not found', 'पेज नहीं मिला')} desc={tr('The page you are looking for does not exist.', 'आप जो पेज खोज रहे हैं वह मौजूद नहीं है।')}>
      <p>{tr('The page you requested does not exist.', 'आपका माँगा गया पेज मौजूद नहीं है।')}</p>
      <p><Link className="btn btn-primary" to="/tools">{tr('Browse all tools', 'सभी टूल देखें')}</Link></p>
    </Page>
  );
}
