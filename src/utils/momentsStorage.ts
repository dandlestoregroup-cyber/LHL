import { useState, useEffect } from 'react';
import { BRAND_IDENTITY_CARDS, BrandVisualCard } from '../data/brandIdentityCards';

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

/**
 * Remove custom override for a specific card
 */
export function resetCardImage(cardOrMomentId: string): void {
  const current = getStoredCustomImagery();
  delete current[cardOrMomentId];
  saveCustomImagery(current);
}

/**
 * Reset all cards to default
 */
export function resetAllMomentsImagery(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('lh_moments_updated', { detail: {} }));
  } catch (err) {
    console.error('Failed to clear custom imagery:', err);
  }
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
    resetAllMomentsImagery
  };
}
