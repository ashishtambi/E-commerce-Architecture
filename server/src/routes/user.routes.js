const express = require('express');
const {
  getProfile,
  updateProfile,
  getUsers,
  toggleWishlist,
  getWishlist,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require('../controllers/user.controller');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/profile', protect, asyncHandler(getProfile));
router.put('/profile', protect, asyncHandler(updateProfile));
router.get('/admin/all', protect, adminOnly, asyncHandler(getUsers));

router.get('/wishlist', protect, asyncHandler(getWishlist));
router.patch('/wishlist/:productId', protect, asyncHandler(toggleWishlist));

router.get('/cart', protect, asyncHandler(getCart));
router.post('/cart', protect, asyncHandler(addToCart));
router.put('/cart/:productId', protect, asyncHandler(updateCartItem));
router.delete('/cart/:productId', protect, asyncHandler(removeCartItem));
router.delete('/cart', protect, asyncHandler(clearCart));

module.exports = router;
