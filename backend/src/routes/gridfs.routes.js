const express = require('express');
const { uploadFile, getFile, deleteFile } = require('../controllers/gridfs.controller');
const { protect, admin } = require('../middleware/auth.middleware');
const multer = require('multer');

// Configure multer for GridFS uploads (in memory)
const storage = multer.memoryStorage();
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

const router = express.Router();

// Upload file
router.post('/', protect, admin, uploadSingle, uploadFile);

// Get file
router.get('/:id', getFile);

// Delete file
router.delete('/:id', protect, admin, deleteFile);

module.exports = router;