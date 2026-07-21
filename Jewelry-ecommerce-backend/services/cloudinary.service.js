const cloudinary = require("../utils/cloudinary");
const { Readable } = require('stream');

// cloudinary Image Upload (using authenticated upload with folder)
const cloudinaryImageUpload = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'harene-diamonds', resource_type: 'auto' },
      (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    const bufferStream = new Readable();
    bufferStream.push(imageBuffer);
    bufferStream.push(null);

    bufferStream.pipe(uploadStream);
  });
};

// cloudinaryImageDelete
const cloudinaryImageDelete = async (public_id) => {
  const deletionResult = await cloudinary.uploader.destroy(public_id);
  return deletionResult;
};

exports.cloudinaryServices = {
  cloudinaryImageDelete,
  cloudinaryImageUpload,
};
