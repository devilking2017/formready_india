import AdSlot from '../components/AdSlot';
import SponsoredLink from '../components/SponsoredLink';
import Seo from '../components/Seo';
import ToolCard from '../components/ToolCard';
import { useLang } from '../i18n';
import { tools } from '../content/tools';

export default function AllTools() {
  const { tr } = useLang();
  return (
    <div className="container page">
      <Seo
        title={tr('All Tools – Photo, Signature and PDF Utilities', 'सभी टूल – फोटो, सिग्नेचर और PDF यूटिलिटी')}
        description={tr(
          'Browse all free FormReady India tools: image compressor, photo resizer, signature resizer, PDF compressor, JPG to PDF and PDF merger.',
          'FormReady India के सभी मुफ़्त टूल देखें: इमेज कंप्रेसर, फोटो रिसाइज़र, सिग्नेचर रिसाइज़र, PDF कंप्रेसर, JPG से PDF और PDF मर्जर।'
        )}
        path="/tools"
      />
      <h1>{tr('All Tools', 'सभी टूल')}</h1>
      <p className="lead">{tr('Six free tools for photos, signatures and PDFs. Everything runs in your browser.', 'फोटो, हस्ताक्षर और PDF के लिए छह मुफ़्त टूल। सब कुछ आपके ब्राउज़र में चलता है।')}</p>
      <div className="tool-grid">{tools.map((x) => <ToolCard key={x.slug} tool={x} />)}</div>
      <div className="ad-gap"><AdSlot id="toolsPage" /></div>
      <SponsoredLink />
    </div>
  );
}
