// server.js — Entry point for Andy Bakery Express server
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { setIO } = require('./src/socket/socketInstance');
const helmet  = require('helmet');
const morgan  = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes    = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const orderRoutes   = require('./src/routes/orderRoutes');
const errorMiddleware = require('./src/middleware/errorMiddleware');

const app  = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL,
        'http://localhost:5173',
        'http://localhost:5174',
        'https://andy-bakery.vercel.app'
      ],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});
setIO(io);

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later' },
});

// ── Core Middleware ───────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'https://andy-bakery.vercel.app'
  ],
  credentials: true
}))
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Routes ────────────────────────────────────────────────────────
app.use('/api/auth/login', loginLimiter);
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);

// ── Health check ─────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Andy Bakery API is running 🎂' });
});

// ── Error Middleware (must be last) ───────────────────────────────
app.use(errorMiddleware);

// ── Start Server ─────────────────────────────────────────────────
const prisma = require('./src/db/prisma');
const { initializeEmailService } = require('./src/utils/emailService');

async function startServer() {
  try {
    // Test database connection
    console.log('🔍 Testing database connection...');
    await prisma.$executeRaw`SELECT 1`;
    console.log('✅ Database connected successfully');
    
    // Check products table
    const productCount = await prisma.product.count();
    console.log(`✅ Products table ready (${productCount} products)`);
    
    // Initialize email service
    console.log('');
    await initializeEmailService();
    console.log('');
    
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📍 API Base: http://localhost:${PORT}/api`);
      console.log(`🛍️  Products: http://localhost:${PORT}/api/products`);
      console.log(`📧 Email service: Ready for notifications`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('Make sure DATABASE_URL is set and database is accessible');
    process.exit(1);
  }
}
    process.exit(1);
  }
}

startServer();
