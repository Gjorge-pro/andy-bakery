/**
 * DEVELOPER QUICK REFERENCE - Image System
 * 
 * Copy-paste examples for common image tasks
 */

// ============================================
// 1. HERO SLIDESHOW (Already Implemented)
// ============================================

import { HERO_SLIDES } from '../config/images';

// Access slides
HERO_SLIDES.forEach(slide => {
  console.log(slide.url);    // Full optimized URL
  console.log(slide.alt);    // Alt text
  console.log(slide.category); // Category name
});

// In component:
{HERO_SLIDES.map((slide, index) => (
  <img key={index} src={slide.url} alt={slide.alt} />
))}


// ============================================
// 2. PRODUCT IMAGES (Coming from Backend)
// ============================================

// Already implemented in ProductCard.jsx
// Just use product.imageUrl from API response
<img src={product.imageUrl} alt={product.name} />


// ============================================
// 3. OPTIMIZE EXTERNAL IMAGES
// ============================================

import { getOptimizedImageUrl } from '../config/images';

// Optimize any image URL
const optimizedUrl = getOptimizedImageUrl(
  'https://example.com/my-image.jpg',
  { width: 500, height: 500, quality: 'auto' }
);

<img src={optimizedUrl} alt="My image" />


// ============================================
// 4. RESPONSIVE IMAGES
// ============================================

import { getResponsiveImageUrl } from '../config/images';

// Create responsive URL for different screen sizes
const mobileUrl = getResponsiveImageUrl(imageUrl, 400);
const tabletUrl = getResponsiveImageUrl(imageUrl, 800);
const desktopUrl = getResponsiveImageUrl(imageUrl, 1200);


// ============================================
// 5. PRELOAD IMAGES FOR PERFORMANCE
// ============================================

import { preloadImages } from '../utils/imageUtils';

useEffect(() => {
  // Preload all hero images on page mount
  const imageUrls = HERO_SLIDES.map(slide => slide.url);
  preloadImages(imageUrls);
}, []);


// ============================================
// 6. SAFE IMAGE FALLBACK
// ============================================

import { getSafeImageUrl } from '../utils/imageUtils';

// Always has a fallback if image is missing
const safeUrl = getSafeImageUrl(maybeUndefinedUrl);
<img src={safeUrl} alt="Fallback safe" />


// ============================================
// 7. DETECT IMAGE LOAD STATUS
// ============================================

import { useImagePreload } from '../utils/imageUtils';

export function MyComponent({ imageUrl }) {
  const { isLoading, error } = useImagePreload(imageUrl);

  return (
    <>
      {isLoading && <p>Loading image...</p>}
      {error && <p>Image failed to load</p>}
      {!isLoading && !error && (
        <img src={imageUrl} alt="Successfully loaded" />
      )}
    </>
  );
}


// ============================================
// 8. BACKEND - GENERATE OPTIMIZED URL
// ============================================

const { getOptimizedProductImageUrl } = require('../utils/imageOptimization');

// In productController.js
const optimizedUrl = getOptimizedProductImageUrl(imageUrl);
res.json({ imageUrl: optimizedUrl });


// ============================================
// 9. CLOUDINARY FETCH URL (Advanced)
// ============================================

// Use Cloudinary's fetch transformation for any external image
const fetchUrl = `https://res.cloudinary.com/{cloud}/image/upload/f_auto,q_auto,w_400/${encodeURIComponent(externalImageUrl)}`;


// ============================================
// 10. MANUAL CLOUDINARY URL CONSTRUCTION
// ============================================

// Build custom Cloudinary URLs
const cloudinaryBaseUrl = 'https://res.cloudinary.com/your-cloud-name/image/upload';

// Optimization parameters:
// f_auto    = Auto format (webp, jpg, etc)
// q_auto    = Auto quality
// w_1200    = Width 1200px
// h_800     = Height 800px
// c_fill    = Fill mode (crop to fit)
// r_20      = Border radius 20px
// e_blur:300 = Blur effect

const customUrl = `${cloudinaryBaseUrl}/f_auto,q_auto,w_1200,r_20/andy-bakery/products/my-image.jpg`;


// ============================================
// MIGRATION CHECKLIST
// ============================================

/*
☐ Replace placeholder cloud name with your actual cloud name
☐ Upload 5 hero images to andy-bakery/hero/ folder on Cloudinary
☐ Verify image paths match:
  - cake.jpg
  - cupcakes.jpg  
  - pizza.jpg
  - bread.jpg
  - dessert.jpg
☐ Update src/config/images.js:
  - CLOUDINARY_URL with your cloud name
  - Export HERO_SLIDES_CLOUDINARY instead of _FALLBACK
☐ Run: npm run build
☐ Test: Hero slideshow displays Cloudinary images
☐ Deploy: Push to production
☐ Monitor: Check Cloudinary analytics for image delivery
*/
