const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a base64 or buffer image to Cloudinary
 * @param {string} fileData - base64 string or file path
 * @param {string} folder - Cloudinary folder name
 * @param {string} publicId - optional public ID
 */
const uploadImage = async (fileData, folder = 'taskr', publicId = null) => {
  const options = {
    folder,
    resource_type: 'image',
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  };
  if (publicId) options.public_id = publicId;

  const result = await cloudinary.uploader.upload(fileData, options);
  return { url: result.secure_url, publicId: result.public_id };
};

/**
 * Delete an image from Cloudinary by public ID
 */
const deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};

/**
 * Upload profile photo with crop transformation
 */
const uploadProfilePhoto = async (fileData, userId) => {
  const result = await cloudinary.uploader.upload(fileData, {
    folder: 'taskr/profiles',
    public_id: `user_${userId}`,
    overwrite: true,
    transformation: [
      { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
  return result.secure_url;
};

/**
 * Upload work sample
 */
const uploadWorkSample = async (fileData, workerId, index) => {
  const result = await cloudinary.uploader.upload(fileData, {
    folder: 'taskr/work-samples',
    public_id: `worker_${workerId}_sample_${index}`,
    overwrite: true,
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto', fetch_format: 'auto' },
    ],
  });
  return result.secure_url;
};

module.exports = { uploadImage, deleteImage, uploadProfilePhoto, uploadWorkSample };
