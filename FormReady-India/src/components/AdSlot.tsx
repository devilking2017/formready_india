import { useMemo } from 'react';
import { ADS_GLOBAL_ENABLED, adSlots, type AdSlotId } from '../config/ads';
import { useLang } from '../i18n';

/**
 * Renders an ad only when the owner has enabled the slot AND pasted verified
 * Adsterra code into src/config/ads.ts. Otherwise renders nothing at all.
 * The code runs in a sandboxed iframe: it cannot navigate the page, cannot read
 * the page or the user's files, and cannot clash with other slots.
 */
export default function AdSlot({ id }: { id: AdSlotId }) {
  const { tr } = useLang();
  const cfg = adSlots[id];
  const active = ADS_GLOBAL_ENABLED && cfg.enabled && cfg.html.trim() !== '';
  const srcDoc = useMemo(
    () =>
      active
        ? `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>${cfg.html}</body></html>`
        : '',
    [active, cfg.html]
  );
  if (!active) return null;
  return (
    <aside className="ad-wrap" aria-label={tr('Advertisement', 'विज्ञापन')}>
      <span className="ad-label">{tr('Advertisement', 'विज्ञापन')}</span>
      <div className="ad-box" style={{ maxWidth: '100%', width: cfg.width, height: cfg.height }}>
        <iframe
          title={tr('Advertisement', 'विज्ञापन')}
          srcDoc={srcDoc}
          width={cfg.width}
          height={cfg.height}
          loading="lazy"
          scrolling="no"
          style={{ border: 0, maxWidth: '100%' }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </aside>
  );
}
