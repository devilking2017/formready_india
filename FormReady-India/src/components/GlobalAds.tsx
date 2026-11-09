import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ADS_ENABLED, POPUNDER_ONCE_PER_SESSION, scriptAdPaths, scriptAds } from '../config/ads';

/** Popunder and Social Bar need the real page (they cannot work inside a sandboxed iframe). */
let injected = false;

function pathAllowed(pathname: string): boolean {
  return scriptAdPaths.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

function safeSrc(src: string): string | null {
  const s = src.trim();
  if (!s) return null;
  if (s.startsWith('//') || s.startsWith('https://')) return s;
  return null; // never load plain http or odd schemes
}

function inject(name: 'popunder' | 'socialBar', src: string) {
  if (document.querySelector(`script[data-fr-ad="${name}"]`)) return;
  const el = document.createElement('script');
  el.async = true;
  el.src = src;
  el.setAttribute('data-cfasync', 'false');
  el.setAttribute('data-fr-ad', name);
  document.body.appendChild(el);
  injected = true;
}

/**
 * Loads Popunder / Social Bar only on the pages listed in scriptAdPaths (guides, About).
 * Because these scripts cannot be fully unloaded, if a visitor moves from such a page to
 * a protected page (Home, tools list, any tool) the page is reloaded once so that no ad
 * script can ever interrupt an upload, a conversion or a download.
 */
export default function GlobalAds() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!ADS_ENABLED) return;
    if (!pathAllowed(pathname)) {
      if (injected) {
        injected = false;
        window.location.reload();
      }
      return;
    }
    const pop = safeSrc(scriptAds.popunder.src);
    const bar = safeSrc(scriptAds.socialBar.src);
    let onceKey = false;
    try {
      onceKey = POPUNDER_ONCE_PER_SESSION && sessionStorage.getItem('fr-popunder') === '1';
    } catch {
      /* storage unavailable: treat as not shown yet */
    }
    if (pop && !onceKey) {
      inject('popunder', pop);
      try {
        sessionStorage.setItem('fr-popunder', '1');
      } catch {
        /* ignore */
      }
    }
    if (bar) inject('socialBar', bar);
  }, [pathname]);

  return null;
}
