import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useLang } from '../i18n';
import { site } from '../config/site';

export default function Header() {
  const { lang, setLang, tr } = useLang();
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);

  const links: [string, string, string][] = [
    ['/', 'Home', 'होम'],
    ['/tools', 'All Tools', 'सभी टूल'],
    ['/guides', 'Guides', 'गाइड'],
    ['/about', 'About', 'हमारे बारे में'],
    ['/contact', 'Contact', 'संपर्क'],
  ];

  return (
    <header className="site-header">
      <div className="container header-row">
        <Link to="/" className="brand" aria-label={site.siteName}>
          <Logo />
          <span>{site.siteName}</span>
        </Link>
        <nav className={`nav ${open ? 'open' : ''}`} aria-label={tr('Main navigation', 'मुख्य नेविगेशन')}>
          {links.map(([to, en, hi]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
              {tr(en, hi)}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <div className="lang-switch" role="group" aria-label={tr('Language', 'भाषा')}>
            <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
              EN
            </button>
            <button type="button" aria-pressed={lang === 'hi'} onClick={() => setLang('hi')}>
              हिं
            </button>
          </div>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-label={tr('Toggle menu', 'मेन्यू खोलें/बंद करें')}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
