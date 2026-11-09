import type { Tr } from '../i18n';

export type FileKind = 'jpeg' | 'png' | 'webp' | 'pdf' | null;

export const MAX_IMAGE_MB = 25;
export const MAX_PDF_MB = 50;

/** Detect the real file type from the first bytes, not from the file name. */
export async function sniff(file: File): Promise<FileKind> {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'jpeg';
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'png';
  if (
    b.length >= 12 &&
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  )
    return 'webp';
  if (b.length >= 5 && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 && b[4] === 0x2d)
    return 'pdf';
  return null;
}

export async function validateFiles(
  files: File[],
  allowed: Exclude<FileKind, null>[],
  maxMB: number,
  tr: Tr
): Promise<{ ok: File[]; errors: string[] }> {
  const ok: File[] = [];
  const errors: string[] = [];
  for (const f of files) {
    if (f.size === 0) {
      errors.push(tr(`"${f.name}" is empty.`, `"${f.name}" खाली फ़ाइल है।`));
      continue;
    }
    if (f.size > maxMB * 1024 * 1024) {
      errors.push(
        tr(
          `"${f.name}" is larger than ${maxMB} MB, which is the limit for this tool.`,
          `"${f.name}" ${maxMB} MB से बड़ी है, जो इस टूल की सीमा है।`
        )
      );
      continue;
    }
    const kind = await sniff(f);
    if (!kind || !allowed.includes(kind)) {
      errors.push(
        tr(
          `"${f.name}" is not a supported file. Allowed: ${allowed.map((a) => a.toUpperCase()).join(', ')}.`,
          `"${f.name}" समर्थित फ़ाइल नहीं है। अनुमत: ${allowed.map((a) => a.toUpperCase()).join(', ')}।`
        )
      );
      continue;
    }
    ok.push(f);
  }
  return { ok, errors };
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export function baseName(name: string): string {
  const i = name.lastIndexOf('.');
  const b = i > 0 ? name.slice(0, i) : name;
  return b.replace(/[^\w\-. ]+/g, '_').slice(0, 80) || 'file';
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}

let counter = 0;
export function nextId(): string {
  counter += 1;
  return `f${counter}`;
}
