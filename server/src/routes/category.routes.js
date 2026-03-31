const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getCategories));
router.post('/', protect, adminOnly, asyncHandler(createCategory));
router.put('/:id', protect, adminOnly, asyncHandler(updateCategory));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteCategory));

module.exports = router;
