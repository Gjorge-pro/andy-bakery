const errorMiddleware = (error, req, res, next) => {
  if (
    error.code === 'LIMIT_FILE_SIZE' ||
    error.message === 'Invalid file type or file too large'
  ) {
    return res.status(400).json({
      message: 'Invalid file type or file too large',
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: error.message || 'Internal Server Error',
  });
};

module.exports = errorMiddleware;
