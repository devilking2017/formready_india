# FormReady India

Free online document tools (photo, signature and PDF) for Indian online forms. Hindi + English. Web only.
All file processing happens **in the visitor's browser**. Nothing is uploaded.

Stack: React 18, TypeScript, Vite, React Router, pdf-lib, PDF.js (pdfjs-dist), Canvas API, lucide-react.

> **Status of this code:** it was written without being able to run `npm install`, so it has **not been compiled or run in a browser yet**. Run the steps below first and fix any compile message you see before deploying. See "What was and was not tested" at the end.

## 1. Install

Requires Node.js 18+ (20 or 22 recommended).

```bash
cd FormReady-India
npm install
```

## 2. Local development

```bash
npm run dev
```

Open the address Vite prints (usually http://localhost:5173).

## 3. Production build

```bash
npm run build      # generates sitemap/robots, type-checks, then builds to dist/
npm run preview    # serve dist/ locally to check it
```

## 4. Site details

`src/config/site.config.json` already holds the owner name, email, phone, address, Instagram and Facebook links. Edit it any time.
**Set `domain`** to your live address (for example `https://yourname.vercel.app` or your own domain, no trailing slash), then run `npm run build` again so the sitemap, robots.txt and canonical links use it.
If you add a guide or tool, also add its slug to `src/content/slugs.json`.

## 5. Adsterra: where to paste your links and codes

**Everything is in ONE file: `src/config/ads.ts`.** Every field is empty; ads appear only after you paste your own code.

| Adsterra format | Field in `ads.ts` | What to paste |
|---|---|---|
| Banner 728x90 | `adUnits.banner728x90.html` | full embed code |
| Banner 468x60 | `adUnits.banner468x60.html` | full embed code |
| Banner 320x50 | `adUnits.banner320x50.html` | full embed code |
| Banner 300x250 | `adUnits.banner300x250.html` | full embed code |
| Banner 160x600 | `adUnits.banner160x600.html` | full embed code |
| Banner 160x300 | `adUnits.banner160x300.html` | full embed code |
| Native Banner | `adUnits.nativeBanner.html` | full embed code (script + its `<div id="container-...">`) |
| Popunder | `scriptAds.popunder.src` | only the script address from `src="..."` |
| Social Bar | `scriptAds.socialBar.src` | only the script address from `src="..."` |
| Smartlink | `smartlink.url` | your Smartlink URL |

`adPlacements` (same file) decides which unit shows where: top/middle of Home, All Tools page, below every tool, inside guides, footer, and two side rails on wide screens (160x600 and 160x300). Phones get 320x50 or 300x250. The same unit is never shown twice on a page.

**How customer experience is protected**
- Banner and native units run in sandboxed iframes: they cannot redirect the page or read user files.
- On tool pages ads sit **below** the tool box, never beside Upload/Download buttons. Side rails sit next to the text content, not the tool.
- **Popunder and Social Bar load only on guide pages and About** (`scriptAdPaths`). They never load on Home, All Tools or any tool page. If a visitor moves from a guide to a tool page, the page reloads once so those scripts are gone before they upload or download anything.
- Popunder loads at most once per browser session (`POPUNDER_ONCE_PER_SESSION`). Also set frequency capping in your Adsterra dashboard.
- Smartlink appears only as a labelled "Sponsored" text link on Home, All Tools and guides. It is never opened automatically and never attached to a button.
- Set `ADS_ENABLED = false` to switch every ad off.

Adsterra approval, policies and earnings are decided by Adsterra. The Privacy Policy page already mentions these ad formats; update it if you change them.

## 6. Upload to GitHub

```bash
cd FormReady-India
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-user>/<your-repo>.git
git push -u origin main
```

(Create the empty repository on github.com first.)

## 7. Deploy on Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Pick your repository.
3. Build settings:
   - Framework preset: **Vite** (or None)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION` = `20`
4. Deploy. Add your custom domain under the project's **Custom domains** tab, then put the same domain in `site.config.json`.

Notes:
- All routes work after deployment: Cloudflare Pages serves `index.html` for unknown paths when there is no `404.html`, which is what a single-page app needs. No `_redirects` file is used on purpose (a catch-all rule there causes a loop warning). For Vercel, `vercel.json` provides the same rewrite.
- `public/_headers` adds basic security headers. It deliberately does **not** set a Content-Security-Policy, because one must list the exact domains in your verified ad code. Add your own after you have it.
- Because this is a client-side app, each page's title/description/canonical is set by JavaScript at runtime (Google runs JavaScript, but some other crawlers and link previews do not). If link previews matter, consider adding pre-rendering later.

## 7b. Deploy on Vercel (GitHub se)

1. vercel.com → **Add New → Project** → apni GitHub repo import karein.
2. Framework: **Vite**, Build command: `npm run build`, Output directory: `dist` (ye `vercel.json` me pehle se set hai).
3. Deploy karein. `vercel.json` ka rewrite rule har URL (jaise `/image-compressor`) ko `index.html` par bhejta hai, warna direct open/refresh par Vercel "404 page does not exist" dikhata hai.

## Project structure

```
FormReady-India/
├── index.html
├── package.json, tsconfig.json, vite.config.ts
├── scripts/generate-seo.mjs        # writes public/sitemap.xml + robots.txt
├── public/                         # favicon.svg, _headers, sitemap.xml, robots.txt
└── src/
    ├── main.tsx, App.tsx, i18n.tsx, styles.css
    ├── config/                     # site.config.json, site.ts, ads.ts
    ├── content/                    # tools.ts, guides.ts (EN + HI text), slugs.json
    ├── components/                 # Header, Footer, AdSlot, Seo, FileDrop, ResultCard, ToolCard, Logo
    ├── lib/                        # files.ts (validation), image.ts (canvas + target-size search), pdf.ts, hooks.ts
    ├── pages/                      # Home, AllTools, ToolPage, Guides, Static (About, Contact, legal)
    └── tools/                      # ImageCompressor, ResizeTool (photo + signature), PdfCompressor, JpgToPdf, PdfMerger
```

## How the tools work (and their honest limits)

- **Validation:** files are identified by their first bytes (not the file name), size-limited (25 MB images, 50 MB PDFs), and unreadable or password-protected PDFs get a clear message.
- **Image Compressor:** re-encodes with the Canvas API. For a target size it binary-searches JPEG/WebP quality and, if allowed, reduces pixels stepwise. The reported size is the real size of the produced file, and the output is decoded again to verify it opens. If the target is not reached, it says so. JPEG fills transparency with white.
- **Photo / Signature Resizer:** exact pixel size, lock ratio, fit / crop / stretch, optional KB limit using quality only (dimensions never change silently). PNG keeps transparency; PNG cannot reach small KB limits by quality.
- **PDF Compressor:** (a) lossless structure optimisation via pdf-lib; (b) page recompression via PDF.js → JPEG → new PDF (text becomes non-selectable). Both are checked for page count; no size is promised.
- **JPG to PDF / PDF Merger:** pdf-lib; the result is re-opened and its page count is verified.
- Presets are **editable examples**, not official requirements.

## What was and was not tested

Tested in the build session (no network, no browser):
- `scripts/generate-seo.mjs` runs and writes a valid sitemap (18 URLs) and robots.txt.
- JSON config files parse; tool and guide slugs match `slugs.json`; related-tool and related-guide references resolve.
- `src/lib/image.ts` and `src/lib/files.ts` pass a strict TypeScript check.

**Not tested** (needs `npm install` and a browser, so please do these yourself): the full `npm run build`, type-checking of the React files, running every tool with valid and invalid files, output sizes/dimensions, PDF merge and JPG-to-PDF output, mobile layout, Hindi/English switching, every route, file downloads, and verifying in the network tab that no file leaves the browser.
