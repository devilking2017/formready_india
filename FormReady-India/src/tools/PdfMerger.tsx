import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Merge, RotateCcw, Trash2 } from 'lucide-react';
import FileDrop from '../components/FileDrop';
import ResultCard from '../components/ResultCard';
import { useLang } from '../i18n';
import { formatBytes, MAX_PDF_MB, nextId } from '../lib/files';
import { describePdfError, mergePdfs, pageCount, readPdfBytes } from '../lib/pdf';

interface Item {
  id: string;
  file: File;
  pages: number;
}

export default function PdfMerger() {
  const { tr } = useLang();
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [out, setOut] = useState<{ blob: Blob; pages: number } | null>(null);

  useEffect(() => () => setOut(null), []);

  const reset = () => {
    setItems([]);
    setOut(null);
    setError('');
  };

  const add = async (files: File[]) => {
    setOut(null);
    const errs: string[] = [];
    const added: Item[] = [];
    for (const f of files) {
      try {
        const n = await pageCount(await readPdfBytes(f));
        added.push({ id: nextId(), file: f, pages: n });
      } catch (e) {
        errs.push(`${f.name}: ${describePdfError(e, tr)}`);
      }
    }
    setError(errs.join('\n'));
    if (added.length) setItems((cur) => [...cur, ...added]);
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

  const total = items.reduce((s, x) => s + x.pages, 0);

  const run = async () => {
    if (items.length < 2) {
      setError(tr('Add at least two PDFs to merge.', 'मर्ज करने के लिए कम से कम दो PDF जोड़ें।'));
      return;
    }
    setBusy(true);
    setError('');
    setOut(null);
    await new Promise((r) => setTimeout(r, 30));
    try {
      const blob = await mergePdfs(items.map((x) => x.file));
      const n = await pageCount(new Uint8Array(await blob.arrayBuffer()));
      if (n !== total) throw new Error('page-mismatch');
      setOut({ blob, pages: n });
    } catch (e) {
      setError(
        e instanceof Error && e.message === 'page-mismatch'
          ? tr('The merged file failed the page-count check, so it was discarded.', 'जुड़ी फ़ाइल पेज-संख्या जाँच में विफल रही, इसलिए हटा दी गई।')
          : describePdfError(e, tr)
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="tool">
      <FileDrop
        accept="application/pdf"
        allowed={['pdf']}
        maxMB={MAX_PDF_MB}
        multiple
        label={items.length ? tr('Add more PDFs', 'और PDF जोड़ें') : tr('Tap to choose PDFs', 'PDF चुनने के लिए टैप करें')}
        onFiles={add}
      />

      {items.length > 0 && (
        <>
          <div className="file-head">
            <strong>{tr(`${items.length} file(s) · ${total} pages in total`, `${items.length} फ़ाइल · कुल ${total} पन्ने`)}</strong>
            <button type="button" className="btn btn-ghost" onClick={reset}><RotateCcw size={18} /> {tr('Clear all', 'सब हटाएँ')}</button>
          </div>
          <ol className="list">
            {items.map((it, i) => (
              <li key={it.id} className="list-item">
                <span className="num">{i + 1}</span>
                <div className="grow">
                  <div className="name">{it.file.name}</div>
                  <div className="muted small">{formatBytes(it.file.size)} · {it.pages} {tr(it.pages === 1 ? 'page' : 'pages', 'पन्ने')}</div>
                </div>
                <div className="actions">
                  <button type="button" className="icon-btn" disabled={i === 0} onClick={() => move(i, -1)} aria-label={tr('Move up', 'ऊपर ले जाएँ')}><ArrowUp size={20} /></button>
                  <button type="button" className="icon-btn" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label={tr('Move down', 'नीचे ले जाएँ')}><ArrowDown size={20} /></button>
                  <button type="button" className="icon-btn danger" onClick={() => remove(it.id)} aria-label={tr('Remove', 'हटाएँ')}><Trash2 size={20} /></button>
                </div>
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn-primary btn-block" disabled={busy || items.length < 2} onClick={run}>
            <Merge size={20} /> {busy ? tr('Merging…', 'मर्ज हो रहा है…') : tr('Merge PDFs', 'PDF मर्ज करें')}
          </button>
        </>
      )}

      {error && <div className="notice error" role="alert" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

      {out && (
        <ResultCard
          blob={out.blob}
          filename="merged.pdf"
          previewUrl={null}
          verified={tr(`Checked: the merged PDF opens and has ${out.pages} pages, equal to the total of your files.`, `जाँच: जुड़ी PDF खुलती है और उसमें ${out.pages} पन्ने हैं, जो आपकी फ़ाइलों के कुल के बराबर हैं।`)}
        />
      )}
    </div>
  );
}
