const express = require('express');
const { login, register, getMe, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Add a test route
router.get('/test', (req, res) => {
  console.log('[AUTH] Test endpoint hit');
  res.json({ message: 'Auth routes are working' });
});

router.post('/login', login);
router.post('/register', register);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;