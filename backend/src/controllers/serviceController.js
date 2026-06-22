const { Service, ServiceCategory } = require('../models');
const apiResponse = require('../utils/apiResponse');

const getCategories = async (req, res, next) => {
  try {
    const categories = await ServiceCategory.findAll();
    return apiResponse.success(res, 'Categories fetched successfully', categories);
  } catch (error) {
    next(error);
  }
};

const getServices = async (req, res, next) => {
  try {
    const services = await Service.findAll({
      include: [
        { model: ServiceCategory, attributes: ['id', 'name', 'description'] }
      ]
    });
    return apiResponse.success(res, 'Services fetched successfully', services);
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id, {
      include: [
        { model: ServiceCategory, attributes: ['id', 'name'] }
      ]
    });

    if (!service) {
      return apiResponse.error(res, 'Service not found', null, 404);
    }

    return apiResponse.success(res, 'Service fetched successfully', service);
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const { title, description, category_id, base_price, estimated_duration } = req.body;

    const category = await ServiceCategory.findByPk(category_id);
    if (!category) {
      return apiResponse.error(res, 'Invalid Category ID', null, 400);
    }

    const service = await Service.create({
      title,
      description,
      category_id,
      base_price,
      estimated_duration: estimated_duration || null,
      status: 'active',
    });
    return apiResponse.success(res, 'Service created successfully', service, 201);
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return apiResponse.error(res, 'Service not found', null, 404);
    }

    const { title, description, category_id, base_price, estimated_duration, status } = req.body;
    if (title !== undefined) service.title = title;
    if (description !== undefined) service.description = description;
    if (category_id !== undefined) service.category_id = category_id;
    if (base_price !== undefined) service.base_price = base_price;
    if (estimated_duration !== undefined) service.estimated_duration = estimated_duration;
    if (status !== undefined) service.status = status;

    await service.save();
    return apiResponse.success(res, 'Service updated successfully', service);
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByPk(req.params.id);
    if (!service) {
      return apiResponse.error(res, 'Service not found', null, 404);
    }

    await service.destroy();
    return apiResponse.success(res, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
