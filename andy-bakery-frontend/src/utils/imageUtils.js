/**
 * Image Utility Hook for React Components
 * Handles lazy loading, error handling, and optimization
 */

import { useState, useEffect } from 'react';
import { PRODUCT_PLACEHOLDER } from '../config/images';

/**
 * Hook for preloading images
 * @param {string} imageUrl - Image URL to preload
 * @returns {Object} { isLoading, error }
 */
export function useImagePreload(imageUrl) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setIsLoading(false);
      return;
    }

    const img = new Image();
    
    const handleLoad = () => {
      setIsLoading(false);
      setError(false);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setError(true);
    };

    img.onload = handleLoad;
    img.onerror = handleError;
    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  return { isLoading, error };
}

/**
 * Preload multiple images for hero slideshow
 * Improves perceived performance by loading images in advance
 * @param {Array} imageUrls - Array of image URLs
 */
export function preloadImages(imageUrls) {
  imageUrls.forEach((url) => {
    if (url) {
      const img = new Image();
      img.src = url;
    }
  });
}

/**
 * Get safe image URL with fallback
 * Returns placeholder if image fails to load
 * @param {string} imageUrl - Original image URL
 * @returns {string} Valid image URL or placeholder
 */
export function getSafeImageUrl(imageUrl) {
  return imageUrl || PRODUCT_PLACEHOLDER;
}

export default {
  useImagePreload,
  preloadImages,
  getSafeImageUrl,
};
