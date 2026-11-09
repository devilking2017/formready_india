import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Smartphone, Languages, BadgeCheck, Wallet } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import SponsoredLink from '../components/SponsoredLink';
import Seo from '../components/Seo';
import ToolCard from '../components/ToolCard';
import { useLang } from '../i18n';
import { tools } from '../content/tools';
import { guides } from '../content/guides';

export default function Home() {
  const { tr, t } = useLang();
  const [q, setQ] = useState('');
  const popular = tools.filter((x) => x.popular);
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return tools;
    return tools.filter((x) => `${x.name.en} ${x.name.hi} ${x.short.en} ${x.short.hi}`.toLowerCase().includes(s));
  }, [q]);

  const faqs = [
    {
      q: tr('Are my files uploaded to a server?', 'क्या मेरी फ़ाइलें किसी सर्वर पर अपलोड होती हैं?'),
      a: tr('No. All tools run inside your browser. Your photos, signatures and PDFs stay on your device.', 'नहीं। सभी टूल आपके ब्राउज़र में चलते हैं। आपकी फोटो, हस्ताक्षर और PDF आपके डिवाइस पर ही रहती हैं।'),
    },
    {
      q: tr('Is it free?', 'क्या यह मुफ़्त है?'),
      a: tr('Yes, the tools are free to use. The site may show advertisements to cover running costs.', 'हाँ, टूल मुफ़्त हैं। चलाने का खर्च निकालने के लिए साइट पर विज्ञापन दिख सकते हैं।'),
    },
    {
      q: tr('Which size should I use for my form?', 'अपने फॉर्म के लिए कौन-सी साइज़ इस्तेमाल करूँ?'),
      a: tr('Always use the size written in your official notification. Presets in our tools are only examples that you can edit.', 'हमेशा अपनी आधिकारिक अधिसूचना में लिखी साइज़ इस्तेमाल करें। हमारे टूल के प्रीसेट केवल उदाहरण हैं जिन्हें आप बदल सकते हैं।'),
    },
    {
      q: tr('Is FormReady India a government website?', 'क्या FormReady India सरकारी वेबसाइट है?'),
      a: tr('No. It is an independent utility website and is not affiliated with any government department.', 'नहीं। यह एक स्वतंत्र यूटिलिटी वेबसाइट है और किसी सरकारी विभाग से संबद्ध नहीं है।'),
    },
    {
      q: tr('Does it work on a phone?', 'क्या यह फोन पर चलता है?'),
      a: tr('Yes. The site is designed for mobile first. Very large PDFs may be slow on older phones.', 'हाँ। साइट पहले मोबाइल के लिए बनी है। बहुत बड़ी PDF पुराने फोन पर धीमी हो सकती हैं।'),
    },
  ];

  return (
    <>
      <Seo
        title={tr('FormReady India – Free Online Photo, Signature & PDF Tools', 'FormReady India – मुफ़्त ऑनलाइन फोटो, सिग्नेचर और PDF टूल')}
        description={tr(
          'Compress and resize photos and signatures, compress, merge and create PDFs for online forms. Free, bilingual, and processed in your browser.',
          'ऑनलाइन फॉर्म के लिए फोटो और हस्ताक्षर कंप्रेस/रिसाइज़ करें, PDF कंप्रेस, मर्ज और तैयार करें। मुफ़्त, द्विभाषी और ब्राउज़र में प्रोसेस।'
        )}
        path="/"
      />

      <section className="hero">
        <div className="container">
          <h1>{tr('Free Online Photo, Signature & PDF Tools', 'मुफ़्त ऑनलाइन फोटो, सिग्नेचर और PDF टूल')}</h1>
          <p className="lead">
            {tr(
              'Get your photo, signature and documents ready for online forms: resize, compress and convert in seconds, right in your browser.',
              'अपनी फोटो, हस्ताक्षर और डॉक्यूमेंट ऑनलाइन फॉर्म के लिए तैयार करें: कुछ ही सेकंड में रिसाइज़, कंप्रेस और कन्वर्ट करें, सीधे अपने ब्राउज़र में।'
            )}
          </p>
          <p className="lead-sub">
            {tr('फोटो, सिग्नेचर और PDF – सब कुछ मुफ़्त, आपके फोन में ही।', 'Photo, signature and PDF – all free, right on your phone.')}
          </p>
          <label className="search">
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tr('Search tools, e.g. “signature” or “PDF”', 'टूल खोजें, जैसे “signature” या “PDF”')}
              aria-label={tr('Search tools', 'टूल खोजें')}
            />
          </label>
          {q.trim() && (
            <div className="search-results">
              {results.length === 0 ? (
                <p className="muted">{tr('No tool matches your search.', 'आपकी खोज से कोई टूल मेल नहीं खाता।')}</p>
              ) : (
                <div className="tool-grid">{results.map((x) => <ToolCard key={x.slug} tool={x} />)}</div>
              )}
            </div>
          )}
          <p className="privacy-pill"><ShieldCheck size={18} /> {tr('Files never leave your device.', 'फ़ाइलें आपके डिवाइस से बाहर नहीं जातीं।')}</p>
        </div>
      </section>

      <div className="container"><AdSlot id="homeBanner" /></div>

      <section className="container section">
        <h2>{tr('Popular tools', 'लोकप्रिय टूल')}</h2>
        <div className="tool-grid">{popular.slice(0, 3).map((x) => <ToolCard key={x.slug} tool={x} />)}</div>
      </section>

      <section className="container section">
        <h2>{tr('All tools', 'सभी टूल')}</h2>
        <div className="tool-grid">{tools.map((x) => <ToolCard key={x.slug} tool={x} />)}</div>
      </section>

      <div className="container"><AdSlot id="homeContent" /></div>

      <section className="container section">
        <h2>{tr('How to use', 'कैसे उपयोग करें')}</h2>
        <ol className="how-grid">
          <li><strong>{tr('1. Choose a tool', '1. टूल चुनें')}</strong><span>{tr('Pick the tool that matches what your form asks for.', 'वह टूल चुनें जो आपके फॉर्म की माँग से मेल खाता हो।')}</span></li>
          <li><strong>{tr('2. Add your file', '2. फ़ाइल जोड़ें')}</strong><span>{tr('Select it from your phone or computer. It is not uploaded.', 'अपने फोन या कंप्यूटर से चुनें। वह अपलोड नहीं होती।')}</span></li>
          <li><strong>{tr('3. Set size and check', '3. साइज़ तय करें और जाँचें')}</strong><span>{tr('Enter the sizes from your notification and check the real result.', 'अधिसूचना की साइज़ भरें और असली परिणाम जाँचें।')}</span></li>
          <li><strong>{tr('4. Download and upload', '4. डाउनलोड करें और अपलोड करें')}</strong><span>{tr('Save the file and upload it to your form.', 'फ़ाइल सहेजें और अपने फॉर्म में अपलोड करें।')}</span></li>
        </ol>
      </section>

      <section className="container section">
        <h2>{tr('Why choose FormReady India', 'FormReady India क्यों चुनें')}</h2>
        <div className="why-grid">
          <div className="card"><ShieldCheck size={26} /><h3>{tr('Private by design', 'डिज़ाइन से ही निजी')}</h3><p>{tr('Processing happens in your browser. No uploads, no accounts.', 'प्रोसेसिंग आपके ब्राउज़र में होती है। न अपलोड, न अकाउंट।')}</p></div>
          <div className="card"><BadgeCheck size={26} /><h3>{tr('Honest results', 'ईमानदार परिणाम')}</h3><p>{tr('We show the real size of the file we made, and say clearly when a target was not reached.', 'हम बनाई गई फ़ाइल की असली साइज़ दिखाते हैं और लक्ष्य पूरा न होने पर साफ़ बताते हैं।')}</p></div>
          <div className="card"><Smartphone size={26} /><h3>{tr('Mobile first', 'पहले मोबाइल')}</h3><p>{tr('Large, easy-to-tap buttons for Android phones and tablets.', 'एंड्रॉइड फोन और टैबलेट के लिए बड़े, आसानी से टैप होने वाले बटन।')}</p></div>
          <div className="card"><Languages size={26} /><h3>{tr('Hindi and English', 'हिंदी और अंग्रेज़ी')}</h3><p>{tr('Switch language at any time from the header.', 'हेडर से कभी भी भाषा बदलें।')}</p></div>
          <div className="card"><Wallet size={26} /><h3>{tr('Free to use', 'उपयोग मुफ़्त')}</h3><p>{tr('Built with open-source tools. Supported by advertisements.', 'ओपन-सोर्स टूल से बना। विज्ञापनों से समर्थित।')}</p></div>
        </div>
      </section>

      <section className="container section">
        <h2>{tr('Frequently asked questions', 'अक्सर पूछे जाने वाले प्रश्न')}</h2>
        {faqs.map((f) => <details key={f.q} className="faq"><summary>{f.q}</summary><p>{f.a}</p></details>)}
      </section>

      <div className="container"><SponsoredLink /></div>

      <section className="container section">
        <h2>{tr('Useful document guides', 'उपयोगी डॉक्यूमेंट गाइड')}</h2>
        <div className="tool-grid">
          {guides.map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`} className="card link-card">
              <h3>{t(g.title)}</h3>
              <p className="muted">{t(g.desc)}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
