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

## 4. Edit your site details

`src/config/site.config.json`:

| Field | What to put |
|---|---|
| `domain` | Your live address, e.g. `https://formready.example` (no trailing slash). Used for canonical URLs and the sitemap. Leave empty only while testing. |
| `ownerName`, `contactEmail`, `contactPhone`, `address` | Your real details. Empty values show a clear "to be added" placeholder. Nothing is invented. |
| `social.*` | Full URLs of your pages. Empty ones are hidden. |

After changing `domain`, run `npm run build` again (it regenerates `public/sitemap.xml` and `public/robots.txt`).

If you add a guide or a tool, also add its slug to `src/content/slugs.json` so it appears in the sitemap.

## 5. Where to put the real Adsterra code

Everything is in **`src/config/ads.ts`**. Ads are **off** and **empty** by default: no ad space is shown and no ad script loads.

1. Create your Adsterra account, add your site and wait for Adsterra's approval. This project cannot promise or influence approval.
2. In the Adsterra dashboard, create an ad unit for a place on this site (for example a Banner).
3. Copy the **complete embed code** Adsterra gives you.
4. In `ads.ts`, paste it as the `html` value of the matching slot (use backticks), set `enabled: true`, and set `width`/`height` to that unit's size.
5. Set `ADS_GLOBAL_ENABLED = true`.
6. Rebuild and redeploy.

Slots: `homeBanner`, `homeContent`, `toolsPage`, `toolPage`, `blogInContent`, `footerBanner`.

How it is kept safe (`src/components/AdSlot.tsx`):
- each slot renders in its own **sandboxed iframe**, so scripts of different slots cannot clash and a script is never loaded twice by the page;
- the sandbox does not allow the ad to navigate the main page, so no forced redirects;
- ads sit **below** the tool card on tool pages, never next to upload or download buttons.

Please choose only banner-type formats. Pop-under, social-bar or other overlay formats would break the "no intrusive ads" design of this site and Adsterra's policies may change over time, so follow the current rules in your dashboard.
Also update the Privacy Policy text (`src/pages/Static.tsx`) to match what you actually enable.

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
- All routes work after deployment: Cloudflare Pages serves `index.html` for unknown paths when there is no `404.html`, which is what a single-page app needs. No `_redirects` file is used on purpose (a catch-all rule there causes a loop warning).
- `public/_headers` adds basic security headers. It deliberately does **not** set a Content-Security-Policy, because one must list the exact domains in your verified ad code. Add your own after you have it.
- Because this is a client-side app, each page's title/description/canonical is set by JavaScript at runtime (Google runs JavaScript, but some other crawlers and link previews do not). If link previews matter, consider adding pre-rendering later.

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
