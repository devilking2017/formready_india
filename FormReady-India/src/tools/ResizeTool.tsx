import { useEffect, useRef, useState } from 'react';
import { Lock, Unlock, Plus, RotateCcw, Zap } from 'lucide-react';
import FileDrop from '../components/FileDrop';
import ResultCard from '../components/ResultCard';
import { useLang } from '../i18n';
import { useObjectUrl } from '../lib/hooks';
import { baseName, formatBytes, MAX_IMAGE_MB } from '../lib/files';
import {
  EXT, describeImageError, encodeToTarget, flatten, hasAlpha, loadBitmap, render, toBlob, verifyImage,
  type EncodeResult, type Fit, type OutFmt,
} from '../lib/image';

interface Preset {
  label: string;
  w: number;
  h: number;
  kb?: number;
}

/** Example sizes only. They are NOT official requirements; users must edit them to match their notification. */
const PHOTO_PRESETS: Preset[] = [
  { label: '200 × 230 px', w: 200, h: 230 },
  { label: '140 × 160 px', w: 140, h: 160 },
  { label: '413 × 531 px (3.5×4.5 cm @300dpi)', w: 413, h: 531 },
  { label: '300 × 300 px', w: 300, h: 300 },
  { label: '600 × 600 px', w: 600, h: 600 },
];

const SIGN_PRESETS: Preset[] = [
  { label: '140 × 60 px', w: 140, h: 60 },
  { label: '200 × 80 px', w: 200, h: 80 },
  { label: '256 × 64 px', w: 256, h: 64 },
  { label: '300 × 100 px', w: 300, h: 100 },
];

interface Out extends EncodeResult {
  type: OutFmt;
  verified: string;
  targetKB: number | null;
  note: string;
}

const MAX_SIDE = 8000;
const MAX_AREA = 36_000_000;

export default function ResizeTool({ kind }: { kind: 'photo' | 'signature' }) {
  const { tr } = useLang();
  const isSign = kind === 'signature';
  const [file, setFile] = useState<File | null>(null);
  const bmp = useRef<ImageBitmap | null>(null);
  const [nat, setNat] = useState<{ w: number; h: number; alpha: boolean } | null>(null);
  const [w, setW] = useState('');
  const [h, setH] = useState('');
  const [lock, setLock] = useState(true);
  const [fit, setFit] = useState<Fit>(isSign ? 'contain' : 'cover');
  const [bg, setBg] = useState<'#ffffff' | 'transparent'>('#ffffff');
  const [fmt, setFmt] = useState<OutFmt>('image/jpeg');
  const [useTarget, setUseTarget] = useState(false);
  const [kb, setKb] = useState(isSign ? '20' : '50');
  const [quality, setQuality] = useState(0.92);
  const [presets, setPresets] = useState<Preset[]>(isSign ? SIGN_PRESETS : PHOTO_PRESETS);
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
    setNat(null);
    setOut(null);
    setError('');
  };

  const onFiles = async (files: File[]) => {
    reset();
    try {
      const b = await loadBitmap(files[0]);
      bmp.current = b;
      setNat({ w: b.width, h: b.height, alpha: hasAlpha(b) });
      setW(String(b.width));
      setH(String(b.height));
      setFile(files[0]);
    } catch {
      setError(tr('This image could not be opened. It may be damaged.', 'यह इमेज खुल नहीं सकी। फ़ाइल खराब हो सकती है।'));
    }
  };

  const onW = (v: string) => {
    setW(v);
    const n = Number(v);
    if (lock && nat && n > 0) setH(String(Math.round((n * nat.h) / nat.w)));
  };
  const onH = (v: string) => {
    setH(v);
    const n = Number(v);
    if (lock && nat && n > 0) setW(String(Math.round((n * nat.w) / nat.h)));
  };

  const applyPreset = (p: Preset) => {
    setW(String(p.w));
    setH(String(p.h));
    setLock(false);
    if (p.kb) {
      setUseTarget(true);
      setKb(String(p.kb));
    }
  };

  const savePreset = () => {
    const pw = Math.round(Number(w));
    const ph = Math.round(Number(h));
    if (!(pw > 0 && ph > 0)) return;
    const label = `${pw} × ${ph} px` + (useTarget && Number(kb) > 0 ? ` · ${kb} KB` : '');
    setPresets((p) => [...p, { label, w: pw, h: ph, kb: useTarget && Number(kb) > 0 ? Number(kb) : undefined }]);
  };

  const run = async () => {
    if (!file || !bmp.current || !nat) return;
    const tw = Math.round(Number(w));
    const th = Math.round(Number(h));
    if (!(tw >= 1 && th >= 1) || tw > MAX_SIDE || th > MAX_SIDE || tw * th > MAX_AREA) {
      setError(tr(`Enter whole-number width and height between 1 and ${MAX_SIDE} px.`, `1 से ${MAX_SIDE} px के बीच पूर्ण संख्या में चौड़ाई और ऊँचाई भरें।`));
      return;
    }
    let targetKB: number | null = null;
    if (useTarget) {
      targetKB = Number(kb);
      if (!Number.isFinite(targetKB) || targetKB < 1 || targetKB > 100000) {
        setError(tr('Enter a size limit between 1 and 100000 KB.', '1 से 100000 KB के बीच साइज़ सीमा भरें।'));
        return;
      }
    }
    setBusy(true);
    setError('');
    setOut(null);
    await new Promise((r) => setTimeout(r, 30));
    try {
      const isJpeg = fmt === 'image/jpeg';
      const fill = isJpeg || bg === '#ffffff' ? '#ffffff' : null;
      const base = render(bmp.current, tw, th, fit, fill);
      const src = isJpeg ? flatten(base, '#ffffff') : base;
      let res: EncodeResult;
      if (targetKB !== null) {
        // Dimensions are fixed: only quality may change.
        res = await encodeToTarget(src, fmt, targetKB * 1024, false);
      } else {
        const blob = await toBlob(src, fmt, fmt === 'image/png' ? undefined : quality);
        res = { blob, width: src.width, height: src.height, quality: fmt === 'image/png' ? null : quality, met: true };
      }
      const v = await verifyImage(res.blob);
      const notes: string[] = [];
      if (nat.alpha && isJpeg)
        notes.push(tr('Transparent areas were filled with white because JPEG has no transparency. Choose PNG to keep transparency.', 'JPEG में पारदर्शिता नहीं होती, इसलिए पारदर्शी हिस्से सफ़ेद भरे गए। पारदर्शिता रखने के लिए PNG चुनें।'));
      if (fmt === 'image/png' && targetKB !== null)
        notes.push(tr('PNG cannot be compressed by quality. Use JPEG to reach a small size.', 'PNG को क्वालिटी से कंप्रेस नहीं किया जा सकता। छोटी साइज़ के लिए JPEG चुनें।'));
      setOut({
        ...res,
        type: fmt,
        targetKB,
        note: notes.join(' '),
        verified:
          v.width === tw && v.height === th
            ? tr(`Checked: the output opens correctly and is exactly ${v.width}×${v.height} px.`, `जाँच: आउटपुट सही खुलता है और ठीक ${v.width}×${v.height} px का है।`)
            : tr('Output decoded, but its size differs from expectation.', 'आउटपुट खुला, पर उसका आकार अपेक्षा से अलग है।'),
      });
    } catch (e) {
      setError(describeImageError(e, tr));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool">
      {!file ? (
        <FileDrop
          accept={isSign ? 'image/jpeg,image/png' : 'image/jpeg,image/png,image/webp'}
          allowed={isSign ? ['jpeg', 'png'] : ['jpeg', 'png', 'webp']}
          maxMB={MAX_IMAGE_MB}
          label={
            isSign
              ? tr('Tap to choose your signature (JPG or PNG)', 'हस्ताक्षर चुनने के लिए टैप करें (JPG या PNG)')
              : tr('Tap to choose a photo (JPG, PNG, WebP)', 'फोटो चुनने के लिए टैप करें (JPG, PNG, WebP)')
          }
          onFiles={onFiles}
        />
      ) : (
        <>
          <div className="file-head">
            <div>
              <strong>{file.name}</strong>
              <div className="muted small">{formatBytes(file.size)} · {nat?.w}×{nat?.h} px{nat?.alpha ? ' · ' + tr('has transparency', 'पारदर्शिता है') : ''}</div>
            </div>
            <button type="button" className="btn btn-ghost" onClick={reset}><RotateCcw size={18} /> {tr('Reset', 'रीसेट')}</button>
          </div>
          {origUrl && <img className="preview" src={origUrl} alt={tr('Preview of your original image', 'आपकी मूल इमेज का प्रीव्यू')} />}

          <fieldset className="field">
            <legend>{tr('Presets (examples only – edit the values to match your form)', 'प्रीसेट (केवल उदाहरण – अपने फॉर्म के अनुसार मान बदलें)')}</legend>
            <div className="chips">
              {presets.map((p, i) => (
                <button key={`${p.label}-${i}`} type="button" className="chip" onClick={() => applyPreset(p)}>
                  {p.label}
                </button>
              ))}
              <button type="button" className="chip chip-add" onClick={savePreset} aria-label={tr('Save current values as a preset for this visit', 'वर्तमान मान को इस विज़िट के लिए प्रीसेट के रूप में सहेजें')}>
                <Plus size={16} /> {tr('Save current', 'वर्तमान सहेजें')}
              </button>
            </div>
          </fieldset>

          <div className="dims">
            <label className="field">
              <span>{tr('Width (px)', 'चौड़ाई (px)')}</span>
              <input type="number" inputMode="numeric" min={1} value={w} onChange={(e) => onW(e.target.value)} />
            </label>
            <button
              type="button"
              className="btn btn-ghost lock"
              aria-pressed={lock}
              aria-label={lock ? tr('Aspect ratio locked', 'अनुपात लॉक है') : tr('Aspect ratio unlocked', 'अनुपात अनलॉक है')}
              onClick={() => setLock((l) => !l)}
            >
              {lock ? <Lock size={20} /> : <Unlock size={20} />}
            </button>
            <label className="field">
              <span>{tr('Height (px)', 'ऊँचाई (px)')}</span>
              <input type="number" inputMode="numeric" min={1} value={h} onChange={(e) => onH(e.target.value)} />
            </label>
          </div>

          <label className="field">
            <span>{tr('How should the picture fit?', 'तस्वीर कैसे फ़िट हो?')}</span>
            <select value={fit} onChange={(e) => setFit(e.target.value as Fit)}>
              <option value="contain">{tr('Fit inside (show everything, may add background)', 'अंदर फ़िट (पूरा दिखाएँ, बैकग्राउंड जुड़ सकता है)')}</option>
              <option value="cover">{tr('Crop to fill (cuts the edges)', 'क्रॉप टू फ़िल (किनारे कटते हैं)')}</option>
              <option value="stretch">{tr('Stretch (can distort)', 'स्ट्रेच (आकार बिगड़ सकता है)')}</option>
            </select>
          </label>

          <label className="field">
            <span>{tr('Output format', 'आउटपुट फ़ॉर्मैट')}</span>
            <select value={fmt} onChange={(e) => setFmt(e.target.value as OutFmt)}>
              <option value="image/jpeg">JPEG (.jpg)</option>
              <option value="image/png">{isSign ? tr('PNG (keeps transparency)', 'PNG (पारदर्शिता बनी रहती है)') : 'PNG'}</option>
              {!isSign && <option value="image/webp">WebP</option>}
            </select>
          </label>

          {fmt !== 'image/jpeg' && fit === 'contain' && (
            <label className="field">
              <span>{tr('Background for empty areas', 'खाली जगह का बैकग्राउंड')}</span>
              <select value={bg} onChange={(e) => setBg(e.target.value as '#ffffff' | 'transparent')}>
                <option value="#ffffff">{tr('White', 'सफ़ेद')}</option>
                <option value="transparent">{tr('Transparent', 'पारदर्शी')}</option>
              </select>
            </label>
          )}

          <label className="check">
            <input type="checkbox" checked={useTarget} onChange={(e) => setUseTarget(e.target.checked)} />
            <span>{tr('Limit the file size (KB)', 'फ़ाइल साइज़ सीमित करें (KB)')}</span>
          </label>
          {useTarget ? (
            <label className="inline">
              <span>{tr('Maximum size (KB)', 'अधिकतम साइज़ (KB)')}</span>
              <input type="number" inputMode="numeric" min={1} value={kb} onChange={(e) => setKb(e.target.value)} />
            </label>
          ) : (
            fmt !== 'image/png' && (
              <label className="field">
                <span>{tr('Quality', 'क्वालिटी')}: <strong>{Math.round(quality * 100)}%</strong></span>
                <input type="range" min={0.1} max={1} step={0.05} value={quality} onChange={(e) => setQuality(Number(e.target.value))} />
              </label>
            )
          )}

          {isSign && (
            <div className="notice info">
              {tr('A signature must stay readable. Very small sizes or very low quality can erase thin strokes. Always zoom into the result before you download it.', 'हस्ताक्षर पढ़ने योग्य रहना चाहिए। बहुत छोटी साइज़ या बहुत कम क्वालिटी से पतली रेखाएँ मिट सकती हैं। डाउनलोड से पहले परिणाम को ज़ूम करके ज़रूर देखें।')}
            </div>
          )}

          <button type="button" className="btn btn-primary btn-block" disabled={busy} onClick={run}>
            <Zap size={20} /> {busy ? tr('Processing…', 'प्रोसेस हो रहा है…') : isSign ? tr('Resize signature', 'हस्ताक्षर रिसाइज़ करें') : tr('Resize photo', 'फोटो रिसाइज़ करें')}
          </button>
        </>
      )}

      {error && <div className="notice error" role="alert">{error}</div>}

      {out && file && (
        <>
          {out.targetKB !== null && (
            out.met ? (
              <div className="notice ok">{tr(`Size limit met: the real output is ${formatBytes(out.blob.size)} (limit ${out.targetKB} KB).`, `साइज़ सीमा पूरी: असली आउटपुट ${formatBytes(out.blob.size)} है (सीमा ${out.targetKB} KB)।`)}</div>
            ) : (
              <div className="notice warn">{tr(`The ${out.targetKB} KB limit was NOT reached at ${out.width}×${out.height} px. The smallest result is ${formatBytes(out.blob.size)}. Use JPEG, reduce the pixel size, or raise the limit.`, `${out.width}×${out.height} px पर ${out.targetKB} KB सीमा पूरी नहीं हुई। सबसे छोटा परिणाम ${formatBytes(out.blob.size)} है। JPEG चुनें, पिक्सेल साइज़ घटाएँ या सीमा बढ़ाएँ।`)}</div>
            )
          )}
          <ResultCard
            blob={out.blob}
            filename={`${baseName(file.name)}-${isSign ? 'signature' : 'photo'}-${out.width}x${out.height}.${EXT[out.type]}`}
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
