import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import GlobalAds from './components/GlobalAds';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import AllTools from './pages/AllTools';
import ToolPage from './pages/ToolPage';
import { GuidePage, GuidesIndex } from './pages/Guides';
import { About, Contact, Disclaimer, NotFound, Privacy, Terms } from './pages/Static';
import { useLang } from './i18n';
import { tools } from './content/tools';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { tr } = useLang();
  const { pathname } = useLocation();
  return (
    <>
      <ScrollToTop />
      <GlobalAds />
      <a className="skip" href="#main">{tr('Skip to content', 'सामग्री पर जाएँ')}</a>
      <Header />
      <main id="main">
        {/* key={pathname}: every page change starts clean, so one page's error or state never blocks the next. */}
        <ErrorBoundary key={pathname}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<AllTools />} />
            {tools.map((t) => (
              <Route key={t.slug} path={`/${t.slug}`} element={<ToolPage key={t.slug} slug={t.slug} />} />
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
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
