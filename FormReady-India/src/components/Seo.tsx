import { useEffect } from 'react';
import { siteOrigin, site } from '../config/site';
import { useLang } from '../i18n';

interface Props {
  title: string;
  description: string;
  /** Path such as "/pdf-merger". Use "/" for home. */
  path: string;
  jsonLd?: object;
}

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export default function Seo({ title, description, path, jsonLd }: Props) {
  const { lang } = useLang();
  useEffect(() => {
    const full = path === '/' ? title : `${title} | ${site.siteName}`;
    const url = siteOrigin() + path;
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', site.siteName);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:locale', lang === 'hi' ? 'hi_IN' : 'en_IN');
    setMeta('name', 'twitter:card', 'summary');
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'ld-json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
    return () => {
      script?.remove();
    };
  }, [title, description, path, jsonLd, lang]);
  return null;
}
