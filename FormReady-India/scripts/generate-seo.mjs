// Generates public/sitemap.xml and public/robots.txt from src/config/site.config.json
// and src/content/slugs.json. Runs automatically before `npm run build`.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const site = JSON.parse(readFileSync(resolve(root, 'src/config/site.config.json'), 'utf8'));
const slugs = JSON.parse(readFileSync(resolve(root, 'src/content/slugs.json'), 'utf8'));

let domain = String(site.domain || '').trim().replace(/\/+$/, '');
if (!domain) {
  domain = 'https://YOUR-DOMAIN.example';
  console.warn(
    '[seo] WARNING: "domain" is empty in src/config/site.config.json. ' +
      'sitemap.xml uses a placeholder. Set your real domain and rebuild before going live.'
  );
}

const paths = [
  ...slugs.pages.map((p) => (p ? `/${p}` : '/')),
  ...slugs.tools.map((s) => `/${s}`),
  ...slugs.guides.map((s) => `/guides/${s}`),
];

const lastmod = site.lastUpdated || new Date().toISOString().slice(0, 10);
const urls = paths
  .map((p) => `  <url>\n    <loc>${domain}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
const robots = `User-agent: *\nAllow: /\n\nSitemap: ${domain}/sitemap.xml\n`;

mkdirSync(resolve(root, 'public'), { recursive: true });
writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap);
writeFileSync(resolve(root, 'public/robots.txt'), robots);
console.log(`[seo] wrote sitemap.xml (${paths.length} URLs) and robots.txt for ${domain}`);
