const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  createOrder,
  getOrders,
  trackOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.post(
  '/',
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required').isLength({ min: 2 }).withMessage('Customer name must be at least 2 characters'),
    body('customerEmail').isEmail().withMessage('Customer email must be valid'),
    body('customerPhone').trim().notEmpty().withMessage('Customer phone is required').isLength({ min: 9 }).withMessage('Customer phone must be at least 9 characters'),
    body('deliveryAddress').trim().notEmpty().withMessage('Delivery address is required'),
    body('orderItems').isArray({ min: 1 }).withMessage('Order items must be a non-empty array'),
    body('orderItems.*.productId').trim().notEmpty().withMessage('Product ID is required for each item'),
    body('orderItems.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be an integer greater than 0'),
  ],
  validate,
  createOrder
);
router.get('/track', trackOrders);
router.get('/', authMiddleware, getOrders);
router.get('/:id', authMiddleware, getOrderById);
router.put('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;
