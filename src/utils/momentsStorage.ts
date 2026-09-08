import { useState, useEffect } from 'react';
import { BRAND_IDENTITY_CARDS, BrandVisualCard } from '../data/brandIdentityCards';
import { signatureMoments, SignatureMoment } from '../data/signature-moments';

const STORAGE_KEY = 'lh_custom_moments_imagery_v1';

export type CustomImageryMap = Record<string, string>;

/**
 * Get all stored custom image overrides from localStorage
 */
export function getStoredCustomImagery(): CustomImageryMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CustomImageryMap;
  } catch (err) {
    console.error('Failed to load custom moments imagery from storage:', err);
    return {};
  }
}

/**
 * Save custom image overrides to localStorage and dispatch event
 */
export function saveCustomImagery(imageryMap: CustomImageryMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(imageryMap));
    window.dispatchEvent(new CustomEvent('lh_moments_updated', { detail: imageryMap }));
  } catch (err) {
    console.error('Failed to save custom moments imagery:', err);
  }
}

/**
 * Update the image for a specific card by its ID (e.g. 'card-01') or momentId (e.g. 'slow_morning')
 */
export function updateCardImage(cardOrMomentId: string, imageUrl: string): void {
  const current = getStoredCustomImagery();
  current[cardOrMomentId] = imageUrl;
  saveCustomImagery(current);
}

const MOMENT_CORRELATIONS: Record<string, string[]> = {
  'card-01': ['card-01', '01', 'slow_morning', 'slow-morning'],
  '01': ['card-01', '01', 'slow_morning', 'slow-morning'],
  'slow_morning': ['card-01', '01', 'slow_morning', 'slow-morning'],
  'slow-morning': ['card-01', '01', 'slow_morning', 'slow-morning'],

  'card-02': ['card-02', '02', 'long_table', 'late-breakfast'],
  '02': ['card-02', '02', 'long_table', 'late-breakfast'],
  'long_table': ['card-02', '02', 'long_table', 'late-breakfast'],
  'late-breakfast': ['card-02', '02', 'long_table', 'late-breakfast'],

  'card-03': ['card-03', '03', 'afternoon_drift', 'barefoot-afternoon'],
  '03': ['card-03', '03', 'afternoon_drift', 'barefoot-afternoon'],
  'afternoon_drift': ['card-03', '03', 'afternoon_drift', 'barefoot-afternoon'],
  'barefoot-afternoon': ['card-03', '03', 'afternoon_drift', 'barefoot-afternoon'],

  'card-04': ['card-04', '04', 'night_swim', 'family-play'],
  '04': ['card-04', '04', 'night_swim', 'family-play'],
  'night_swim': ['card-04', '04', 'night_swim', 'family-play'],
  'family-play': ['card-04', '04', 'night_swim', 'family-play'],

  'card-05': ['card-05', '05', 'fire_conversation', 'the-long-sit'],
  '05': ['card-05', '05', 'fire_conversation', 'the-long-sit'],
  'fire_conversation': ['card-05', '05', 'fire_conversation', 'the-long-sit'],
  'the-long-sit': ['card-05', '05', 'fire_conversation', 'the-long-sit'],

  'card-06': ['card-06', '06', 'silent_reading', 'under-stars'],
  '06': ['card-06', '06', 'silent_reading', 'under-stars'],
  'silent_reading': ['card-06', '06', 'silent_reading', 'under-stars'],
  'under-stars': ['card-06', '06', 'silent_reading', 'under-stars'],
};

/**
 * Remove custom override for a specific card or moment identifier
 */
export function removeMomentImage(cardOrMomentId: string): void {
  const current = getStoredCustomImagery();
  const keysToRemove = MOMENT_CORRELATIONS[cardOrMomentId] || [cardOrMomentId];
  keysToRemove.forEach((key) => {
    delete current[key];
  });
  saveCustomImagery(current);
}

/**
 * Remove custom override for a specific card (alias for removeMomentImage)
 */
export function resetCardImage(cardOrMomentId: string): void {
  removeMomentImage(cardOrMomentId);
}

/**
 * Reset all cards to default (alias for removeAllMomentsImagery)
 */
export function resetAllMomentsImagery(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('lh_moments_updated', { detail: {} }));
  } catch (err) {
    console.error('Failed to clear custom imagery:', err);
  }
}

export function removeAllMomentsImagery(): void {
  resetAllMomentsImagery();
}

/**
 * Compress an uploaded file using an in-memory Canvas to keep base64 strings small
 * (~150-300kb) and prevent hitting browser localStorage 5MB quota.
 */
export function compressImageFile(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP if supported, otherwise JPEG
        let dataUrl = canvas.toDataURL('image/webp', quality);
        if (!dataUrl.startsWith('data:image/webp')) {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Hook to retrieve brand cards with any user custom image overrides merged in
 */
export function useMomentsImagery() {
  const [customMap, setCustomMap] = useState<CustomImageryMap>(() => getStoredCustomImagery());

  useEffect(() => {
    const handleUpdate = () => {
      setCustomMap(getStoredCustomImagery());
    };
    window.addEventListener('lh_moments_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('lh_moments_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const cards: BrandVisualCard[] = BRAND_IDENTITY_CARDS.map((card) => {
    // Check override by card.id, card.number, or card.matchedMomentId
    const override = customMap[card.id] || customMap[card.matchedMomentId] || customMap[card.number];
    if (override) {
      return {
        ...card,
        image: override
      };
    }
    return card;
  });

  const hasAnyCustom = Object.keys(customMap).length > 0;

  return {
    cards,
    customMap,
    hasAnyCustom,
    updateCardImage,
    resetCardImage,
    removeMomentImage,
    resetAllMomentsImagery,
    removeAllMomentsImagery,
  };
}

/**
 * Hook to get Signature Moments merged with any custom uploaded imagery
 */
export function useSignatureMomentsWithCustom(): { moments: SignatureMoment[]; hasAnyCustom: boolean } {
  const { customMap, hasAnyCustom } = useMomentsImagery();

  const moments = signatureMoments.map((moment) => {
    const override =
      customMap[moment.slug] ||
      customMap[moment.key] ||
      customMap[moment.sequence] ||
      customMap[`card-${moment.sequence}`];

    if (override) {
      return {
        ...moment,
        image: override,
      };
    }
    return moment;
  });

  return { moments, hasAnyCustom };
}
