const express = require('express');
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
} = require('../controllers/order.controller');
const { protect, adminOnly } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { createOrderValidation } = require('../validations/order.validation');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/', protect, createOrderValidation, validateRequest, asyncHandler(createOrder));
router.get('/mine', protect, asyncHandler(getMyOrders));
router.get('/admin/all', protect, adminOnly, asyncHandler(getAllOrders));
router.get('/admin/stats', protect, adminOnly, asyncHandler(getOrderStats));
router.patch('/admin/:id/status', protect, adminOnly, asyncHandler(updateOrderStatus));

module.exports = router;
