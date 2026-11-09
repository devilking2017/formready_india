import { lazy, Suspense } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import AdSlot from '../components/AdSlot';
import Seo from '../components/Seo';
import { useLang } from '../i18n';
import { getTool, tools } from '../content/tools';
import { guides } from '../content/guides';
import { site, siteOrigin } from '../config/site';

const ImageCompressor = lazy(() => import('../tools/ImageCompressor'));
const ResizeTool = lazy(() => import('../tools/ResizeTool'));
const PdfCompressor = lazy(() => import('../tools/PdfCompressor'));
const JpgToPdf = lazy(() => import('../tools/JpgToPdf'));
const PdfMerger = lazy(() => import('../tools/PdfMerger'));

function ToolUi({ slug }: { slug: string }) {
  switch (slug) {
    case 'image-compressor': return <ImageCompressor />;
    case 'photo-resizer': return <ResizeTool kind="photo" />;
    case 'signature-resizer': return <ResizeTool kind="signature" />;
    case 'pdf-compressor': return <PdfCompressor />;
    case 'jpg-to-pdf': return <JpgToPdf />;
    case 'pdf-merger': return <PdfMerger />;
    default: return null;
  }
}

export default function ToolPage({ slug }: { slug: string }) {
  const { tr, t, lang } = useLang();
  const tool = getTool(slug);
  if (!tool) return <Navigate to="/tools" replace />;
  const Icon = tool.icon;
  const path = `/${tool.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${tool.name.en} – ${site.siteName}`,
        url: siteOrigin() + path,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any (web browser)',
        description: tool.seoDesc.en,
        inLanguage: ['en', 'hi'],
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((f) => ({
          '@type': 'Question',
          name: lang === 'hi' ? f.q.hi : f.q.en,
          acceptedAnswer: { '@type': 'Answer', text: lang === 'hi' ? f.a.hi : f.a.en },
        })),
      },
    ],
  };

  return (
    <div className="container page">
      <Seo title={t(tool.seoTitle)} description={t(tool.seoDesc)} path={path} jsonLd={jsonLd} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">{tr('Home', 'होम')}</Link> / <Link to="/tools">{tr('All Tools', 'सभी टूल')}</Link> / <span>{t(tool.name)}</span>
      </nav>
      <h1 className="tool-h1"><Icon size={30} aria-hidden="true" /> {t(tool.name)}</h1>
      <p className="lead">{t(tool.intro)}</p>
      <p className="privacy-pill"><ShieldCheck size={18} /> {tr('Your files are processed in your browser and are never uploaded.', 'आपकी फ़ाइलें आपके ब्राउज़र में प्रोसेस होती हैं और कभी अपलोड नहीं होतीं।')}</p>

      <section className="card tool-card-wrap" aria-label={t(tool.name)}>
        <Suspense fallback={<p className="muted">{tr('Loading tool…', 'टूल लोड हो रहा है…')}</p>}>
          <ToolUi slug={tool.slug} />
        </Suspense>
      </section>

      <div className="ad-gap"><AdSlot id="toolPage" /></div>

      <section className="content-block">
        <h2>{tr('Supported formats', 'समर्थित फ़ॉर्मैट')}</h2>
        <p>{t(tool.formats)}</p>
        <h2>{tr('How to use', 'कैसे उपयोग करें')}</h2>
        <ol className="steps">{tool.steps.map((s, i) => <li key={i}>{t(s)}</li>)}</ol>
        <h2>{tr('Limitations to know', 'ध्यान देने योग्य सीमाएँ')}</h2>
        <ul>{tool.limits.map((s, i) => <li key={i}>{t(s)}</li>)}</ul>
        <h2>{tr('Privacy', 'गोपनीयता')}</h2>
        <p>{tr('Files are handled in memory inside your browser tab and are not saved to local storage or sent to any server. Closing or resetting the tool clears them. We never ask for Aadhaar numbers or passwords.', 'फ़ाइलें आपके ब्राउज़र टैब की मेमोरी में संभाली जाती हैं, लोकल स्टोरेज में सहेजी नहीं जातीं और किसी सर्वर को भेजी नहीं जातीं। टूल बंद या रीसेट करने पर वे हट जाती हैं। हम आधार नंबर या पासवर्ड कभी नहीं माँगते।')}</p>
        <p className="small muted">{tr('FormReady India is an independent utility website and is not affiliated with any government department. Check your own form’s official instructions for required sizes.', 'FormReady India एक स्वतंत्र यूटिलिटी वेबसाइट है और किसी सरकारी विभाग से संबद्ध नहीं है। आवश्यक साइज़ के लिए अपने फॉर्म के आधिकारिक निर्देश देखें।')}</p>
        <h2>{tr('Frequently asked questions', 'अक्सर पूछे जाने वाले प्रश्न')}</h2>
        {tool.faqs.map((f, i) => (
          <details key={i} className="faq"><summary>{t(f.q)}</summary><p>{t(f.a)}</p></details>
        ))}
        <h2>{tr('Related tools', 'संबंधित टूल')}</h2>
        <ul className="inline-links">
          {tool.relatedTools.map((s) => { const r = getTool(s); return r ? <li key={s}><Link to={`/${s}`}>{t(r.name)}</Link></li> : null; })}
        </ul>
        <h2>{tr('Related guides', 'संबंधित गाइड')}</h2>
        <ul className="inline-links">
          {tool.relatedGuides.map((s) => { const g = guides.find((x) => x.slug === s); return g ? <li key={s}><Link to={`/guides/${s}`}>{t(g.title)}</Link></li> : null; })}
        </ul>
      </section>
    </div>
  );
}

export { tools };
