import { useEffect, useState } from 'react';
import { FileDown, RotateCcw } from 'lucide-react';
import FileDrop from '../components/FileDrop';
import ResultCard from '../components/ResultCard';
import { useLang } from '../i18n';
import { baseName, formatBytes, MAX_PDF_MB } from '../lib/files';
import { describePdfError, optimizePdfStructure, pageCount, rasterizePdf, readPdfBytes } from '../lib/pdf';

type Mode = 'structure' | 'raster';

interface Out {
  blob: Blob;
  pages: number;
  mode: Mode;
  targetKB: number | null;
  met: boolean;
  settings: string;
}

const LADDER: { dpi: number; q: number }[] = [
  { dpi: 150, q: 0.7 },
  { dpi: 120, q: 0.6 },
  { dpi: 100, q: 0.5 },
  { dpi: 90, q: 0.4 },
  { dpi: 72, q: 0.35 },
  { dpi: 60, q: 0.3 },
];

export default function PdfCompressor() {
  const { tr } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState(0);
  const [mode, setMode] = useState<Mode>('structure');
  const [dpi, setDpi] = useState(120);
  const [quality, setQuality] = useState(0.6);
  const [useTarget, setUseTarget] = useState(false);
  const [kb, setKb] = useState('200');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [out, setOut] = useState<Out | null>(null);

  useEffect(() => () => setOut(null), []);

  const reset = () => {
    setFile(null);
    setPages(0);
    setOut(null);
    setError('');
    setProgress('');
  };

  const onFiles = async (files: File[]) => {
    reset();
    try {
      const n = await pageCount(await readPdfBytes(files[0]));
      setPages(n);
      setFile(files[0]);
    } catch (e) {
      setError(describePdfError(e, tr));
    }
  };

  const verify = async (blob: Blob): Promise<number> => pageCount(new Uint8Array(await blob.arrayBuffer()));

  const run = async () => {
    if (!file) return;
    let targetKB: number | null = null;
    if (mode === 'raster' && useTarget) {
      targetKB = Number(kb);
      if (!Number.isFinite(targetKB) || targetKB < 1) {
        setError(tr('Enter a valid target in KB.', 'KB में सही लक्ष्य भरें।'));
        return;
      }
    }
    setBusy(true);
    setError('');
    setOut(null);
    await new Promise((r) => setTimeout(r, 30));
    try {
      if (mode === 'structure') {
        setProgress(tr('Optimising…', 'ऑप्टिमाइज़ हो रहा है…'));
        const blob = await optimizePdfStructure(file);
        const n = await verify(blob);
        if (n !== pages) throw new Error('page-mismatch');
        setOut({ blob, pages: n, mode, targetKB: null, met: true, settings: tr('Lossless structure optimisation', 'लॉसलेस संरचना ऑप्टिमाइज़ेशन') });
      } else if (targetKB === null) {
        const blob = await rasterizePdf(file, dpi, quality, (d, t) => setProgress(tr(`Page ${d} of ${t}`, `पन्ना ${d}/${t}`)));
        const n = await verify(blob);
        if (n !== pages) throw new Error('page-mismatch');
        setOut({ blob, pages: n, mode, targetKB: null, met: true, settings: `${dpi} dpi, JPEG ${Math.round(quality * 100)}%` });
      } else {
        let best: { blob: Blob; s: string } | null = null;
        for (let i = 0; i < LADDER.length; i++) {
          const L = LADDER[i];
          const blob = await rasterizePdf(file, L.dpi, L.q, (d, t) =>
            setProgress(tr(`Attempt ${i + 1} of ${LADDER.length}: page ${d} of ${t}`, `प्रयास ${i + 1}/${LADDER.length}: पन्ना ${d}/${t}`))
          );
          const s = `${L.dpi} dpi, JPEG ${Math.round(L.q * 100)}%`;
          if (!best || blob.size < best.blob.size) best = { blob, s };
          if (blob.size <= targetKB * 1024) break;
        }
        const final = best!;
        const n = await verify(final.blob);
        if (n !== pages) throw new Error('page-mismatch');
        setOut({ blob: final.blob, pages: n, mode, targetKB, met: final.blob.size <= targetKB * 1024, settings: final.s });
      }
    } catch (e) {
      setError(
        e instanceof Error && e.message === 'page-mismatch'
          ? tr('The result did not pass the page-count check, so it was discarded.', 'परिणाम पेज-संख्या जाँच में विफल रहा, इसलिए हटा दिया गया।')
          : describePdfError(e, tr)
      );
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  const bigger = out && file && out.blob.size >= file.size;

  return (
    <div className="tool">
      {!file ? (
        <FileDrop
          accept="application/pdf"
          allowed={['pdf']}
          maxMB={MAX_PDF_MB}
          label={tr('Tap to choose a PDF', 'PDF चुनने के लिए टैप करें')}
          onFiles={onFiles}
        />
      ) : (
        <>
          <div className="file-head">
            <div>
              <strong>{file.name}</strong>
              <div className="muted small">{formatBytes(file.size)} · {pages} {tr(pages === 1 ? 'page' : 'pages', 'पन्ने')}</div>
            </div>
            <button type="button" className="btn btn-ghost" onClick={reset}><RotateCcw size={18} /> {tr('Reset', 'रीसेट')}</button>
          </div>

          <fieldset className="field">
            <legend>{tr('Mode', 'मोड')}</legend>
            <div className="seg">
              <button type="button" aria-pressed={mode === 'structure'} onClick={() => setMode('structure')}>{tr('Optimise structure', 'संरचना ऑप्टिमाइज़')}</button>
              <button type="button" aria-pressed={mode === 'raster'} onClick={() => setMode('raster')}>{tr('Recompress pages', 'पन्ने रीकंप्रेस')}</button>
            </div>
          </fieldset>

          {mode === 'structure' ? (
            <div className="notice info">
              {tr('Lossless: text and pictures stay exactly as they are. Many PDFs shrink only a little or not at all.', 'लॉसलेस: टेक्स्ट और तस्वीरें जैसी हैं वैसी रहती हैं। कई PDF थोड़ी ही या बिल्कुल नहीं घटतीं।')}
            </div>
          ) : (
            <>
              <div className="notice warn">
                {tr('Every page is redrawn as a JPEG. Text will no longer be selectable and quality drops. Check the result carefully before using it.', 'हर पन्ना JPEG की तरह दोबारा बनाया जाता है। टेक्स्ट चुना नहीं जा सकेगा और क्वालिटी घटेगी। उपयोग से पहले परिणाम ध्यान से जाँचें।')}
              </div>
              <label className="check">
                <input type="checkbox" checked={useTarget} onChange={(e) => setUseTarget(e.target.checked)} />
                <span>{tr('Try to get under a target size', 'लक्षित साइज़ से नीचे लाने का प्रयास करें')}</span>
              </label>
              {useTarget ? (
                <label className="inline">
                  <span>{tr('Target (KB)', 'लक्ष्य (KB)')}</span>
                  <input type="number" inputMode="numeric" min={1} value={kb} onChange={(e) => setKb(e.target.value)} />
                </label>
              ) : (
                <>
                  <label className="field">
                    <span>{tr('Page resolution', 'पन्ने का रिज़ॉल्यूशन')}</span>
                    <select value={dpi} onChange={(e) => setDpi(Number(e.target.value))}>
                      <option value={72}>72 dpi ({tr('smallest', 'सबसे छोटी')})</option>
                      <option value={100}>100 dpi</option>
                      <option value={120}>120 dpi</option>
                      <option value={150}>150 dpi ({tr('clearer', 'अधिक साफ़')})</option>
                      <option value={200}>200 dpi</option>
                    </select>
                  </label>
                  <label className="field">
                    <span>{tr('JPEG quality', 'JPEG क्वालिटी')}: <strong>{Math.round(quality * 100)}%</strong></span>
                    <input type="range" min={0.2} max={0.95} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
                  </label>
                </>
              )}
            </>
          )}

          <button type="button" className="btn btn-primary btn-block" disabled={busy} onClick={run}>
            <FileDown size={20} /> {busy ? progress || tr('Working…', 'काम हो रहा है…') : tr('Compress PDF', 'PDF कंप्रेस करें')}
          </button>
        </>
      )}

      {error && <div className="notice error" role="alert">{error}</div>}

      {out && file && (
        <>
          {out.targetKB !== null && (
            out.met ? (
              <div className="notice ok">{tr(`Verified: the real output is ${formatBytes(out.blob.size)}, under ${out.targetKB} KB.`, `सत्यापित: असली आउटपुट ${formatBytes(out.blob.size)} है, ${out.targetKB} KB से कम।`)}</div>
            ) : (
              <div className="notice warn">{tr(`Target NOT reached. The smallest result we could make is ${formatBytes(out.blob.size)}, above ${out.targetKB} KB. This PDF cannot be reduced that far with this tool.`, `लक्ष्य पूरा नहीं हुआ। हम जो सबसे छोटा परिणाम बना सके वह ${formatBytes(out.blob.size)} है, जो ${out.targetKB} KB से ऊपर है। इस टूल से यह PDF इतनी छोटी नहीं हो सकती।`)}</div>
            )
          )}
          {bigger && (
            <div className="notice warn">{tr('The new file is not smaller than your original. This PDF is already near its minimum for this mode. Keep your original, or try “Recompress pages”.', 'नई फ़ाइल आपकी मूल फ़ाइल से छोटी नहीं है। यह PDF इस मोड के लिए पहले से लगभग न्यूनतम है। मूल फ़ाइल रखें, या “पन्ने रीकंप्रेस” आज़माएँ।')}</div>
          )}
          <ResultCard
            blob={out.blob}
            filename={`${baseName(file.name)}-compressed.pdf`}
            previewUrl={null}
            origBytes={file.size}
            verified={tr(`Checked: the new PDF opens and has ${out.pages} page(s), same as the original. Settings: ${out.settings}.`, `जाँच: नई PDF खुलती है और उसमें ${out.pages} पन्ने हैं, मूल के बराबर। सेटिंग: ${out.settings}।`)}
          />
        </>
      )}
    </div>
  );
}
