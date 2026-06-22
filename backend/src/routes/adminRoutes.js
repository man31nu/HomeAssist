const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateProviderCategory } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.use(protect, authorizeRoles('Admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.post('/provider/:id/category', updateProviderCategory);

module.exports = router;
