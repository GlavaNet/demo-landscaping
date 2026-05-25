export interface DrivePhoto {
  id: string;
  name: string;
  thumbnailUrl: string;
  fullUrl: string;
}

/**
 * Fetches image files from a public Google Drive folder.
 *
 * Client setup (one-time per business):
 *  1. Create a folder in Google Drive and upload photos to it.
 *  2. Right-click the folder → Share → "Anyone with the link" → Viewer.
 *  3. Copy the folder ID from the URL:
 *     https://drive.google.com/drive/folders/<FOLDER_ID>
 *  4. Add VITE_GOOGLE_DRIVE_FOLDER_ID to .env (local) or GitHub Secrets (production).
 *
 * After that, the client drops photos in the folder and they appear on the
 * site automatically — no logins, no token expiry, no manual updates.
 */
export const fetchDrivePhotos = async (): Promise<DrivePhoto[]> => {
  const folderId = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_ID;

  if (!folderId) {
    throw new Error('VITE_GOOGLE_DRIVE_FOLDER_ID is not set');
  }

  // The Drive embedded folder view exposes file IDs in its HTML.
  // For publicly shared folders this requires no API key or OAuth.
  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(embedUrl)}`;

  const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error(`Failed to reach Google Drive folder (status ${response.status})`);
  }

  const html = await response.text();

  // Extract file IDs: Google embeds them as /file/d/<ID>/
  const fileIdRegex = /\/file\/d\/([a-zA-Z0-9_-]+)\//g;
  const ids = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = fileIdRegex.exec(html)) !== null) {
    ids.add(match[1]);
  }

  if (ids.size === 0) return [];

  return Array.from(ids).map((id) => ({
    id,
    name: `photo-${id}`,
    // sz=w800 → Google serves an 800px-wide thumbnail from their CDN
    thumbnailUrl: `https://drive.google.com/thumbnail?id=${id}&sz=w800`,
    fullUrl: `https://drive.google.com/uc?export=view&id=${id}`,
  }));
};

/**
 * Returns placeholder photos for local dev when no folder ID is configured.
 */
export const fetchMockDrivePhotos = async (): Promise<DrivePhoto[]> => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return Array.from({ length: 6 }, (_, i) => {
    const hue = (i * 55) % 360;
    const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'><rect width='800' height='800' fill='hsl(${hue},55%,72%)'/><text x='50%' y='50%' font-family='sans-serif' font-size='52' fill='hsl(${hue},70%,25%)' text-anchor='middle' dominant-baseline='middle'>Photo ${i + 1}</text></svg>`;
    const encoded = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    return { id: `mock-${i}`, name: `sample-${i + 1}.jpg`, thumbnailUrl: encoded, fullUrl: encoded };
  });
};
