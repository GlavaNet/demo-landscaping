import { useState, useCallback, useMemo, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  page: string;
  setPage: (page: string) => void;
}

export const Navigation = ({ page, setPage }: NavigationProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const businessName = useMemo(
    () => import.meta.env.VITE_BUSINESS_NAME?.trim() || 'Your Business',
    []
  );

  useEffect(() => {
    const checkTheme = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkTheme();
    window.addEventListener('themeChange', checkTheme);
    return () => window.removeEventListener('themeChange', checkTheme);
  }, []);

  const navItems = useMemo(() => [
    { id: 'home',     label: 'Portfolio', ariaLabel: 'View our portfolio' },
    { id: 'services', label: 'Services',  ariaLabel: 'See what we offer'  },
    { id: 'contact',  label: 'Contact',   ariaLabel: 'Get in touch'       },
  ], []);

  const handleNavClick = useCallback((navId: string) => {
    setPage(navId);
    setMenuOpen(false);
  }, [setPage]);

  return (
    <header>
      <nav
        className="fixed top-0 left-0 right-0 shadow-sm z-50"
        style={{ backgroundColor: 'var(--color-nav-bg)' }}
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">

          {/* Logo / business name */}
          <div className="flex items-center gap-3">
            {!logoError && (
              <img
                src={`/images/logo-${isDark ? 'dark' : 'light'}.png`}
                alt={`${businessName} logo`}
                className="h-20 w-auto object-contain"
                loading="eager"
                onError={() => setLogoError(true)}
              />
            )}
            {logoError && (
              <span
                className="text-xl font-semibold"
                style={{ color: 'var(--color-text)' }}
              >
                {businessName}
              </span>
            )}
          </div>

          {/* Desktop nav + theme toggle */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="block md:hidden p-2 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-label={item.ariaLabel}
                  className={`nav-link${page === item.id ? ' active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="px-4 py-2 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`block w-full text-left nav-link${page === item.id ? ' active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
      <div className="h-24" aria-hidden="true" />
    </header>
  );
};

export default Navigation;
