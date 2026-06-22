const { Provider, User, Service } = require('../models');
const apiResponse = require('../utils/apiResponse');

const getProviders = async (req, res, next) => {
  try {
    const providers = await Provider.findAll({
      include: [
        { model: User, attributes: ['id', 'full_name', 'email', 'phone'] },
        { model: Service, attributes: ['id', 'title'] }
      ]
    });
    return apiResponse.success(res, 'Providers fetched successfully', providers);
  } catch (error) {
    next(error);
  }
};

const getProviderById = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'full_name', 'email', 'phone'] },
        { model: Service, attributes: ['id', 'title'] }
      ]
    });
    if (provider) {
      return apiResponse.success(res, 'Provider fetched successfully', provider);
    } else {
      return apiResponse.error(res, 'Provider not found', null, 404);
    }
  } catch (error) {
    next(error);
  }
};

const registerProviderProfile = async (req, res, next) => {
  try {
    const existingProvider = await Provider.findOne({ where: { user_id: req.user.id } });
    if (existingProvider) {
      return apiResponse.error(res, 'Provider profile already exists', null, 400);
    }

    const { experience_years, skills, hourly_rate, service_id } = req.body;

    const service = await Service.findByPk(service_id);
    if (!service) {
      return apiResponse.error(res, 'Service not found', null, 404);
    }

    const provider = await Provider.create({
      user_id: req.user.id,
      service_id,
      experience_years: experience_years || 0,
      skills: skills || null,
      hourly_rate: hourly_rate || null,
      verification_status: 'pending',
    });

    return apiResponse.success(res, 'Provider profile created successfully', provider, 201);
  } catch (error) {
    next(error);
  }
};

const updateProviderProfile = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({ where: { user_id: req.user.id } });
    if (!provider) {
      return apiResponse.error(res, 'Provider profile not found', null, 404);
    }

    const { experience_years, skills, hourly_rate, service_id } = req.body;
    if (experience_years !== undefined) provider.experience_years = experience_years;
    if (skills !== undefined) provider.skills = skills;
    if (hourly_rate !== undefined) provider.hourly_rate = hourly_rate;
    if (service_id !== undefined) provider.service_id = service_id;

    await provider.save();
    return apiResponse.success(res, 'Provider profile updated successfully', provider);
  } catch (error) {
    next(error);
  }
};

const approveProvider = async (req, res, next) => {
  try {
    const provider = await Provider.findByPk(req.params.id);
    if (!provider) {
      return apiResponse.error(res, 'Provider not found', null, 404);
    }
    provider.verification_status = 'verified';
    await provider.save();
    return apiResponse.success(res, 'Provider approved successfully', provider);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProviders,
  getProviderById,
  registerProviderProfile,
  updateProviderProfile,
  approveProvider,
};
