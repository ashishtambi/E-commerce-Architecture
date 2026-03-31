const express = require('express');
const { uploadImage, deleteUploadedImage } = require('../controllers/upload.controller');
const upload = require('../middleware/upload');
const { protect, adminOnly } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post(
  '/',
  protect,
  adminOnly,
  upload.fields([
    { name: 'images', maxCount: 8 },
    { name: 'image', maxCount: 1 },
  ]),
  asyncHandler(uploadImage)
);
router.delete('/', protect, adminOnly, asyncHandler(deleteUploadedImage));

module.exports = router;
