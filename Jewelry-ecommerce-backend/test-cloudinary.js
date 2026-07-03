const cloudinary = require('./utils/cloudinary');
const { secret } = require('./config/secret');

console.log('Cloudinary config:', {
  cloud_name: secret.cloudinary_name,
  api_key: secret.cloudinary_api_key,
  api_secret: secret.cloudinary_api_secret ? 'SET' : 'MISSING',
  upload_preset: secret.cloudinary_upload_preset
});

// Test a simple ping to Cloudinary
cloudinary.api.ping()
  .then(r => console.log('Cloudinary ping SUCCESS:', r))
  .catch(e => console.error('Cloudinary ping ERROR:', e.message, e.http_code));
