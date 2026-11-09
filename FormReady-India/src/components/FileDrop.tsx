import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud } from 'lucide-react';
import { useLang } from '../i18n';
import { validateFiles, type FileKind } from '../lib/files';

interface Props {
  accept: string;
  allowed: Exclude<FileKind, null>[];
  maxMB: number;
  multiple?: boolean;
  disabled?: boolean;
  label?: string;
  onFiles: (files: File[]) => void | Promise<void>;
}

export default function FileDrop({ accept, allowed, maxMB, multiple, disabled, label, onFiles }: Props) {
  const { tr } = useLang();
  const input = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [over, setOver] = useState(false);

  const handle = async (list: FileList | File[] | null) => {
    if (!list || list.length === 0) return;
    const arr = Array.from(list);
    const { ok, errors: errs } = await validateFiles(multiple ? arr : arr.slice(0, 1), allowed, maxMB, tr);
    setErrors(errs);
    if (ok.length > 0) await onFiles(ok);
    if (input.current) input.current.value = '';
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setOver(false);
    if (!disabled) void handle(e.dataTransfer.files);
  };

  return (
    <div>
      <label
        className={`drop ${over ? 'over' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
      >
        <input
          ref={input}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => void handle(e.target.files)}
        />
        <UploadCloud size={36} aria-hidden="true" />
        <strong>{label ?? tr('Tap to choose a file', 'फ़ाइल चुनने के लिए टैप करें')}</strong>
        <span className="muted">
          {tr(
            `or drop it here · max ${maxMB} MB · processed in your browser`,
            `या यहाँ छोड़ें · अधिकतम ${maxMB} MB · आपके ब्राउज़र में प्रोसेस`
          )}
        </span>
      </label>
      {errors.length > 0 && (
        <div className="notice error" role="alert">
          {errors.map((e) => (
            <div key={e}>{e}</div>
          ))}
        </div>
      )}
    </div>
  );
}
