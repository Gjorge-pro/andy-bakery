/**
 * Centralized Image Configuration
 * All images sourced from Cloudinary for consistency and optimization
 * 
 * Cloudinary Folder Structure:
 * - andy-bakery/hero/ → Hero slideshow images
 * - andy-bakery/products/ → Product images (uploaded via backend)
 * - andy-bakery/placeholders/ → Default placeholder images
 * 
 * Optimization Transformations:
 * - f_auto → Auto format conversion (webp, jpg, etc.)
 * - q_auto → Auto quality optimization
 * - c_fill → Fill to exact dimensions
 * - w_1200 → Width optimization
 * 
 * SETUP REQUIRED:
 * 1. Upload 5 hero images to Cloudinary in andy-bakery/hero/ folder:
 *    - cake.jpg, cupcakes.jpg, pizza.jpg, bread.jpg, dessert.jpg
 * 2. Update CLOUDINARY_URL below with your actual cloud name
 * 3. Uncomment HERO_SLIDES_CLOUDINARY and remove _FALLBACK
 */

// Replace 'your-cloud-name' with actual Cloudinary cloud name
const CLOUDINARY_URL = 'https://res.cloudinary.com/your-cloud-name/image/upload';

/**
 * Hero slideshow images - CLOUDINARY VERSION (production ready)
 * Optimized for full-screen display: 1200px width, auto format/quality, fill mode
 * 
 * SETUP: Upload 5 images to Cloudinary before using this
 */
const HERO_SLIDES_CLOUDINARY = [
  {
    url: `${CLOUDINARY_URL}/f_auto,q_auto,c_fill,w_1200/andy-bakery/hero/cake.jpg`,
    alt: 'Premium custom cake',
    category: 'Cakes',
  },
  {
    url: `${CLOUDINARY_URL}/f_auto,q_auto,c_fill,w_1200/andy-bakery/hero/cupcakes.jpg`,
    alt: 'Fresh homemade cupcakes',
    category: 'Cupcakes',
  },
  {
    url: `${CLOUDINARY_URL}/f_auto,q_auto,c_fill,w_1200/andy-bakery/hero/pizza.jpg`,
    alt: 'Artisan crafted pizza',
    category: 'Pizza',
  },
  {
    url: `${CLOUDINARY_URL}/f_auto,q_auto,c_fill,w_1200/andy-bakery/hero/bread.jpg`,
    alt: 'Freshly baked artisan bread',
    category: 'Bread',
  },
  {
    url: `${CLOUDINARY_URL}/f_auto,q_auto,c_fill,w_1200/andy-bakery/hero/dessert.jpg`,
    alt: 'Exquisite dessert collection',
    category: 'Desserts',
  },
];

/**
 * Hero slideshow images - FALLBACK VERSION (temporary during migration)
 * Uses reliable external URLs as fallback
 * Remove this once Cloudinary images are uploaded
 */
const HERO_SLIDES_FALLBACK = [
  {
    url: 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1200&q=80&auto=format',
    alt: 'Premium custom cake',
    category: 'Cakes',
  },
  {
    url: 'https://images.unsplash.com/photo-1558303116-b3a23db14d8c?w=1200&q=80&auto=format',
    alt: 'Fresh homemade cupcakes',
    category: 'Cupcakes',
  },
  {
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80&auto=format',
    alt: 'Artisan crafted pizza',
    category: 'Pizza',
  },
  {
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80&auto=format',
    alt: 'Freshly baked artisan bread',
    category: 'Bread',
  },
  {
    url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80&auto=format',
    alt: 'Exquisite dessert collection',
    category: 'Desserts',
  },
];

/**
 * ACTIVE HERO SLIDES - Switch to CLOUDINARY version once setup is complete
 * For now using FALLBACK to maintain system stability
 */
export const HERO_SLIDES = HERO_SLIDES_FALLBACK;

/**
 * Placeholder image for products with no image
 * 200x200px, auto format/quality
 */
export const PRODUCT_PLACEHOLDER = `${CLOUDINARY_URL}/f_auto,q_auto,w_200,h_200,c_fill/andy-bakery/placeholders/product-placeholder.svg`;

/**
 * Generate optimized Cloudinary URL for product images
 * @param {string} imageUrl - Original image URL (may be Cloudinary or external)
 * @param {Object} options - Image optimization options
 * @returns {string} Optimized image URL
 */
export function getOptimizedImageUrl(imageUrl, options = {}) {
  if (!imageUrl) return PRODUCT_PLACEHOLDER;

  // If already Cloudinary URL, return as-is (already optimized)
  if (imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  // For external URLs, create optimized Cloudinary fetch URL
  const { width = 400, height = 400, quality = 'auto', format = 'auto' } = options;
  const encodedUrl = encodeURIComponent(imageUrl);
  return `${CLOUDINARY_URL}/f_${format},q_${quality},w_${width},h_${height},c_fill/fetch/${encodedUrl}`;
}

/**
 * Generate responsive image URL for different screen sizes
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Desired width in pixels
 * @returns {string} Optimized responsive URL
 */
export function getResponsiveImageUrl(imageUrl, width = 600) {
  if (!imageUrl) return PRODUCT_PLACEHOLDER;

  // Cloudinary fetch URL with responsive sizing
  if (!imageUrl.includes('res.cloudinary.com')) {
    const encodedUrl = encodeURIComponent(imageUrl);
    return `${CLOUDINARY_URL}/f_auto,q_auto,w_${width},c_fill/fetch/${encodedUrl}`;
  }

  return imageUrl;
}

export default {
  HERO_SLIDES,
  PRODUCT_PLACEHOLDER,
  getOptimizedImageUrl,
  getResponsiveImageUrl,
  HERO_SLIDES_CLOUDINARY,
  HERO_SLIDES_FALLBACK,
};
