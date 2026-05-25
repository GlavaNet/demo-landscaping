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
    <footer className="w-full bg-white dark:bg-gray-900 shadow-sm mt-12" role="contentinfo">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} {businessName}. All rights reserved.
          </p>
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={`${businessName} on Instagram`}
              className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
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
