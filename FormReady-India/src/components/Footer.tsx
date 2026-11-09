import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import AdSlot from './AdSlot';
import Logo from './Logo';
import { useLang } from '../i18n';
import { site, telHref } from '../config/site';
import { tools } from '../content/tools';

const socialNames: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'X / Twitter',
  youtube: 'YouTube',
  telegram: 'Telegram',
};

export default function Footer() {
  const { tr, t } = useLang();
  const socials = Object.entries(site.social).filter(([, v]) => v.trim() !== '');
  const hasContact = site.contactEmail || site.contactPhone || site.address;

  return (
    <footer className="site-footer">
      <div className="container">
        <AdSlot id="footerBanner" />
        <div className="footer-grid">
          <div>
            <div className="brand footer-brand">
              <Logo size={32} />
              <span>{site.siteName}</span>
            </div>
            <p className="muted-light">
              {tr(
                'Independent, free document tools. Your files stay in your browser.',
                'स्वतंत्र और मुफ़्त डॉक्यूमेंट टूल। आपकी फ़ाइलें आपके ब्राउज़र में ही रहती हैं।'
              )}
            </p>
            <p className="muted-light small">
              {tr(
                'FormReady India is an independent utility website and is not affiliated with any government department.',
                'FormReady India एक स्वतंत्र यूटिलिटी वेबसाइट है और किसी सरकारी विभाग से संबद्ध नहीं है।'
              )}
            </p>
          </div>
          <div>
            <h3>{tr('Tools', 'टूल')}</h3>
            <ul>
              {tools.map((x) => (
                <li key={x.slug}>
                  <Link to={`/${x.slug}`}>{t(x.name)}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{tr('Important links', 'महत्वपूर्ण लिंक')}</h3>
            <ul>
              <li><Link to="/guides">{tr('Document Guides', 'डॉक्यूमेंट गाइड')}</Link></li>
              <li><Link to="/about">{tr('About Us', 'हमारे बारे में')}</Link></li>
              <li><Link to="/contact">{tr('Contact Us', 'संपर्क करें')}</Link></li>
              <li><Link to="/privacy-policy">{tr('Privacy Policy', 'गोपनीयता नीति')}</Link></li>
              <li><Link to="/terms">{tr('Terms & Conditions', 'नियम और शर्तें')}</Link></li>
              <li><Link to="/disclaimer">{tr('Disclaimer', 'अस्वीकरण')}</Link></li>
            </ul>
          </div>
          <div>
            <h3>{tr('Contact & social', 'संपर्क और सोशल')}</h3>
            {hasContact ? (
              <ul className="contact-list">
                {site.contactEmail && (
                  <li><Mail size={16} /> <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></li>
                )}
                {site.contactPhone && (
                  <li><Phone size={16} /> <a href={telHref(site.contactPhone)}>{site.contactPhone}</a></li>
                )}
                {site.address && (
                  <li><MapPin size={16} /> {site.address}</li>
                )}
              </ul>
            ) : (
              <p className="muted-light small">
                {tr(
                  'Contact details will be added by the site owner.',
                  'संपर्क विवरण साइट के मालिक द्वारा जोड़े जाएँगे।'
                )}
              </p>
            )}
            {socials.length > 0 ? (
              <ul>
                {socials.map(([k, v]) => (
                  <li key={k}>
                    <a href={v} target="_blank" rel="noopener noreferrer">{socialNames[k] ?? k}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted-light small">
                {tr('Social links: to be added by the site owner.', 'सोशल लिंक: साइट के मालिक द्वारा जोड़े जाएँगे।')}
              </p>
            )}
          </div>
        </div>
        <p className="copyright">
          © {new Date().getFullYear()} {site.siteName}. {tr('All rights reserved.', 'सर्वाधिकार सुरक्षित।')}
        </p>
      </div>
    </footer>
  );
}
