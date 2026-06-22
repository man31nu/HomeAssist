const { validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');

const validate = (req, res, next) => {
  console.log('Validating body:', req.body);
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path || err.param]: err.msg }));

  return apiResponse.error(res, 'Validation Failed', extractedErrors, 422);
};

module.exports = { validate };
