import { Instagram } from 'lucide-react';
import { useMemo } from 'react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const businessName = useMemo(
    () => import.meta.env.VITE_BUSINESS_NAME?.trim() || 'Your Business',
    []
  );
  const instagramHandle = useMemo(
    () => import.meta.env.VITE_INSTAGRAM_HANDLE?.trim() || '',
    []
  );
  const instagramUrl = useMemo(() => {
    if (!instagramHandle) return null;
    const safe = encodeURIComponent(instagramHandle.replace(/[^a-zA-Z0-9._]/g, ''));
    return `https://instagram.com/${safe}`;
  }, [instagramHandle]);

  return (
    <footer
      className="w-full shadow-sm mt-12"
      style={{ backgroundColor: 'var(--color-nav-bg)', borderTop: '1px solid var(--color-border)' }}
      role="contentinfo"
    >
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            © {currentYear} {businessName}. All rights reserved.
          </p>
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`${businessName} on Instagram`}
              className="transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-text-muted)')}
            >
              <Instagram size={20} aria-hidden="true" />
              <span className="sr-only">Instagram</span>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
