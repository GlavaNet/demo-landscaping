import { useState, useEffect, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { DriveGallery } from './components/DriveGallery';
import { Services } from './components/Services';
import { ContactInfo } from './components/ContactInfo';
import { Footer } from './components/Footer';
import {
  extractDominantColor,
  buildCssVars,
  applyThemeVars,
} from './lib/colorExtractor';
import type { ThemePalette } from './lib/colorExtractor';

const isDarkMode = () => document.documentElement.classList.contains('dark');

const App = () => {
  const [page, setPage] = useState('home');
  const [themePalette, setThemePalette] = useState<ReturnType<typeof buildCssVars> | null>(null);

  const applyPalette = useCallback(
    (palette: ReturnType<typeof buildCssVars> | null) => {
      if (palette) applyThemeVars(palette, isDarkMode());
    },
    []
  );

  // Initial theme setup
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  // Extract color from logo on mount
  useEffect(() => {
    const logoUrl = isDarkMode()
      ? '/images/logo-dark.png'
      : '/images/logo-light.png';

    fetch(logoUrl, { method: 'HEAD' })
      .then((res) => {
        if (!res.ok) return null;
        return extractDominantColor(logoUrl);
      })
      .then((dominant: ThemePalette | null) => {
        if (!dominant) return;
        const palette = buildCssVars(dominant);
        setThemePalette(palette);
        applyThemeVars(palette, isDarkMode());
      })
      .catch(() => {
        // No logo or extraction failed — default palette stays in place
      });
  }, []);

  // Re-apply palette when theme toggles
  useEffect(() => {
    const handler = () => applyPalette(themePalette);
    window.addEventListener('themeChange', handler);
    return () => window.removeEventListener('themeChange', handler);
  }, [themePalette, applyPalette]);

  return (
    <div
      className="min-h-screen flex flex-col transition-colors"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}
    >
      <Navigation page={page} setPage={setPage} />
      <main
        className={`flex-grow px-4 max-w-5xl mx-auto w-full ${
          page === 'home' ? 'pt-40 sm:pt-40' : 'pt-36 sm:pt-32'
        }`}
      >
        {page === 'home'     && <DriveGallery />}
        {page === 'services' && <Services />}
        {page === 'contact'  && <ContactInfo />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
