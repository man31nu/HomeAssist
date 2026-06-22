const { SupportTicket } = require('../models');
const apiResponse = require('../utils/apiResponse');

const createTicket = async (req, res, next) => {
  try {
    const { subject, description } = req.body;
    
    const ticket = await SupportTicket.create({
      user_id: req.user.id,
      subject,
      description,
      status: 'open'
    });

    return apiResponse.success(res, 'Support ticket created successfully', ticket, 201);
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    let whereClause = {};
    if (req.user.role.toLowerCase() !== 'admin') {
      whereClause.user_id = req.user.id;
    }

    const tickets = await SupportTicket.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });

    return apiResponse.success(res, 'Tickets fetched successfully', tickets);
  } catch (error) {
    next(error);
  }
};

const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const ticket = await SupportTicket.findByPk(req.params.id);

    if (req.user.role.toLowerCase() !== 'admin') {
      return apiResponse.error(res, 'Not authorized', null, 403);
    }

    if (!ticket) {
      return apiResponse.error(res, 'Ticket not found', null, 404);
    }

    ticket.status = status;
    await ticket.save();

    return apiResponse.success(res, 'Ticket status updated', ticket);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicketStatus
};
