const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Cloudinary folder structure:
 * - andy-bakery/products/ → Product images
 * - andy-bakery/hero/ → Hero slideshow (manually uploaded)
 * - andy-bakery/admins/ → Admin profile photos
 * - andy-bakery/placeholders/ → Default placeholder images
 */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'andy-bakery/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Cloudinary optimization applied at upload
    transformation: [
      { quality: 'auto', fetch_format: 'auto' }
    ],
  },
});

const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type. Only JPEG, PNG, and WebP allowed.');
    error.statusCode = 400;
    return cb(error);
  }

  return cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});

module.exports = { cloudinary, upload };
