import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useLang } from '../i18n';
import type { ToolInfo } from '../content/tools';

export default function ToolCard({ tool }: { tool: ToolInfo }) {
  const { t, tr } = useLang();
  const Icon = tool.icon;
  return (
    <Link to={`/${tool.slug}`} className="card tool-link">
      <span className="icon-wrap"><Icon size={26} aria-hidden="true" /></span>
      <h3>{t(tool.name)}</h3>
      <p className="muted">{t(tool.short)}</p>
      <span className="more">{tr('Open tool', 'टूल खोलें')} <ArrowRight size={16} /></span>
    </Link>
  );
}
