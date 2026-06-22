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
    const { title, name, description, category_id, categoryId, base_price, basePrice, estimated_duration, estimatedDuration } = req.body;

    const actualCategoryId = category_id || categoryId;
    const category = await ServiceCategory.findByPk(actualCategoryId);
    if (!category) {
      return apiResponse.error(res, 'Invalid Category ID', null, 400);
    }

    const service = await Service.create({
      title: title || name,
      description,
      category_id: actualCategoryId,
      base_price: base_price !== undefined ? base_price : basePrice,
      estimated_duration: estimated_duration !== undefined ? estimated_duration : (estimatedDuration || null),
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

    const { title, name, description, category_id, categoryId, base_price, basePrice, estimated_duration, estimatedDuration, status } = req.body;
    
    const newTitle = title || name;
    const newCategoryId = category_id || categoryId;
    const newBasePrice = base_price !== undefined ? base_price : basePrice;
    const newEstimatedDuration = estimated_duration !== undefined ? estimated_duration : estimatedDuration;

    if (newTitle !== undefined) service.title = newTitle;
    if (description !== undefined) service.description = description;
    if (newCategoryId !== undefined) service.category_id = newCategoryId;
    if (newBasePrice !== undefined) service.base_price = newBasePrice;
    if (newEstimatedDuration !== undefined) service.estimated_duration = newEstimatedDuration;
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
