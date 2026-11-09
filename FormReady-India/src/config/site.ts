import cfg from './site.config.json';

export interface SiteConfig {
  siteName: string;
  tagline: string;
  /** e.g. "https://formready.example" (no trailing slash). Empty = use the current origin. */
  domain: string;
  ownerName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  social: Record<string, string>;
  lastUpdated: string;
}

export const site = cfg as SiteConfig;

export function siteOrigin(): string {
  const d = site.domain.trim().replace(/\/+$/, '');
  if (d) return d;
  return typeof window !== 'undefined' ? window.location.origin : '';
}

/** "+91 78198 75058" -> "tel:+9178198 75058" without spaces, safe for tel: links. */
export function telHref(phone: string): string {
  return 'tel:' + phone.replace(/[^\d+]/g, '');
}
