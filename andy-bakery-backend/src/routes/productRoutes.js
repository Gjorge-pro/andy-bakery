const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Allowed image types
 */
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/**
 * File validation
 */
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    const error = new Error(
      'Invalid file type. Only JPEG, PNG, and WebP allowed.'
    );

    error.statusCode = 400;
    return cb(error, false);
  }

  cb(null, true);
};

/**
 * Multer memory storage
 */
const storage = multer.memoryStorage();

/**
 * Multer upload middleware
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

/**
 * Upload buffer to Cloudinary
 */
const uploadToCloudinary = (fileBuffer, folder = 'andy-bakery/products') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          {
            quality: 'auto',
            fetch_format: 'auto',
          },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

// ── Import product controller ─────────────────────────────────────
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// ── Create router ─────────────────────────────────────────────────
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const router = express.Router();

// ── Product routes ────────────────────────────────────────────────
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
  ],
  validate,
  createProduct
);

router.get('/', getProducts);
router.put('/:id', authMiddleware, upload.single('image'), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;