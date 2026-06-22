const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { 
  getCategories,
  getServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService 
} = require('../controllers/serviceController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// Categories
router.get('/categories', getCategories);

// Services
router.route('/')
  .get(getServices)
  .post(
    protect, 
    authorizeRoles('Admin'), 
    [
      check('name', 'Name is required').notEmpty(),
      check('basePrice', 'Base price must be a number').isNumeric(),
      check('categoryId', 'Category ID is required').isNumeric()
    ],
    validate,
    createService
  );

router.route('/:id')
  .get(getServiceById)
  .put(protect, authorizeRoles('Admin'), updateService)
  .delete(protect, authorizeRoles('Admin'), deleteService);

module.exports = router;
