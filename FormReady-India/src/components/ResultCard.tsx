import { Download } from 'lucide-react';
import { useLang } from '../i18n';
import { downloadBlob, formatBytes } from '../lib/files';

interface Props {
  blob: Blob;
  filename: string;
  previewUrl: string | null;
  origBytes?: number;
  width?: number;
  height?: number;
  quality?: number | null;
  verified?: string;
  children?: React.ReactNode;
}

/** Shows the REAL size of the produced blob and a large download button. */
export default function ResultCard({ blob, filename, previewUrl, origBytes, width, height, quality, verified, children }: Props) {
  const { tr } = useLang();
  const diff = origBytes ? Math.round((1 - blob.size / origBytes) * 100) : null;
  return (
    <div className="result">
      <h3>{tr('Result', 'परिणाम')}</h3>
      {previewUrl && (
        <img
          className="preview"
          src={previewUrl}
          alt={tr('Preview of the processed image', 'प्रोसेस की गई इमेज का प्रीव्यू')}
        />
      )}
      <dl className="stats">
        {origBytes !== undefined && (
          <div>
            <dt>{tr('Original size', 'मूल साइज़')}</dt>
            <dd>{formatBytes(origBytes)}</dd>
          </div>
        )}
        <div>
          <dt>{tr('New size', 'नई साइज़')}</dt>
          <dd>
            {formatBytes(blob.size)}
            {diff !== null && diff > 0 && <small> ({tr(`${diff}% smaller`, `${diff}% छोटी`)})</small>}
            {diff !== null && diff <= 0 && <small> ({tr('not smaller', 'छोटी नहीं')})</small>}
          </dd>
        </div>
        {width && height && (
          <div>
            <dt>{tr('Dimensions', 'आयाम')}</dt>
            <dd>{width} × {height} px</dd>
          </div>
        )}
        {quality != null && (
          <div>
            <dt>{tr('Quality used', 'उपयोग की गई क्वालिटी')}</dt>
            <dd>{Math.round(quality * 100)}%</dd>
          </div>
        )}
      </dl>
      {verified && <p className="muted small">{verified}</p>}
      {children}
      <button type="button" className="btn btn-primary btn-block" onClick={() => downloadBlob(blob, filename)}>
        <Download size={20} /> {tr('Download', 'डाउनलोड करें')} ({formatBytes(blob.size)})
      </button>
    </div>
  );
}
