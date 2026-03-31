const express = require('express');
const {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const { protect, adminOnly } = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { upsertProductValidation } = require('../validations/product.validation');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.get('/', asyncHandler(getProducts));
router.get('/:idOrSlug', asyncHandler(getProductByIdOrSlug));
router.post('/', protect, adminOnly, upsertProductValidation, validateRequest, asyncHandler(createProduct));
router.put('/:id', protect, adminOnly, asyncHandler(updateProduct));
router.delete('/:id', protect, adminOnly, asyncHandler(deleteProduct));

module.exports = router;
