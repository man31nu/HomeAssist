const { Upload } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');
const apiResponse = require('../utils/apiResponse');

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return apiResponse.error(res, 'No file provided', null, 400);
    }

    const { entity_type, entity_id } = req.body;

    const result = await uploadToCloudinary(req.file.buffer, `homeassist/${entity_type || 'misc'}`);

    // Track upload in DB
    const uploadRecord = await Upload.create({
      file_name: req.file.originalname,
      file_url: result.secure_url,
      file_type: req.file.mimetype,
      entity_type: entity_type || 'misc',
      entity_id: entity_id || null
    });

    return apiResponse.success(res, 'File uploaded successfully', uploadRecord, 201);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile
};
