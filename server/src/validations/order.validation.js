const { body } = require('express-validator');

const createOrderValidation = [
  body('shippingAddress.fullName').trim().notEmpty().withMessage('Full name is required'),
  body('shippingAddress.phone').trim().notEmpty().withMessage('Phone is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').trim().notEmpty().withMessage('Pincode is required'),
  body('paymentMethod').optional().isIn(['cod', 'dummy_gateway']).withMessage('Invalid payment method'),
];

module.exports = {
  createOrderValidation,
};
