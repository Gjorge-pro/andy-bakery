const { validationResult } = require('express-validator');
const prisma = require('../db/prisma');
const { getIO } = require('../socket/socketInstance');
const EVENTS = require('../../socket/socketHandlers');
const {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
} = require('../utils/emailService');

const allowedTransitions = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [],
  CANCELLED: [],
};

const orderInclude = {
  orderItems: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  },
};

// ================= FORMAT HELPERS =================


const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      orderItems,
    } = req.body;

    if (!Array.isArray(orderItems) || orderItems.length === 0) {
      res.status(400);
      throw new Error('Order items are required');
    }

    const order = await prisma.$transaction(async (tx) => {
      const productIds = orderItems.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
        },
        select: {
          id: true,
          price: true,
        },
      });

      if (products.length !== productIds.length) {
        res.status(400);
        throw new Error('One or more products not found');
      }

      const productPriceById = new Map(
        products.map((product) => [product.id, product.price])
      );

      const items = orderItems.map((item) => {
        const unitPrice = productPriceById.get(item.productId);

        if (unitPrice === undefined || unitPrice === null) {
          throw new Error(
            `Product not found for order item: ${item.productId}`
          );
        }

        return {
          productId: item.productId,
          quantity: Number(item.quantity),
          unitPrice: Number(unitPrice),
        };
      });

      const calculatedTotal = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
      );

      return tx.order.create({
        data: {
          customerName,
          customerPhone,
          customerEmail,
          deliveryAddress,
          totalPrice: calculatedTotal,

          orderItems: {
            create: items,
          },
        },

        include: orderInclude,
      });
    });

       // Email runs in background so order creation stays fast
    sendOrderConfirmationEmail(order).catch((err) => {
      console.error('Background email task failed:', err.message);
    });

    sendAdminNotificationEmail(order).catch((err) => {
      console.error('Background admin email failed:', err.message);
    });

    const io = getIO();

    if (io) {
      io.emit(EVENTS.NEW_ORDER, order);

      io.emit(EVENTS.NEW_NOTIFICATION, {
        message: `🔔 New order from ${order.customerName}`,
      });
    }

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// ================= GET ORDERS =================

const getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// ================= TRACK ORDERS =================

const trackOrders = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      res.status(400);
      throw new Error('Email is required');
    }

    const orders = await prisma.order.findMany({
      where: {
        customerEmail: {
          equals: email,
          mode: 'insensitive',
        },
      },

      include: orderInclude,
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// ================= GET ORDER BY ID =================

const getOrderById = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },

      include: orderInclude,
    });

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

// ================= UPDATE STATUS =================

const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      res.status(400);
      throw new Error('Status is required');
    }

    const currentOrder = await prisma.order.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!currentOrder) {
      res.status(404);
      throw new Error('Order not found');
    }

    const allowed = allowedTransitions[currentOrder.status];

    if (!allowed.includes(status)) {
      res.status(400);

      throw new Error(
        `Cannot change status from ${currentOrder.status} to ${status}`
      );
    }

    const order = await prisma.order.update({
      where: {
        id: req.params.id,
      },

      data: {
        status,
      },

      include: orderInclude,
    });

    const io = getIO();

    if (io) {
      io.emit(EVENTS.ORDER_UPDATED, order);

      io.emit(EVENTS.NEW_NOTIFICATION, {
        message: `🔔 Order status updated to ${order.status}`,
      });
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  trackOrders,
  getOrderById,
  updateOrderStatus,
};