import { Link, Navigate, useParams } from 'react-router-dom';
import AdSlot from '../components/AdSlot';
import Seo from '../components/Seo';
import { useLang } from '../i18n';
import { getGuide, guides } from '../content/guides';
import { getTool } from '../content/tools';

export function GuidesIndex() {
  const { tr, t } = useLang();
  return (
    <div className="container page">
      <Seo
        title={tr('Document Guides for Online Forms', 'ऑनलाइन फॉर्म के लिए डॉक्यूमेंट गाइड')}
        description={tr(
          'Practical guides on preparing photos, signatures and PDFs for online forms, with privacy tips.',
          'ऑनलाइन फॉर्म के लिए फोटो, हस्ताक्षर और PDF तैयार करने की व्यावहारिक गाइड, गोपनीयता सुझावों सहित।'
        )}
        path="/guides"
      />
      <h1>{tr('Document Guides', 'डॉक्यूमेंट गाइड')}</h1>
      <p className="lead">{tr('Short, practical guides to help your uploads get accepted the first time.', 'छोटी, व्यावहारिक गाइड ताकि आपके अपलोड पहली बार में स्वीकार हों।')}</p>
      <div className="tool-grid">
        {guides.map((g) => (
          <Link key={g.slug} to={`/guides/${g.slug}`} className="card link-card">
            <h2 className="h3">{t(g.title)}</h2>
            <p className="muted">{t(g.desc)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GuidePage() {
  const { slug } = useParams();
  const { tr, t } = useLang();
  const g = slug ? getGuide(slug) : undefined;
  if (!g) return <Navigate to="/guides" replace />;
  const mainTool = getTool(g.tool);
  const mid = Math.ceil(g.body.length / 2);
  return (
    <article className="container page narrow">
      <Seo title={t(g.title)} description={t(g.desc)} path={`/guides/${g.slug}`} />
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">{tr('Home', 'होम')}</Link> / <Link to="/guides">{tr('Guides', 'गाइड')}</Link> / <span>{t(g.title)}</span>
      </nav>
      <h1>{t(g.title)}</h1>
      <p className="lead">{t(g.desc)}</p>
      {g.body.slice(0, mid).map((p, i) => <p key={i}>{t(p)}</p>)}
      <div className="ad-gap"><AdSlot id="blogInContent" /></div>
      {g.body.slice(mid).map((p, i) => <p key={i}>{t(p)}</p>)}
      {mainTool && (
        <p>
          <Link className="btn btn-primary" to={`/${mainTool.slug}`}>{tr('Open', 'खोलें')}: {t(mainTool.name)}</Link>
        </p>
      )}
      <h2>{tr('Related tools', 'संबंधित टूल')}</h2>
      <ul className="inline-links">
        {g.related.map((s) => { const r = getTool(s); return r ? <li key={s}><Link to={`/${s}`}>{t(r.name)}</Link></li> : null; })}
      </ul>
      <p className="small muted">{tr('FormReady India is an independent utility website and is not affiliated with any government department. Always follow your form’s official instructions.', 'FormReady India एक स्वतंत्र यूटिलिटी वेबसाइट है और किसी सरकारी विभाग से संबद्ध नहीं है। हमेशा अपने फॉर्म के आधिकारिक निर्देशों का पालन करें।')}</p>
    </article>
  );
}
