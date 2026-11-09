import { PDFDocument } from 'pdf-lib';
import { hasAlpha, loadBitmap, makeCanvas, toBlob } from './image';
import type { Tr } from '../i18n';

export async function readPdfBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer());
}

export function describePdfError(e: unknown, tr: Tr): string {
  const name = e instanceof Error ? e.name + ' ' + e.message : '';
  if (/encrypt|password/i.test(name))
    return tr(
      'This PDF is password-protected. Remove the password first, then try again.',
      'यह PDF पासवर्ड से सुरक्षित है। पहले पासवर्ड हटाएँ, फिर दोबारा प्रयास करें।'
    );
  return tr(
    'This PDF could not be read. It may be damaged or in an unsupported format.',
    'यह PDF पढ़ी नहीं जा सकी। फ़ाइल खराब हो सकती है या असमर्थित फ़ॉर्मैट में हो सकती है।'
  );
}

export async function pageCount(bytes: Uint8Array): Promise<number> {
  const doc = await PDFDocument.load(bytes);
  return doc.getPageCount();
}

export async function mergePdfs(files: File[]): Promise<Blob> {
  const out = await PDFDocument.create();
  for (const f of files) {
    const src = await PDFDocument.load(await readPdfBytes(f));
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }
  const bytes = await out.save({ useObjectStreams: true });
  return new Blob([bytes as BlobPart], { type: 'application/pdf' });
}

/** Lossless structure optimisation: object streams, no metadata rewrite. Text and images stay untouched. */
export async function optimizePdfStructure(file: File): Promise<Blob> {
  const doc = await PDFDocument.load(await readPdfBytes(file), { updateMetadata: false });
  doc.setTitle('');
  doc.setAuthor('');
  doc.setSubject('');
  doc.setKeywords([]);
  doc.setCreator('');
  doc.setProducer('');
  const bytes = await doc.save({ useObjectStreams: true });
  return new Blob([bytes as BlobPart], { type: 'application/pdf' });
}

let workerReady = false;
async function loadPdfJs() {
  const pdfjs = await import('pdfjs-dist');
  if (!workerReady) {
    const worker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;
    pdfjs.GlobalWorkerOptions.workerSrc = worker;
    workerReady = true;
  }
  return pdfjs;
}

/**
 * Re-render every page to a JPEG and rebuild the PDF. This can shrink scanned or
 * image-heavy PDFs a lot, but text becomes part of the picture (no longer selectable).
 */
export async function rasterizePdf(
  file: File,
  dpi: number,
  quality: number,
  onPage?: (done: number, total: number) => void
): Promise<Blob> {
  const pdfjs = await loadPdfJs();
  const data = (await readPdfBytes(file)).slice();
  const task = pdfjs.getDocument({ data });
  const pdf = await task.promise;
  try {
    const out = await PDFDocument.create();
    const scale = dpi / 72;
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const base = page.getViewport({ scale: 1 });
      const vp = page.getViewport({ scale });
      const canvas = makeCanvas(vp.width, vp.height);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('canvas-unavailable');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      const jpg = await toBlob(canvas, 'image/jpeg', quality);
      const img = await out.embedJpg(new Uint8Array(await jpg.arrayBuffer()));
      const p = out.addPage([base.width, base.height]);
      p.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
      canvas.width = 0;
      canvas.height = 0;
      page.cleanup();
      onPage?.(i, pdf.numPages);
      await new Promise((r) => setTimeout(r, 0));
    }
    const bytes = await out.save({ useObjectStreams: true });
    return new Blob([bytes as BlobPart], { type: 'application/pdf' });
  } finally {
    await pdf.destroy();
  }
}

export interface ImgToPdfOptions {
  page: 'a4' | 'letter' | 'custom';
  customWmm: number;
  customHmm: number;
  orientation: 'portrait' | 'landscape' | 'auto';
  marginMm: number;
  quality: number;
}

const MM = 72 / 25.4;

export function pageSizePt(o: ImgToPdfOptions): [number, number] {
  if (o.page === 'a4') return [595.28, 841.89];
  if (o.page === 'letter') return [612, 792];
  return [o.customWmm * MM, o.customHmm * MM];
}

export async function imagesToPdf(files: File[], o: ImgToPdfOptions): Promise<Blob> {
  const out = await PDFDocument.create();
  const [pw0, ph0] = pageSizePt(o);
  const margin = o.marginMm * MM;
  for (const f of files) {
    const bmp = await loadBitmap(f);
    try {
      const alpha = hasAlpha(bmp);
      const c = makeCanvas(bmp.width, bmp.height);
      const ctx = c.getContext('2d');
      if (!ctx) throw new Error('canvas-unavailable');
      if (!alpha) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, c.width, c.height);
      }
      ctx.drawImage(bmp, 0, 0);
      let pw = pw0;
      let ph = ph0;
      const landscape = o.orientation === 'auto' ? bmp.width > bmp.height : o.orientation === 'landscape';
      if (landscape !== pw > ph) [pw, ph] = [ph, pw];
      const blob = alpha ? await toBlob(c, 'image/png') : await toBlob(c, 'image/jpeg', o.quality);
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const img = alpha ? await out.embedPng(bytes) : await out.embedJpg(bytes);
      const aw = pw - 2 * margin;
      const ah = ph - 2 * margin;
      const s = Math.min(aw / img.width, ah / img.height);
      const dw = img.width * s;
      const dh = img.height * s;
      const page = out.addPage([pw, ph]);
      page.drawImage(img, { x: (pw - dw) / 2, y: (ph - dh) / 2, width: dw, height: dh });
    } finally {
      bmp.close();
    }
  }
  const bytes = await out.save({ useObjectStreams: true });
  return new Blob([bytes as BlobPart], { type: 'application/pdf' });
}
