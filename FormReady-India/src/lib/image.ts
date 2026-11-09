export type OutFmt = 'image/jpeg' | 'image/png' | 'image/webp';
export type Fit = 'stretch' | 'contain' | 'cover';

export const EXT: Record<OutFmt, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

export function makeCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

export async function loadBitmap(file: File): Promise<ImageBitmap> {
  // createImageBitmap applies EXIF orientation in current browsers.
  return createImageBitmap(file);
}

/** True if the image has any noticeably transparent pixels (checked on a small sample). */
export function hasAlpha(bitmap: ImageBitmap): boolean {
  const scale = Math.min(1, 256 / Math.max(bitmap.width, bitmap.height));
  const c = makeCanvas(bitmap.width * scale, bitmap.height * scale);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;
  ctx.drawImage(bitmap, 0, 0, c.width, c.height);
  const d = ctx.getImageData(0, 0, c.width, c.height).data;
  for (let i = 3; i < d.length; i += 4) {
    if (d[i] < 250) return true;
  }
  return false;
}

/** Draw the bitmap onto a new w x h canvas. bg = fill colour, or null to keep transparency. */
export function render(
  bitmap: ImageBitmap,
  w: number,
  h: number,
  fit: Fit,
  bg: string | null
): HTMLCanvasElement {
  const c = makeCanvas(w, h);
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('canvas-unavailable');
  if (bg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  const bw = bitmap.width;
  const bh = bitmap.height;
  if (fit === 'stretch') {
    ctx.drawImage(bitmap, 0, 0, c.width, c.height);
  } else if (fit === 'contain') {
    const s = Math.min(c.width / bw, c.height / bh);
    const dw = bw * s;
    const dh = bh * s;
    ctx.drawImage(bitmap, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh);
  } else {
    // cover: scale up to fill, crop the centre
    const s = Math.max(c.width / bw, c.height / bh);
    const sw = c.width / s;
    const sh = c.height / s;
    ctx.drawImage(bitmap, (bw - sw) / 2, (bh - sh) / 2, sw, sh, 0, 0, c.width, c.height);
  }
  return c;
}

export function flatten(src: HTMLCanvasElement, bg: string): HTMLCanvasElement {
  const c = makeCanvas(src.width, src.height);
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('canvas-unavailable');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(src, 0, 0);
  return c;
}

function scaled(src: HTMLCanvasElement, s: number): HTMLCanvasElement {
  if (s >= 1) return src;
  const c = makeCanvas(src.width * s, src.height * s);
  const ctx = c.getContext('2d');
  if (!ctx) throw new Error('canvas-unavailable');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

/** Encode a canvas. Throws 'unsupported-format' if the browser silently produced another type. */
export function toBlob(c: HTMLCanvasElement, type: OutFmt, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    c.toBlob(
      (b) => {
        if (!b) return reject(new Error('encode-failed'));
        if (b.type !== type) return reject(new Error('unsupported-format'));
        resolve(b);
      },
      type,
      quality
    );
  });
}

export interface EncodeResult {
  blob: Blob;
  width: number;
  height: number;
  quality: number | null;
  /** true only when the real encoded blob is <= target. */
  met: boolean;
}

const MIN_Q = 0.1;

/**
 * Find the highest JPEG/WebP quality whose real output is <= target bytes.
 * With allowShrink the pixel size is reduced step by step if even the lowest
 * quality is still too large. PNG has no quality setting, so only shrinking can help.
 * The returned `met` is based on the actual encoded size, never an estimate.
 */
export async function encodeToTarget(
  source: HTMLCanvasElement,
  type: OutFmt,
  targetBytes: number,
  allowShrink: boolean
): Promise<EncodeResult> {
  const scales = allowShrink ? [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25] : [1];
  let best: EncodeResult | null = null;

  for (const s of scales) {
    const c = scaled(source, s);
    if (s < 1 && (c.width < 16 || c.height < 16)) break;
    await new Promise((r) => setTimeout(r, 0)); // keep the UI responsive

    if (type === 'image/png') {
      const blob = await toBlob(c, type);
      const r: EncodeResult = { blob, width: c.width, height: c.height, quality: null, met: blob.size <= targetBytes };
      if (!best || blob.size < best.blob.size) best = r;
      if (r.met) return r;
      continue;
    }

    const lowest = await toBlob(c, type, MIN_Q);
    if (!best || lowest.size < best.blob.size) {
      best = { blob: lowest, width: c.width, height: c.height, quality: MIN_Q, met: lowest.size <= targetBytes };
    }
    if (lowest.size > targetBytes) continue;

    let lo = MIN_Q;
    let hi = 0.95;
    let good: { blob: Blob; q: number } = { blob: lowest, q: MIN_Q };
    for (let i = 0; i < 8; i++) {
      const mid = (lo + hi) / 2;
      const b = await toBlob(c, type, mid);
      if (b.size <= targetBytes) {
        good = { blob: b, q: mid };
        lo = mid;
      } else {
        hi = mid;
      }
    }
    return { blob: good.blob, width: c.width, height: c.height, quality: good.q, met: true };
  }
  return best as EncodeResult;
}

/** Decode the produced blob again to prove it is a valid image and read its real size. */
export async function verifyImage(blob: Blob): Promise<{ width: number; height: number }> {
  const bmp = await createImageBitmap(blob);
  const r = { width: bmp.width, height: bmp.height };
  bmp.close();
  return r;
}

export function describeImageError(e: unknown, tr: (en: string, hi: string) => string): string {
  const m = e instanceof Error ? e.message : '';
  if (m === 'unsupported-format')
    return tr(
      'Your browser cannot create this output format. Please choose JPEG or PNG.',
      'आपका ब्राउज़र यह आउटपुट फ़ॉर्मैट नहीं बना सकता। कृपया JPEG या PNG चुनें।'
    );
  return tr(
    'Something went wrong while processing the image. Try a smaller image or a different browser.',
    'इमेज प्रोसेस करते समय समस्या आई। छोटी इमेज या दूसरा ब्राउज़र आज़माएँ।'
  );
}
