const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { validate } = require('../middlewares/validate');
const { createTicket, getTickets, updateTicketStatus } = require('../controllers/supportTicketController');
const { protect } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.use(protect);

router.route('/')
  .get(getTickets)
  .post(
    [
      check('subject', 'Subject is required').notEmpty(),
      check('description', 'Description is required').notEmpty()
    ],
    validate,
    createTicket
  );

router.route('/:id/status')
  .put(
    authorizeRoles('Admin'),
    [
      check('status', 'Status is required').isIn(['open', 'in_progress', 'resolved', 'closed'])
    ],
    validate,
    updateTicketStatus
  );

module.exports = router;
