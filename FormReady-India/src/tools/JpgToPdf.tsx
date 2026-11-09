import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, FileImage, RotateCcw, Trash2 } from 'lucide-react';
import FileDrop from '../components/FileDrop';
import ResultCard from '../components/ResultCard';
import { useLang } from '../i18n';
import { useObjectUrl } from '../lib/hooks';
import { formatBytes, MAX_IMAGE_MB, nextId } from '../lib/files';
import { describePdfError, imagesToPdf, pageCount, type ImgToPdfOptions } from '../lib/pdf';

interface Item {
  id: string;
  file: File;
}

function Thumb({ file, alt }: { file: File; alt: string }) {
  const url = useObjectUrl(file);
  return url ? <img className="thumb" src={url} alt={alt} loading="lazy" /> : <div className="thumb" />;
}

export default function JpgToPdf() {
  const { tr } = useLang();
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState<ImgToPdfOptions['page']>('a4');
  const [orientation, setOrientation] = useState<ImgToPdfOptions['orientation']>('portrait');
  const [margin, setMargin] = useState('10');
  const [cw, setCw] = useState('210');
  const [ch, setCh] = useState('297');
  const [quality, setQuality] = useState(0.85);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [out, setOut] = useState<{ blob: Blob; pages: number } | null>(null);
  const outUrl = useObjectUrl(out?.blob ?? null);

  useEffect(() => () => setOut(null), []);

  const reset = () => {
    setItems([]);
    setOut(null);
    setError('');
  };

  const add = (files: File[]) => {
    setOut(null);
    setItems((cur) => [...cur, ...files.map((f) => ({ id: nextId(), file: f }))]);
  };

  const move = (i: number, d: -1 | 1) => {
    setOut(null);
    setItems((cur) => {
      const j = i + d;
      if (j < 0 || j >= cur.length) return cur;
      const c = [...cur];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });
  };

  const remove = (id: string) => {
    setOut(null);
    setItems((cur) => cur.filter((x) => x.id !== id));
  };

  const run = async () => {
    if (items.length === 0) return;
    const m = Number(margin);
    const wmm = Number(cw);
    const hmm = Number(ch);
    if (!Number.isFinite(m) || m < 0 || m > 100) {
      setError(tr('Margin must be between 0 and 100 mm.', 'मार्जिन 0 से 100 mm के बीच होना चाहिए।'));
      return;
    }
    if (page === 'custom' && !(wmm >= 20 && hmm >= 20 && wmm <= 2000 && hmm <= 2000)) {
      setError(tr('Custom page width and height must be between 20 and 2000 mm.', 'कस्टम पेज की चौड़ाई-ऊँचाई 20 से 2000 mm के बीच होनी चाहिए।'));
      return;
    }
    const pw = page === 'a4' ? 210 : page === 'letter' ? 215.9 : wmm;
    const ph = page === 'a4' ? 297 : page === 'letter' ? 279.4 : hmm;
    if (m * 2 >= Math.min(pw, ph) - 10) {
      setError(tr('The margin is too large for this page size.', 'इस पेज साइज़ के लिए मार्जिन बहुत बड़ा है।'));
      return;
    }
    setBusy(true);
    setError('');
    setOut(null);
    await new Promise((r) => setTimeout(r, 30));
    try {
      const blob = await imagesToPdf(items.map((x) => x.file), {
        page,
        customWmm: wmm,
        customHmm: hmm,
        orientation,
        marginMm: m,
        quality,
      });
      const n = await pageCount(new Uint8Array(await blob.arrayBuffer()));
      if (n !== items.length) throw new Error('page-mismatch');
      setOut({ blob, pages: n });
    } catch (e) {
      setError(
        e instanceof Error && e.message === 'page-mismatch'
          ? tr('The PDF failed the page-count check, so it was discarded.', 'PDF पेज-संख्या जाँच में विफल रही, इसलिए हटा दी गई।')
          : e instanceof Error && e.name === 'InvalidStateError'
            ? tr('One of the images could not be read.', 'किसी एक इमेज को पढ़ा नहीं जा सका।')
            : describePdfError(e, tr)
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool">
      <FileDrop
        accept="image/jpeg,image/png,image/webp"
        allowed={['jpeg', 'png', 'webp']}
        maxMB={MAX_IMAGE_MB}
        multiple
        label={items.length ? tr('Add more images', 'और इमेज जोड़ें') : tr('Tap to choose images (JPG, PNG, WebP)', 'इमेज चुनने के लिए टैप करें (JPG, PNG, WebP)')}
        onFiles={add}
      />

      {items.length > 0 && (
        <>
          <div className="file-head">
            <strong>{tr(`${items.length} image(s) – page order`, `${items.length} इमेज – पेज क्रम`)}</strong>
            <button type="button" className="btn btn-ghost" onClick={reset}><RotateCcw size={18} /> {tr('Clear all', 'सब हटाएँ')}</button>
          </div>
          <ol className="list">
            {items.map((it, i) => (
              <li key={it.id} className="list-item">
                <span className="num">{i + 1}</span>
                <Thumb file={it.file} alt={tr(`Page ${i + 1} preview`, `पन्ना ${i + 1} प्रीव्यू`)} />
                <div className="grow">
                  <div className="name">{it.file.name}</div>
                  <div className="muted small">{formatBytes(it.file.size)}</div>
                </div>
                <div className="actions">
                  <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label={tr('Move up', 'ऊपर ले जाएँ')}><ArrowUp size={20} /></button>
                  <button type="button" className="icon-btn" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={tr('Move down', 'नीचे ले जाएँ')}><ArrowDown size={20} /></button>
                  <button type="button" className="icon-btn danger" onClick={() => remove(it.id)} aria-label={tr('Remove', 'हटाएँ')}><Trash2 size={20} /></button>
                </div>
              </li>
            ))}
          </ol>

          <div className="grid-2">
            <label className="field">
              <span>{tr('Page size', 'पेज साइज़')}</span>
              <select value={page} onChange={(e) => setPage(e.target.value as ImgToPdfOptions['page'])}>
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">Letter (8.5 × 11 in)</option>
                <option value="custom">{tr('Custom', 'कस्टम')}</option>
              </select>
            </label>
            <label className="field">
              <span>{tr('Orientation', 'ओरिएंटेशन')}</span>
              <select value={orientation} onChange={(e) => setOrientation(e.target.value as ImgToPdfOptions['orientation'])}>
                <option value="portrait">{tr('Portrait', 'पोर्ट्रेट')}</option>
                <option value="landscape">{tr('Landscape', 'लैंडस्केप')}</option>
                <option value="auto">{tr('Match each image', 'हर इमेज के अनुसार')}</option>
              </select>
            </label>
          </div>
          {page === 'custom' && (
            <div className="grid-2">
              <label className="field">
                <span>{tr('Width (mm)', 'चौड़ाई (mm)')}</span>
                <input type="number" inputMode="decimal" min={20} value={cw} onChange={(e) => setCw(e.target.value)} />
              </label>
              <label className="field">
                <span>{tr('Height (mm)', 'ऊँचाई (mm)')}</span>
                <input type="number" inputMode="decimal" min={20} value={ch} onChange={(e) => setCh(e.target.value)} />
              </label>
            </div>
          )}
          <div className="grid-2">
            <label className="field">
              <span>{tr('Margin (mm)', 'मार्जिन (mm)')}</span>
              <input type="number" inputMode="decimal" min={0} max={100} value={margin} onChange={(e) => setMargin(e.target.value)} />
            </label>
            <label className="field">
              <span>{tr('Image quality', 'इमेज क्वालिटी')}: <strong>{Math.round(quality * 100)}%</strong></span>
              <input type="range" min={0.3} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
            </label>
          </div>

          <button type="button" className="btn btn-primary btn-block" disabled={busy} onClick={run}>
            <FileImage size={20} /> {busy ? tr('Creating PDF…', 'PDF बन रही है…') : tr('Create PDF', 'PDF बनाएँ')}
          </button>
        </>
      )}

      {error && <div className="notice error" role="alert">{error}</div>}

      {out && (
        <ResultCard
          blob={out.blob}
          filename="images.pdf"
          previewUrl={null}
          verified={tr(`Checked: the PDF opens and has ${out.pages} page(s), one per image.`, `जाँच: PDF खुलती है और उसमें ${out.pages} पन्ने हैं, हर इमेज का एक।`)}
        >
          {outUrl && (
            <>
              <iframe className="pdf-frame" src={outUrl} title={tr('PDF preview', 'PDF प्रीव्यू')} />
              <p className="small muted">
                {tr('If the preview is blank on your phone, open it in a new tab: ', 'यदि फोन पर प्रीव्यू खाली दिखे, तो नए टैब में खोलें: ')}
                <a href={outUrl} target="_blank" rel="noopener noreferrer">{tr('open PDF', 'PDF खोलें')}</a>
              </p>
            </>
          )}
        </ResultCard>
      )}
    </div>
  );
}
