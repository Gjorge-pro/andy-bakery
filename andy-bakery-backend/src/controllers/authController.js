const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const generateToken = require('../utils/generateToken');
const prisma = require('../db/prisma');
const MIN_PASSWORD_LENGTH = 8;

const sendValidationErrors = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return true;
  }

  return false;
};

const loginAdmin = async (req, res, next) => {
  try {
    if (sendValidationErrors(req, res)) return;

    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.json({
      id: admin.id,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Current password and new password are required');
    }

    if (newPassword.length < MIN_PASSWORD_LENGTH) {
      res.status(400);
      throw new Error('Password must be at least 8 characters');
    }

    const admin = await prisma.admin.findUnique({
      where: { id: req.user.id },
    });

    if (!admin || !(await bcrypt.compare(currentPassword, admin.password))) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword },
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  changePassword,
  loginAdmin,
};
