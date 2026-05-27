/**
 * Email Service Utility
 * Handles all email sending for Andy Bakery
 * Production-ready with Render compatibility
 */

const nodemailer = require('nodemailer');
const { formatCurrency } = require('../utils/currency');

/**
 * Gmail SMTP Configuration - Production Ready
 * - Uses port 587 (TLS) instead of 465 (SSL)
 * - Render compatible (SSL/465 fails in Render environment)
 * - Requires Gmail App Password (not regular Gmail password)
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // TLS port - works on Render
    secure: false, // STARTTLS instead of SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Timeouts for Render reliability
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
    dnsTimeout: 20000,
  });
};

// Initialize transporter
let transporter = null;
let isEmailConfigured = false;
let verificationAttempted = false;

/**
 * Initialize email service on startup
 * Verifies SMTP connection and logs configuration
 */
const initializeEmailService = async () => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn(
        '⚠️ Email service: Missing EMAIL_USER or EMAIL_PASS environment variables'
      );
      isEmailConfigured = false;
      verificationAttempted = true;
      return false;
    }

    console.log('📧 Initializing email service...');
    console.log(`   User: ${process.env.EMAIL_USER}`);
    console.log('   Host: smtp.gmail.com');
    console.log('   Port: 587 (TLS)');

    // Create transporter
    transporter = createTransporter();

    // Verify SMTP connection
    const verified = await transporter.verify();

    if (verified) {
      console.log('✅ Email service ready - SMTP verified');
      isEmailConfigured = true;
    } else {
      console.warn('⚠️ Email service: SMTP verification returned false');
      isEmailConfigured = false;
    }

    verificationAttempted = true;
    return verified;
  } catch (error) {
    console.error('❌ Email service initialization failed:', error.message);
    console.error('   Error code:', error.code);
    console.error('   Suggestion: Verify EMAIL_USER and EMAIL_PASS are set correctly');
    console.error('   Note: Must use Gmail App Password, not regular Gmail password');

    isEmailConfigured = false;
    verificationAttempted = true;
    return false;
  }
};

/**
 * Format order items for email display
 */
const formatOrderItems = (orderItems) => {
  return orderItems
    .map((item) => {
      const productName = item.product?.name || 'Bakery item';
      const lineTotal = item.quantity * item.unitPrice;
      return `${productName} x ${item.quantity} - ${formatCurrency(lineTotal)}`;
    })
    .join('\n');
};

/**
 * Send order confirmation email to customer
 * Non-blocking - doesn't prevent order creation if it fails
 */
const sendOrderConfirmationEmail = async (order) => {
  try {
    // Skip if email not configured
    if (!isEmailConfigured || !transporter) {
      console.log('ℹ️  Email skipped: Service not configured');
      return false;
    }

    // Skip if customer email missing
    if (!order.customerEmail) {
      console.log('ℹ️  Email skipped: No customer email');
      return false;
    }

    const mailOptions = {
      from: `"Andy Bakery" <${process.env.EMAIL_USER}>`,
      to: order.customerEmail,
      subject: 'Order Confirmed — Andy Bakery 🍰',
      text: [
        `Hi ${order.customerName},`,
        '',
        'Thank you for your order from Andy Bakery!',
        '',
        'Order Details:',
        '─────────────────',
        formatOrderItems(order.orderItems),
        '─────────────────',
        `Total: ${formatCurrency(order.totalPrice)}`,
        '',
        `Delivery Address:`,
        order.deliveryAddress,
        '',
        'We will contact you soon with delivery details.',
        '',
        'Thank you for supporting Andy Bakery! 🍰',
        '',
        `Order ID: ${order.id}`,
      ].join('\n'),
    };

    // Send with timeout
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email sending timeout')), 10000)
      ),
    ]);

    console.log(`✅ Order confirmation email sent to ${order.customerEmail}`);
    return true;
  } catch (error) {
    console.error(
      `⚠️  Failed to send confirmation email to ${order.customerEmail}:`,
      error.message
    );
    // Don't throw - email failure shouldn't break order creation
    return false;
  }
};

/**
 * Send admin notification email
 * Alerts admin to new orders
 */
const sendAdminNotificationEmail = async (order) => {
  try {
    // Skip if email not configured
    if (!isEmailConfigured || !transporter || !process.env.EMAIL_USER) {
      return false;
    }

    const mailOptions = {
      from: `"Andy Bakery System" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to admin
      subject: `New Order #${order.id.substring(0, 8)} — Andy Bakery`,
      text: [
        'New order received!',
        '',
        `Customer: ${order.customerName}`,
        `Email: ${order.customerEmail}`,
        `Phone: ${order.customerPhone}`,
        `Delivery: ${order.deliveryAddress}`,
        '',
        'Items:',
        formatOrderItems(order.orderItems),
        '',
        `Total: ${formatCurrency(order.totalPrice)}`,
        `Status: ${order.status}`,
        '',
        `Order ID: ${order.id}`,
      ].join('\n'),
    };

    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Admin email timeout')), 10000)
      ),
    ]);

    console.log(`✅ Admin notification sent for order ${order.id}`);
    return true;
  } catch (error) {
    console.error('⚠️  Failed to send admin notification:', error.message);
    return false;
  }
};

/**
 * Get email service status
 */
const getEmailServiceStatus = () => {
  return {
    configured: isEmailConfigured,
    verified: verificationAttempted,
    transporderReady: !!transporter,
  };
};

module.exports = {
  initializeEmailService,
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
  getEmailServiceStatus,
};
