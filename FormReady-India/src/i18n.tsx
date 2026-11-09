import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'hi';
export type Tr = (en: string, hi: string) => string;
export interface Bi {
  en: string;
  hi: string;
}

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  tr: Tr;
  t: (b: Bi) => string;
}

const LangContext = createContext<Ctx | null>(null);
const KEY = 'fr-lang';

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'hi') return saved;
  } catch {
    /* storage unavailable: fall through */
  }
  return 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      // Only the language preference is stored. Never any user document data.
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const tr: Tr = useCallback((en, hi) => (lang === 'hi' ? hi : en), [lang]);
  const t = useCallback((b: Bi) => (lang === 'hi' ? b.hi : b.en), [lang]);

  return <LangContext.Provider value={{ lang, setLang, tr, t }}>{children}</LangContext.Provider>;
}

export function useLang(): Ctx {
  const c = useContext(LangContext);
  if (!c) throw new Error('useLang must be used inside LangProvider');
  return c;
}
