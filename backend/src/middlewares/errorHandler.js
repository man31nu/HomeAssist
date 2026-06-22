const apiResponse = require('../utils/apiResponse');

const globalErrorHandler = (err, req, res, next) => {
  console.error('[Error]:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Specific handling for Sequelize Validation Errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors.map(e => e.message);
    return apiResponse.error(res, 'Validation Error', errors, 400);
  }

  // Handle generic errors
  return apiResponse.error(res, message, process.env.NODE_ENV === 'development' ? err.stack : null, statusCode);
};

module.exports = globalErrorHandler;
