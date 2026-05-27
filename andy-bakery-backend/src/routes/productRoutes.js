const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const { cloudinaryUpload } = require('../middleware/cloudinaryMiddleware');
const { body } = require('express-validator');
const validate = require('../middleware/validate');

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

/**
 * Allowed image types for file validation
 */
const allowedMimeTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

/**
 * File validation callback
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
 * Multer configuration - store in memory for Cloudinary upload
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter,
});

const router = express.Router();

// ── Product routes ────────────────────────────────────────────────

/**
 * POST /api/products
 * Create new product with optional image upload
 * Middleware chain:
 *   1. authMiddleware - verify admin token
 *   2. upload.single('image') - parse multipart form (multer)
 *   3. cloudinaryUpload - upload to Cloudinary if image provided
 *   4. validate - check required fields
 *   5. createProduct - create in database
 */
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  cloudinaryUpload,
  [
    body('name').trim().notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').trim().notEmpty().withMessage('Category is required'),
  ],
  validate,
  createProduct
);

/**
 * GET /api/products
 * Get all products (public endpoint)
 */
router.get('/', getProducts);

/**
 * PUT /api/products/:id
 * Update product with optional image replacement
 */
router.put(
  '/:id',
  authMiddleware,
  upload.single('image'),
  cloudinaryUpload,
  updateProduct
);

/**
 * DELETE /api/products/:id
 * Delete product
 */
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;