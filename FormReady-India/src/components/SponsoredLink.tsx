import { ADS_ENABLED, smartlink } from '../config/ads';
import { useLang } from '../i18n';

/**
 * Optional, clearly labelled "Sponsored" text link for Adsterra Smartlink.
 * Only used on content pages (never on tool pages). It never opens automatically
 * and is never attached to an Upload or Download button.
 */
export default function SponsoredLink() {
  const { tr } = useLang();
  const url = smartlink.url.trim();
  if (!ADS_ENABLED || !(url.startsWith('https://') || url.startsWith('//'))) return null;
  return (
    <aside className="sponsored" aria-label={tr('Sponsored link', 'प्रायोजित लिंक')}>
      <span className="ad-label">{tr('Sponsored', 'प्रायोजित')}</span>
      <a href={url} target="_blank" rel="sponsored noopener noreferrer">
        {tr(smartlink.textEn, smartlink.textHi)}
      </a>
    </aside>
  );
}
