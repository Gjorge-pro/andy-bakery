/**
 * Cloudinary upload middleware
 * Uploads file buffer to Cloudinary and attaches URL to req.body
 */

const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file buffer to Cloudinary
 * Resolves with secure_url or rejects with error
 */
const uploadBufferToCloudinary = (fileBuffer, folder = 'andy-bakery/products') => {
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
        if (error) {
          console.error('❌ Cloudinary upload error:', error.message);
          return reject(error);
        }
        console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

/**
 * Middleware: Upload file to Cloudinary after multer processes it
 */
const cloudinaryUpload = async (req, res, next) => {
  try {
    // If no file was uploaded, skip to next middleware
    if (!req.file) {
      console.log('ℹ️  No image file provided in request');
      return next();
    }

    console.log('📁 Processing uploaded file:', req.file.originalname);

    // Upload buffer to Cloudinary
    const secureUrl = await uploadBufferToCloudinary(
      req.file.buffer,
      'andy-bakery/products'
    );

    // Attach Cloudinary URL to req.body so controller can access it
    req.body.imageUrl = secureUrl;
    console.log('✅ File attached to request as imageUrl');

    next();
  } catch (error) {
    console.error('❌ Cloudinary middleware error:', error);
    return res.status(400).json({
      message: 'Image upload to Cloudinary failed: ' + error.message,
    });
  }
};

module.exports = {
  cloudinaryUpload,
  uploadBufferToCloudinary,
};
