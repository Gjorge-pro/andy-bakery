const prisma = require('../db/prisma');

const parseBoolean = (value) => {
  if (value === undefined) return undefined;
  if (typeof value === 'boolean') return value;
  return value === 'true';
};

const getProducts = async (req, res, next) => {
  try {
    console.log('📦 [GET /api/products] Fetching products...');
    
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    console.log(`✅ [GET /api/products] Found ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('❌ [GET /api/products] Error:', error.message);
    console.error('Stack:', error.stack);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, category, isAvailable } = req.body;
    const uploadedImageUrl = req.file ? req.file.path : imageUrl;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl: uploadedImageUrl,
        category,
        isAvailable: parseBoolean(isAvailable),
      },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, imageUrl, category, isAvailable } = req.body;
    const uploadedImageUrl = req.file ? req.file.path : imageUrl;

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name,
        description,
        price: price === undefined ? undefined : Number(price),
        imageUrl: uploadedImageUrl,
        category,
        isAvailable: parseBoolean(isAvailable),
      },
    });

    res.json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
