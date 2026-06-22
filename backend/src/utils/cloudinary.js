const cloudinary = require('cloudinary').v2;

// Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud_name', 
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_api_key', 
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_api_secret'
});

const uploadToCloudinary = async (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    // If not configured, return a mock URL
    if (process.env.CLOUDINARY_CLOUD_NAME === undefined) {
      console.warn('[Cloudinary Mock]: Uploading mock file');
      return resolve({
        secure_url: 'https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg',
        public_id: 'mock_public_id_' + Date.now()
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = { uploadToCloudinary };
