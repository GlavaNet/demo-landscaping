import { useEffect, useState, useCallback } from 'react';
import { ImageIcon, RefreshCw, FolderOpen } from 'lucide-react';
import { fetchDrivePhotos, fetchMockDrivePhotos } from '../lib/googleDrive';
import type { DrivePhoto } from '../lib/googleDrive';

interface DriveGalleryProps {
  className?: string;
}

export const DriveGallery = ({ className = '' }: DriveGalleryProps) => {
  const [photos, setPhotos] = useState<DrivePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxPhoto, setLightboxPhoto] = useState<DrivePhoto | null>(null);
  const [useMock, setUseMock] = useState(false);

  const loadPhotos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;
      if (!folderId) {
        setPhotos(await fetchMockDrivePhotos());
        setUseMock(true);
        return;
      }
      const data = await fetchDrivePhotos();
      if (data.length === 0) {
        setError('No photos found in the connected folder yet. Add some images to your Google Drive folder to get started.');
        return;
      }
      setPhotos(data);
      setUseMock(false);
    } catch (err) {
      console.error('Gallery error:', err);
      try {
        setPhotos(await fetchMockDrivePhotos());
        setUseMock(true);
      } catch {
        setError('Could not load photos. Please check your folder ID and sharing settings.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPhotos(); }, [loadPhotos]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightboxPhoto(null); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  if (loading) {
    return (
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 ${className}`.trim()}
        role="status" aria-busy="true" aria-label="Loading photos"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl animate-pulse flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-skeleton)' }}
          >
            <ImageIcon size={32} style={{ color: 'var(--color-border)' }} />
          </div>
        ))}
      </div>
    );
  }

  if (error && photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <FolderOpen size={48} style={{ color: 'var(--color-text-muted)' }} />
        <p className="max-w-sm" style={{ color: 'var(--color-text-muted)' }}>{error}</p>
        <button onClick={loadPhotos} className="btn-primary inline-flex items-center gap-2">
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      {useMock && (
        <div className="warning-banner mb-4">
          <span>
            Showing sample photos — set{' '}
            <code className="font-mono font-semibold">VITE_GOOGLE_DRIVE_FOLDER_ID</code>{' '}
            to connect a real Drive folder.
          </span>
          <button onClick={loadPhotos} className="shrink-0 inline-flex items-center gap-1 hover:underline">
            <RefreshCw size={13} /> Retry
          </button>
        </div>
      )}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 ${className}`.trim()}
        role="feed" aria-label="Project photos"
      >
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setLightboxPhoto(photo)}
            className="aspect-square group relative rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{ '--tw-ring-color': 'var(--color-primary-ring)' } as React.CSSProperties}
            aria-label={`View photo ${photo.name}`}
          >
            <img
              src={photo.thumbnailUrl}
              alt={photo.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                if (e.currentTarget.src !== photo.fullUrl) e.currentTarget.src = photo.fullUrl;
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
          </button>
        ))}
      </div>

      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={() => setLightboxPhoto(null)}
          role="dialog" aria-modal="true" aria-label="Photo viewer"
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl leading-none"
            onClick={() => setLightboxPhoto(null)}
            aria-label="Close photo viewer"
          >
            ×
          </button>
          <img
            src={lightboxPhoto.fullUrl}
            alt={lightboxPhoto.name}
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default DriveGallery;
