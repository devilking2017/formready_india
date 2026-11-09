/**
 * ADSTERRA / AD CONFIGURATION  (the ONLY file you need to edit for ads)
 *
 * Everything is EMPTY by default. An ad shows (or an ad script loads) only when you
 * paste your own verified code/link from the Adsterra dashboard into the matching
 * field below. Nothing is invented here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * 1) BANNER / NATIVE UNITS   -> `adUnits`
 *    Paste the FULL embed code Adsterra gives you (the <script>… and, for native,
 *    the <div id="container-…"> too) into `html` of the matching size.
 *    Formats: 728x90, 468x60, 320x50, 300x250, 160x600, 160x300 and Native Banner.
 *
 * 2) WHERE EACH UNIT SHOWS   -> `adPlacements`
 *    Maps each place on the site (home, tools page, tool page, guides, footer, side
 *    rails) to a desktop unit and a mobile unit. Edit freely. The same unit is never
 *    shown twice on one page, so no duplicate scripts are loaded.
 *
 * 3) POPUNDER + SOCIAL BAR   -> `scriptAds`
 *    Paste only the script address (the value of src="…") into `src`.
 *    For customer comfort they load ONLY on the pages listed in `scriptAdPaths`
 *    (guides and About). They never load on the Home page, the tools list or any
 *    tool page, so uploads and downloads are never interrupted.
 *
 * 4) SMARTLINK               -> `smartlink`
 *    Paste your Smartlink URL. It is shown only as a clearly labelled "Sponsored"
 *    link on content pages. It is never opened automatically and never attached to
 *    a Download / Upload button.
 * ─────────────────────────────────────────────────────────────────────────────
 * Tip: also set frequency capping for Popunder / Social Bar in the Adsterra
 * dashboard (for example 1 per visitor per 24 hours) to keep visitors comfortable.
 * Adsterra approval and earnings are decided by Adsterra, not by this project.
 */

/** Master switch. Set to false to turn every ad off at once. */
export const ADS_ENABLED = true;

// ───────────────────────── 1) Banner & native units ─────────────────────────

export type UnitKey =
  | 'banner728x90'
  | 'banner468x60'
  | 'banner320x50'
  | 'banner300x250'
  | 'banner160x600'
  | 'banner160x300'
  | 'nativeBanner';

export interface AdUnit {
  /** px, or 'fluid' to use the full available width. */
  width: number | 'fluid';
  height: number;
  /** Full embed code from Adsterra. Empty = unit is off. */
  html: string;
}

export const adUnits: Record<UnitKey, AdUnit> = {
  banner728x90: { width: 728, height: 90, html: `
<script>
  atOptions = {
    'key' : 'f0e81d2ac3f13ddeddb5a83ff2d009db',
    'format' : 'iframe',
    'height' : 90,
    'width' : 728,
    'params' : {}
  };
</script>
<script src="https://bauval.org/22/f0e81d2ac3f13ddeddb5a83ff2d009db"></script>
` }, // PASTE Banner 728x90 code
  banner468x60: { width: 468, height: 60, html: `
<script>
  atOptions = {
    'key' : '2b20112380dd010830385eb9ef71c381',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/2b20112380dd010830385eb9ef71c381/invoke.js"></script>
` }, // PASTE Banner 468x60 code
  banner320x50: { width: 320, height: 50, html: `
<script>
  atOptions = {
    'key' : '9b8c9c04525b30c445cc7844d2ba31f6',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/9b8c9c04525b30c445cc7844d2ba31f6/invoke.js"></script>
` }, // PASTE Banner 320x50 code
  banner300x250: { width: 300, height: 250, html: `
<script>
  atOptions = {
    'key' : '7ba9432df4096230433894b014e49a9e',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highrevenueformat.com/7ba9432df4096230433894b014e49a9e/invoke.js"></script>
` }, // PASTE Banner 300x250 code
  banner160x600: { width: 160, height: 600, html: `
<script>
  atOptions = {
    'key' : 'd545a72d5239a7636babf24659a4fefa',
    'format' : 'iframe',
    'height' : 600,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://bauval.org/22/d545a72d5239a7636babf24659a4fefa"></script>
` }, // PASTE Banner 160x600 code
  banner160x300: { width: 160, height: 300, html: `
<script>
  atOptions = {
    'key' : 'c0525affd153d2662c23759a4bc6cdea',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://bauval.org/22/c0525affd153d2662c23759a4bc6cdea"></script>
` }, // PASTE Banner 160x300 code
  // Native Banner: paste the script AND its container <div> exactly as given.
  nativeBanner: { width: 'fluid', height: 280, html: `
<script async="async" data-cfasync="false" src="https://pl32272559.profitableratecpmnetwork.com/c31dabe1511d0f872bf43feff2c4c093/invoke.js"></script>
<div id="container-c31dabe1511d0f872bf43feff2c4c093"></div>
` }, // PASTE Native Banner code
};

// ───────────────────────── 2) Placements ─────────────────────────

export type AdSlotId =
  | 'homeBanner'
  | 'homeContent'
  | 'toolsPage'
  | 'toolPage'
  | 'blogInContent'
  | 'footerBanner'
  | 'sideTall'
  | 'sideMedium';

export interface Placement {
  /** Unit used when the screen is at least `minWidth` px wide. */
  desktop: UnitKey;
  /** Unit used on smaller screens. null = nothing on phones. */
  mobile: UnitKey | null;
  /** Screen width (px) where `desktop` starts. Default 768. */
  minWidth?: number;
}

export const adPlacements: Record<AdSlotId, Placement> = {
  homeBanner: { desktop: 'banner728x90', mobile: 'banner320x50' }, // top of Home
  homeContent: { desktop: 'nativeBanner', mobile: 'banner300x250' }, // middle of Home
  toolsPage: { desktop: 'banner300x250', mobile: 'banner300x250' }, // All Tools page
  toolPage: { desktop: 'banner728x90', mobile: 'banner300x250' }, // below each tool box
  blogInContent: { desktop: 'nativeBanner', mobile: 'banner300x250' }, // inside guides
  footerBanner: { desktop: 'banner468x60', mobile: 'banner320x50' }, // every page footer
  sideTall: { desktop: 'banner160x600', mobile: null, minWidth: 1180 }, // right rail (wide screens)
  sideMedium: { desktop: 'banner160x300', mobile: null, minWidth: 1180 }, // right rail (wide screens)
};

// ───────────────────────── 3) Popunder & Social Bar ─────────────────────────

export interface ScriptAd {
  /** Script address only, e.g. "//pl12345678.example.com/ab/cd/ef/abcdef.js". Empty = off. */
  src: string;
}

export const scriptAds: { popunder: ScriptAd; socialBar: ScriptAd } = {
  popunder: { src: 'https://pl32272558.profitableratecpmnetwork.com/cc/7b/85/cc7b85df5621377549a9621686226b6d.js' }, // PASTE Popunder script address
  socialBar: { src: 'https://pl32272561.profitableratecpmnetwork.com/31/64/8a/31648a31b92e920904fec171952bef70.js' }, // PASTE Social Bar script address
};

/**
 * Popunder and Social Bar load ONLY on pages whose address starts with one of these.
 * Home, All Tools and every tool page are deliberately NOT listed.
 */
export const scriptAdPaths: string[] = ['/guides', '/about'];

/** If true, the popunder script is loaded at most once per browser session. */
export const POPUNDER_ONCE_PER_SESSION = true;

// ───────────────────────── 4) Smartlink ─────────────────────────

export const smartlink = {
  /** PASTE your Smartlink URL. Empty = off. */
  url: 'https://www.profitableratecpmnetwork.com/r3rxu7fxu?key=e9636b5010f81ac36ac8bdc788ff3e88',
  /** Link text shown to visitors (clearly labelled Sponsored). */
  textEn: 'Sponsored: see a recommended offer',
  textHi: 'प्रायोजित: एक सुझाया गया ऑफ़र देखें',
};
