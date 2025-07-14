const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gym-members', // optional folder name
    allowed_formats: ['jpg', 'png', 'jpeg','webp'],
  },
});

const upload = multer({ storage });

module.exports = upload;
