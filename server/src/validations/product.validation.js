const { body } = require('express-validator');

const upsertProductValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('discountedPrice').optional().isFloat({ min: 0 }).withMessage('Discounted price must be a positive number'),
  body('category').notEmpty().withMessage('Category id is required'),
  body('categoryName').isIn(['Women', 'Men', 'Kids']).withMessage('Category name must be Women, Men or Kids'),
  body('subCategory').trim().notEmpty().withMessage('Sub category is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock cannot be negative'),
  body('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  body('reviewsCount').optional().isInt({ min: 0 }).withMessage('Review count cannot be negative'),
  body('images').isArray({ min: 1 }).withMessage('At least one image is required'),
];

module.exports = {
  upsertProductValidation,
};
