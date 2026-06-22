const express = require('express');
const router = express.Router();
const { 
  getProviders, 
  getProviderById, 
  registerProviderProfile, 
  updateProviderProfile,
  approveProvider
} = require('../controllers/providerController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.route('/')
  .get(getProviders) // Public can view providers
  .post(protect, registerProviderProfile);

router.route('/profile')
  .put(protect, authorizeRoles('Provider'), updateProviderProfile);

router.route('/:id')
  .get(getProviderById);

router.route('/:id/approve')
  .put(protect, authorizeRoles('Admin'), approveProvider);

module.exports = router;
