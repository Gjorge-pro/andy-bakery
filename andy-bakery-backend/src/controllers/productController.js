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
    console.log('🆕 [POST /api/products] Creating product...');
    
    const { name, description, price, imageUrl, category, isAvailable } = req.body;

    // Validate imageUrl exists (required for new products)
    if (!imageUrl) {
      console.warn('⚠️  Missing imageUrl in request');
      res.status(400);
      throw new Error('Image is required to create a product');
    }

    console.log(`📷 Image URL: ${imageUrl.substring(0, 50)}...`);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl,
        category,
        isAvailable: parseBoolean(isAvailable),
      },
    });

    console.log(`✅ [POST /api/products] Product created:`, product.id);
    res.status(201).json(product);
  } catch (error) {
    console.error('❌ [POST /api/products] Error:', error.message);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    console.log(`📝 [PUT /api/products/${req.params.id}] Updating product...`);
    
    const { name, description, price, imageUrl, category, isAvailable } = req.body;

    // Build update data - only include imageUrl if provided
    const updateData = {
      ...(name && { name }),
      ...(description && { description }),
      ...(price !== undefined && { price: Number(price) }),
      ...(imageUrl && { imageUrl }),
      ...(category && { category }),
      ...(isAvailable !== undefined && { isAvailable: parseBoolean(isAvailable) }),
    };

    // If no fields to update, reject
    if (Object.keys(updateData).length === 0) {
      res.status(400);
      throw new Error('No fields to update');
    }

    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: updateData,
    });

    console.log(`✅ [PUT /api/products/${req.params.id}] Product updated`);
    res.json(product);
  } catch (error) {
    console.error(`❌ [PUT /api/products/${req.params.id}] Error:`, error.message);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    console.log(`🗑️  [DELETE /api/products/${req.params.id}] Deleting product...`);
    
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    console.log(`✅ [DELETE /api/products/${req.params.id}] Product deleted`);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error(`❌ [DELETE /api/products/${req.params.id}] Error:`, error.message);
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
