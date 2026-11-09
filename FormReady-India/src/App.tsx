import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import { GuidePage, GuidesIndex } from './pages/Guides';
import { About, Contact, Disclaimer, NotFound, Privacy, Terms } from './pages/Static';
import ErrorBoundary from './components/ErrorBoundary';
import { useLang } from './i18n';
import { tools } from './content/tools';

const ToolPage = lazy(() => import('./pages/ToolPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  const { tr } = useLang();
  return (
    <>
      <ScrollToTop />
      <a className="skip" href="#main">{tr('Skip to content', 'सामग्री पर जाएँ')}</a>
      <Header />
      <main id="main">
        <ErrorBoundary>
        <Suspense fallback={<div className="container page"><p className="muted">{tr('Loading…', 'लोड हो रहा है…')}</p></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<AllTools />} />
            {tools.map((t) => (
              <Route key={t.slug} path={`/${t.slug}`} element={<ToolPage slug={t.slug} />} />
            ))}
            <Route path="/guides" element={<GuidesIndex />} />
            <Route path="/guides/:slug" element={<GuidePage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
