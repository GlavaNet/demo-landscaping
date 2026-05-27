/**
 * Extracts the dominant color from an image and derives a full
 * light/dark theme palette from it.
 *
 * Uses the Canvas API — no external dependencies required.
 */

export interface ThemePalette {
  // HSL components of the dominant brand color
  h: number;
  s: number;
  l: number;
}

/**
 * Loads an image URL and extracts the dominant non-neutral color
 * using a canvas pixel sample. Returns null if extraction fails.
 */
export const extractDominantColor = (imageUrl: string): Promise<ThemePalette | null> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        // Sample at reduced resolution for performance
        const SIZE = 64;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }

        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

        // Bucket pixels by hue, skipping near-white, near-black, and near-gray
        const hueBuckets: Record<number, number> = {};
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue; // skip transparent

          const hsl = rgbToHsl(r, g, b);
          // Skip near-white (l > 90%), near-black (l < 10%), and near-gray (s < 15%)
          if (hsl.l > 0.90 || hsl.l < 0.10 || hsl.s < 0.15) continue;

          // Bucket into 36 × 10-degree hue segments
          const bucket = Math.round(hsl.h / 10) * 10;
          hueBuckets[bucket] = (hueBuckets[bucket] || 0) + 1;
        }

        const entries = Object.entries(hueBuckets);
        if (entries.length === 0) { resolve(null); return; }

        // Find the most common hue bucket
        const [dominantHue] = entries.sort((a, b) => b[1] - a[1])[0];
        const h = parseInt(dominantHue);

        // Collect all pixels in that hue range and average their S and L
        let totalS = 0, totalL = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
          if (a < 128) continue;
          const hsl = rgbToHsl(r, g, b);
          if (hsl.l > 0.90 || hsl.l < 0.10 || hsl.s < 0.15) continue;
          if (Math.abs(hsl.h - h) <= 15) {
            totalS += hsl.s;
            totalL += hsl.l;
            count++;
          }
        }

        if (count === 0) { resolve(null); return; }

        resolve({
          h,
          s: Math.round((totalS / count) * 100),
          l: Math.round((totalL / count) * 100),
        });
      } catch {
        resolve(null);
      }
    };

    img.onerror = () => resolve(null);
    img.src = imageUrl;
  });
};

/**
 * Given a dominant brand color, returns a set of CSS custom property
 * values for both light and dark modes.
 */
export const buildCssVars = (palette: ThemePalette): {
  light: Record<string, string>;
  dark: Record<string, string>;
} => {
  const { h, s } = palette;

  // Clamp saturation: very low-sat logos get bumped up slightly for UI use
  const uiS = Math.max(s, 40);

  return {
    light: {
      '--color-primary':        hsl(h, uiS, 45),
      '--color-primary-hover':  hsl(h, uiS, 35),
      '--color-primary-light':  hsl(h, uiS, 95),
      '--color-primary-ring':   hsl(h, uiS, 45),
      '--color-bg':             hsl(0, 0, 100),
      '--color-bg-card':        hsl(0, 0, 100),
      '--color-bg-subtle':      hsl(h, Math.min(uiS, 30), 97),
      '--color-text':           hsl(0, 0, 9),
      '--color-text-muted':     hsl(0, 0, 45),
      '--color-border':         hsl(0, 0, 88),
      '--color-nav-bg':         hsl(0, 0, 100),
      '--color-skeleton':       hsl(0, 0, 92),
      '--color-warning-bg':     hsl(45, 90, 96),
      '--color-warning-border': hsl(45, 80, 80),
      '--color-warning-text':   hsl(35, 80, 30),
    },
    dark: {
      '--color-primary':        hsl(h, uiS, 55),
      '--color-primary-hover':  hsl(h, uiS, 65),
      '--color-primary-light':  hsl(h, Math.min(uiS, 30), 15),
      '--color-primary-ring':   hsl(h, uiS, 55),
      '--color-bg':             hsl(h, Math.min(uiS, 15), 7),
      '--color-bg-card':        hsl(h, Math.min(uiS, 12), 12),
      '--color-bg-subtle':      hsl(h, Math.min(uiS, 20), 10),
      '--color-text':           hsl(0, 0, 95),
      '--color-text-muted':     hsl(0, 0, 60),
      '--color-border':         hsl(h, Math.min(uiS, 15), 20),
      '--color-nav-bg':         hsl(h, Math.min(uiS, 15), 7),
      '--color-skeleton':       hsl(h, Math.min(uiS, 12), 16),
      '--color-warning-bg':     hsl(45, 40, 12),
      '--color-warning-border': hsl(45, 50, 25),
      '--color-warning-text':   hsl(45, 80, 70),
    },
  };
};

/**
 * Injects CSS custom properties onto the <html> element.
 * Applies light or dark vars depending on the current theme.
 */
export const applyThemeVars = (
  vars: ReturnType<typeof buildCssVars>,
  isDark: boolean
) => {
  const active = isDark ? vars.dark : vars.light;
  const root = document.documentElement;
  Object.entries(active).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const hsl = (h: number, s: number, l: number) => `hsl(${h}, ${s}%, ${l}%)`;

const rgbToHsl = (r: number, g: number, b: number) => {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
    case gn: h = ((bn - rn) / d + 2) / 6; break;
    case bn: h = ((rn - gn) / d + 4) / 6; break;
  }
  return { h: Math.round(h * 360), s, l };
};
