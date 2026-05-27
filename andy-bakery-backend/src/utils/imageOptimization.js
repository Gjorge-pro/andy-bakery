/**
 * Backend Image Utility
 * Generates optimized Cloudinary URLs for images
 * Ensures consistent image optimization across the application
 */

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_BASE_URL = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

/**
 * Generate optimized product image URL
 * @param {string} imageUrl - Original Cloudinary image URL or public_id
 * @returns {string} Optimized image URL with transformations
 */
function getOptimizedProductImageUrl(imageUrl) {
  if (!imageUrl) return null;

  // If already a full URL, return as-is (already optimized)
  if (imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  // If it's a public_id, construct optimized URL with transformations
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto,w_400,h_400,c_fill/${imageUrl}`;
}

/**
 * Generate responsive product image URL for different screen sizes
 * @param {string} imageUrl - Original image URL
 * @param {number} width - Desired width in pixels
 * @returns {string} Optimized responsive URL
 */
function getResponsiveImageUrl(imageUrl, width = 600) {
  if (!imageUrl) return null;

  if (imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto,w_${width},c_fill/${imageUrl}`;
}

/**
 * Generate thumbnail image URL for product listings
 * @param {string} imageUrl - Original image URL
 * @returns {string} Thumbnail URL (200x200)
 */
function getThumbnailUrl(imageUrl) {
  if (!imageUrl) return null;

  if (imageUrl.includes('res.cloudinary.com')) {
    return imageUrl;
  }

  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto,w_200,h_200,c_fill/${imageUrl}`;
}

module.exports = {
  getOptimizedProductImageUrl,
  getResponsiveImageUrl,
  getThumbnailUrl,
  CLOUDINARY_BASE_URL,
};
