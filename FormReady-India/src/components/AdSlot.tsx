import { useEffect, useId, useState, type SyntheticEvent } from 'react';
import { ADS_ENABLED, adPlacements, adUnits, type AdSlotId, type UnitKey } from '../config/ads';
import { useLang } from '../i18n';

/** Which slot currently "owns" each unit, so one unit is never rendered twice on a page. */
const owners = new Map<UnitKey, string>();

function useMinWidth(min: number): boolean {
  const query = `(min-width: ${min}px)`;
  const [match, setMatch] = useState<boolean>(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

/**
 * Loads the ad code inside /ad-frame.html, a small real page on YOUR domain, so the ad
 * network sees a valid site address (this is what makes ads actually appear). The frame
 * is sandboxed: it cannot navigate or redirect the main page. Ad code is written into
 * the frame once; the guard stops it from being written twice.
 */
function writeAd(e: SyntheticEvent<HTMLIFrameElement>, html: string) {
  const frame = e.currentTarget;
  if (frame.dataset.written === '1') return;
  const doc = frame.contentDocument;
  if (!doc) return;
  frame.dataset.written = '1';
  doc.open();
  doc.write(
    `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>${html}</body></html>`
  );
  doc.close();
}

/**
 * Renders a banner/native ad only when verified Adsterra code is present in
 * src/config/ads.ts. Otherwise renders nothing.
 */
export default function AdSlot({ id }: { id: AdSlotId }) {
  const { tr } = useLang();
  const instance = useId();
  const placement = adPlacements[id];
  const wide = useMinWidth(placement.minWidth ?? 768);
  const key: UnitKey | null = wide ? placement.desktop : placement.mobile;
  const unit = key ? adUnits[key] : null;
  const hasCode = ADS_ENABLED && !!unit && unit.html.trim() !== '';
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (!key || !hasCode) {
      setClaimed(false);
      return;
    }
    if (!owners.has(key) || owners.get(key) === instance) {
      owners.set(key, instance);
      setClaimed(true);
    } else {
      setClaimed(false);
    }
    return () => {
      if (owners.get(key) === instance) owners.delete(key);
      setClaimed(false);
    };
  }, [key, hasCode, instance]);

  if (!hasCode || !claimed || !unit || !key) return null;
  const fluid = unit.width === 'fluid';
  return (
    <aside className="ad-wrap" aria-label={tr('Advertisement', 'विज्ञापन')}>
      <span className="ad-label">{tr('Advertisement', 'विज्ञापन')}</span>
      <div className="ad-box" style={{ width: fluid ? '100%' : unit.width, maxWidth: '100%', height: unit.height }}>
        <iframe
          key={key}
          title={tr('Advertisement', 'विज्ञापन')}
          src="/ad-frame.html"
          onLoad={(e) => writeAd(e, unit.html)}
          width={fluid ? '100%' : unit.width}
          height={unit.height}
          scrolling="no"
          style={{ border: 0, maxWidth: '100%', width: fluid ? '100%' : undefined }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </aside>
  );
}
