const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const {
  changePassword,
  loginAdmin,
} = require('../controllers/authController');

const router = express.Router();
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  loginAdmin
);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
