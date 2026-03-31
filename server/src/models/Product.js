const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, default: '#000000' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountedPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
      enum: ['Women', 'Men', 'Kids'],
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      enum: ['women', 'men', 'boys', 'girls', 'unisex'],
      default: 'unisex',
    },
    sizes: [
      {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4-5Y', '6-7Y', '8-9Y', '10-11Y', '12-13Y', '14-15Y'],
      },
    ],
    colors: [colorSchema],
    images: [
      {
        type: String,
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4.3,
    },
    reviewsCount: {
      type: Number,
      min: 0,
      default: 25,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
    material: {
      type: String,
      default: '',
    },
    care: {
      type: String,
      default: 'Dry clean only',
    },
    seoTitle: {
      type: String,
    },
    seoDescription: {
      type: String,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', subCategory: 'text' });

module.exports = mongoose.model('Product', productSchema);
