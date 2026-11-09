/**
 * ADSTERRA / AD CONFIGURATION  (single place to edit)
 *
 * Nothing here is a real ad. All slots are OFF and EMPTY on purpose, so no ad
 * space is shown and no third-party script is loaded until YOU paste verified
 * code from your own Adsterra dashboard.
 *
 * How to enable a slot:
 *   1. Sign up / log in at Adsterra and add your website. Wait for approval
 *      (approval is decided by Adsterra, not by this project).
 *   2. Create an ad unit (for example a Banner) in the Adsterra dashboard.
 *   3. Copy the full embed code Adsterra gives you for that unit.
 *   4. Paste it as the `html` string of the matching slot below
 *      (use a JS template string with backticks, and keep the code exactly as given).
 *   5. Set that slot's `enabled` to true, and set `width`/`height` to the unit size
 *      shown in the Adsterra dashboard (this reserves the space and avoids layout shift).
 *   6. Set ADS_GLOBAL_ENABLED to true.
 *
 * Each slot renders inside its own sandboxed iframe (see components/AdSlot.tsx):
 *   - scripts from one slot cannot clash with another slot (no duplicate-global problems),
 *   - the ad cannot navigate the top page (no forced redirects),
 *   - nothing is rendered until you enable it.
 * Use only the ad formats you are comfortable showing next to a file tool.
 * Avoid pop-under / popunder / social-bar-style formats that open windows or overlay the page,
 * because they would conflict with the "no intrusive ads" rules of this site.
 */

export type AdSlotId =
  | 'homeBanner'
  | 'homeContent'
  | 'toolsPage'
  | 'toolPage'
  | 'blogInContent'
  | 'footerBanner';

export interface AdSlotConfig {
  enabled: boolean;
  /** Ad unit size in px, from the Adsterra dashboard. */
  width: number;
  height: number;
  /** Verified embed HTML pasted from Adsterra. Leave empty until you have it. */
  html: string;
}

export const ADS_GLOBAL_ENABLED = false;

export const adSlots: Record<AdSlotId, AdSlotConfig> = {
  homeBanner: { enabled: false, width: 728, height: 90, html: '' },
  homeContent: { enabled: false, width: 300, height: 250, html: '' },
  toolsPage: { enabled: false, width: 300, height: 250, html: '' },
  toolPage: { enabled: false, width: 300, height: 250, html: '' },
  blogInContent: { enabled: false, width: 300, height: 250, html: '' },
  footerBanner: { enabled: false, width: 728, height: 90, html: '' },
};
