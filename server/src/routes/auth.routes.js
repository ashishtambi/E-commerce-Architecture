const express = require('express');
const { register, login, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { registerValidation, loginValidation } = require('../validations/auth.validation');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/register', registerValidation, validateRequest, asyncHandler(register));
router.post('/login', loginValidation, validateRequest, asyncHandler(login));
router.get('/me', protect, asyncHandler(getMe));

module.exports = router;
