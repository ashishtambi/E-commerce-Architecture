const express = require('express');
const { getDashboardStats } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/stats', protect, adminOnly, asyncHandler(getDashboardStats));

module.exports = router;
