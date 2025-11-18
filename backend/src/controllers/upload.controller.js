const multer = require('multer');
const path = require('path');
const logger = require('../utils/logger');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  // Accept images only
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const uploadSingle = upload.single('image');

const uploadImage = (req, res) => {
  uploadSingle(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        logger.warn('File upload error: File size too large');
        return res.status(400).json({ message: 'File size too large. Maximum 5MB allowed.' });
      }
      logger.error('Multer error:', error);
      return res.status(400).json({ message: error.message });
    } else if (error) {
      logger.error('File upload error:', error);
      return res.status(400).json({ message: error.message });
    }

    // If no file was uploaded
    if (!req.file) {
      logger.warn('File upload error: No file uploaded');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    logger.info(`File uploaded successfully: ${req.file.filename}`);
    
    // Return file info
    res.status(200).json({
      success: true,
      data: {
        id: req.file.filename,
        url: `/uploads/${req.file.filename}`
      }
    });
  });
};

module.exports = { uploadImage };