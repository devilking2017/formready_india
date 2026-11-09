import { useEffect, useId, useMemo, useState } from 'react';
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
 * Renders a banner/native ad only when the owner has pasted verified Adsterra code in
 * src/config/ads.ts. Otherwise renders nothing. The code runs in a sandboxed iframe:
 * it cannot navigate the page, cannot read the page or the user's files, and cannot
 * clash with other ads.
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

  const srcDoc = useMemo(
    () =>
      hasCode && unit
        ? `<!doctype html><html><head><meta charset="utf-8"><base target="_blank"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>${unit.html}</body></html>`
        : '',
    [hasCode, unit]
  );

  if (!hasCode || !claimed || !unit) return null;
  const fluid = unit.width === 'fluid';
  return (
    <aside className="ad-wrap" aria-label={tr('Advertisement', 'विज्ञापन')}>
      <span className="ad-label">{tr('Advertisement', 'विज्ञापन')}</span>
      <div className="ad-box" style={{ width: fluid ? '100%' : unit.width, maxWidth: '100%', height: unit.height }}>
        <iframe
          title={tr('Advertisement', 'विज्ञापन')}
          srcDoc={srcDoc}
          width={fluid ? '100%' : unit.width}
          height={unit.height}
          loading="lazy"
          scrolling="no"
          style={{ border: 0, maxWidth: '100%', width: fluid ? '100%' : undefined }}
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </aside>
  );
}
