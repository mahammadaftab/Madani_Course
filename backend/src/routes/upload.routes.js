const express = require('express');
const { uploadImage } = require('../controllers/upload.controller');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, admin, uploadImage);

module.exports = router;