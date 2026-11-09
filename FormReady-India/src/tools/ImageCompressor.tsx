import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Zap } from 'lucide-react';
import FileDrop from '../components/FileDrop';
import ResultCard from '../components/ResultCard';
import { useLang } from '../i18n';
import { useObjectUrl } from '../lib/hooks';
import { baseName, formatBytes, MAX_IMAGE_MB } from '../lib/files';
import {
  EXT, describeImageError, encodeToTarget, flatten, hasAlpha, loadBitmap, render, toBlob, verifyImage,
  type EncodeResult, type OutFmt,
} from '../lib/image';

type FmtChoice = 'auto' | OutFmt;

interface Info {
  w: number;
  h: number;
  alpha: boolean;
}

interface Out extends EncodeResult {
  type: OutFmt;
  verified: string;
  targetKB: number | null;
  note: string;
}

export default function ImageCompressor() {
  const { tr } = useLang();
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const bmp = useRef<ImageBitmap | null>(null);
  const [mode, setMode] = useState<'target' | 'quality'>('target');
  const [preset, setPreset] = useState<number | 'custom'>(100);
  const [custom, setCustom] = useState('150');
  const [quality, setQuality] = useState(0.7);
  const [fmt, setFmt] = useState<FmtChoice>('auto');
  const [shrink, setShrink] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [out, setOut] = useState<Out | null>(null);

  const origUrl = useObjectUrl(file);
  const outUrl = useObjectUrl(out?.blob ?? null);

  useEffect(() => () => bmp.current?.close(), []);

  const reset = () => {
    bmp.current?.close();
    bmp.current = null;
    setFile(null);
    setInfo(null);
    setOut(null);
    setError('');
  };

  const onFiles = async (files: File[]) => {
    reset();
    const f = files[0];
    try {
      const b = await loadBitmap(f);
      bmp.current = b;
      setInfo({ w: b.width, h: b.height, alpha: hasAlpha(b) });
      setFile(f);
    } catch {
      setError(tr('This image could not be opened. It may be damaged.', 'यह इमेज खुल नहीं सकी। फ़ाइल खराब हो सकती है।'));
    }
  };

  const run = async () => {
    if (!file || !bmp.current || !info) return;
    setBusy(true);
    setError('');
    setOut(null);
    await new Promise((r) => setTimeout(r, 30));
    try {
      const type: OutFmt = fmt === 'auto' ? (info.alpha ? 'image/webp' : 'image/jpeg') : fmt;
      const needsWhite = type === 'image/jpeg';
      const base = render(bmp.current, info.w, info.h, 'stretch', needsWhite ? '#ffffff' : null);
      const src = needsWhite ? flatten(base, '#ffffff') : base;
      let res: EncodeResult;
      let targetKB: number | null = null;
      if (mode === 'target') {
        const kb = preset === 'custom' ? Number(custom) : preset;
        if (!Number.isFinite(kb) || kb < 1 || kb > 100000) {
          setError(tr('Enter a custom size between 1 and 100000 KB.', '1 से 100000 KB के बीच कस्टम साइज़ भरें।'));
          setBusy(false);
          return;
        }
        targetKB = kb;
        res = await encodeToTarget(src, type, kb * 1024, shrink);
      } else {
        const blob = await toBlob(src, type, type === 'image/png' ? undefined : quality);
        res = { blob, width: src.width, height: src.height, quality: type === 'image/png' ? null : quality, met: true };
      }
      const v = await verifyImage(res.blob);
      const okDims = v.width === res.width && v.height === res.height;
      const notes: string[] = [];
      if (info.alpha && needsWhite)
        notes.push(tr('Transparent areas were filled with white because JPEG has no transparency.', 'JPEG में पारदर्शिता नहीं होती, इसलिए पारदर्शी हिस्से सफ़ेद भरे गए।'));
      if (res.width !== info.w || res.height !== info.h)
        notes.push(tr(`Pixel size was reduced from ${info.w}×${info.h} to ${res.width}×${res.height} to reach the target.`, `लक्ष्य तक पहुँचने के लिए पिक्सेल साइज़ ${info.w}×${info.h} से घटाकर ${res.width}×${res.height} की गई।`));
      if (type === 'image/png' && mode === 'quality')
        notes.push(tr('PNG is lossless, so the quality slider does not apply.', 'PNG लॉसलेस है, इसलिए क्वालिटी स्लाइडर लागू नहीं होता।'));
      setOut({
        ...res,
        type,
        targetKB,
        note: notes.join(' '),
        verified: okDims
          ? tr(`Checked: the output file opens correctly and measures ${v.width}×${v.height} px.`, `जाँच: आउटपुट फ़ाइल सही खुलती है और ${v.width}×${v.height} px की है।`)
          : tr('Output decoded, but its size differs from expectation.', 'आउटपुट खुला, पर उसका आकार अपेक्षा से अलग है।'),
      });
    } catch (e) {
      setError(describeImageError(e, tr));
    } finally {
      setBusy(false);
    }
  };

  const presets = [20, 50, 100, 200];

  return (
    <div className="tool">
      {!file ? (
        <FileDrop
          accept="image/jpeg,image/png,image/webp"
          allowed={['jpeg', 'png', 'webp']}
          maxMB={MAX_IMAGE_MB}
          label={tr('Tap to choose an image (JPG, PNG, WebP)', 'इमेज चुनने के लिए टैप करें (JPG, PNG, WebP)')}
          onFiles={onFiles}
        />
      ) : (
        <>
          <div className="file-head">
            <div>
              <strong>{file.name}</strong>
              <div className="muted small">
                {formatBytes(file.size)} · {info?.w}×{info?.h} px{info?.alpha ? ' · ' + tr('has transparency', 'पारदर्शिता है') : ''}
              </div>
            </div>
            <button type="button" className="btn btn-ghost" onClick={reset}>
              <RotateCcw size={18} /> {tr('Reset', 'रीसेट')}
            </button>
          </div>
          {origUrl && <img className="preview" src={origUrl} alt={tr('Preview of your original image', 'आपकी मूल इमेज का प्रीव्यू')} />}

          <fieldset className="field">
            <legend>{tr('How should we compress?', 'कैसे कंप्रेस करें?')}</legend>
            <div className="seg">
              <button type="button" aria-pressed={mode === 'target'} onClick={() => setMode('target')}>{tr('Target size', 'लक्षित साइज़')}</button>
              <button type="button" aria-pressed={mode === 'quality'} onClick={() => setMode('quality')}>{tr('Quality slider', 'क्वालिटी स्लाइडर')}</button>
            </div>
          </fieldset>

          {mode === 'target' ? (
            <fieldset className="field">
              <legend>{tr('Target file size', 'लक्षित फ़ाइल साइज़')}</legend>
              <div className="chips">
                {presets.map((p) => (
                  <button key={p} type="button" className="chip" aria-pressed={preset === p} onClick={() => setPreset(p)}>{p} KB</button>
                ))}
                <button type="button" className="chip" aria-pressed={preset === 'custom'} onClick={() => setPreset('custom')}>{tr('Custom', 'कस्टम')}</button>
              </div>
              {preset === 'custom' && (
                <label className="inline">
                  <span>{tr('Custom size (KB)', 'कस्टम साइज़ (KB)')}</span>
                  <input type="number" inputMode="numeric" min={1} value={custom} onChange={(e) => setCustom(e.target.value)} />
                </label>
              )}
              <label className="check">
                <input type="checkbox" checked={shrink} onChange={(e) => setShrink(e.target.checked)} />
                <span>{tr('Allow reducing pixel size if quality alone cannot reach the target', 'यदि केवल क्वालिटी से लक्ष्य न मिले तो पिक्सेल साइज़ घटाने दें')}</span>
              </label>
            </fieldset>
          ) : (
            <label className="field">
              <span>{tr('Quality', 'क्वालिटी')}: <strong>{Math.round(quality * 100)}%</strong></span>
              <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
            </label>
          )}

          <label className="field">
            <span>{tr('Output format', 'आउटपुट फ़ॉर्मैट')}</span>
            <select value={fmt} onChange={(e) => setFmt(e.target.value as FmtChoice)}>
              <option value="auto">{tr('Automatic (JPEG, or WebP if transparent)', 'स्वचालित (JPEG, पारदर्शी हो तो WebP)')}</option>
              <option value="image/jpeg">JPEG (.jpg)</option>
              <option value="image/png">PNG</option>
              <option value="image/webp">WebP</option>
            </select>
          </label>

          <button type="button" className="btn btn-primary btn-block" disabled={busy} onClick={run}>
            <Zap size={20} /> {busy ? tr('Compressing…', 'कंप्रेस हो रहा है…') : tr('Compress image', 'इमेज कंप्रेस करें')}
          </button>
        </>
      )}

      {error && <div className="notice error" role="alert">{error}</div>}

      {out && file && (
        <>
          {out.targetKB !== null && (
            out.met ? (
              <div className="notice ok">{tr(`Target reached: the real output is ${formatBytes(out.blob.size)}, within ${out.targetKB} KB.`, `लक्ष्य पूरा: असली आउटपुट ${formatBytes(out.blob.size)} है, ${out.targetKB} KB के भीतर।`)}</div>
            ) : (
              <div className="notice warn">{tr(`Target NOT reached. The smallest result possible with these settings is ${formatBytes(out.blob.size)}, above ${out.targetKB} KB. Try JPEG, allow pixel reduction, or pick a larger target.`, `लक्ष्य पूरा नहीं हुआ। इन सेटिंग के साथ सबसे छोटा परिणाम ${formatBytes(out.blob.size)} है, जो ${out.targetKB} KB से ऊपर है। JPEG चुनें, पिक्सेल घटाने दें या बड़ा लक्ष्य चुनें।`)}</div>
            )
          )}
          <ResultCard
            blob={out.blob}
            filename={`${baseName(file.name)}-compressed.${EXT[out.type]}`}
            previewUrl={outUrl}
            origBytes={file.size}
            width={out.width}
            height={out.height}
            quality={out.quality}
            verified={out.verified}
          >
            {out.note && <p className="muted small">{out.note}</p>}
          </ResultCard>
        </>
      )}
    </div>
  );
}
