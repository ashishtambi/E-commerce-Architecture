const mongoose = require('mongoose');
const Product = require('../models/Product');
const slugify = require('../utils/slugify');

const normalizeSort = (sort = '') => {
  switch (sort) {
    case 'price_asc':
      return { price: 1 };
    case 'price_desc':
      return { price: -1 };
    case 'popularity':
      return { popularity: -1, createdAt: -1 };
    case 'oldest':
      return { createdAt: 1 };
    default:
      return { createdAt: -1 };
  }
};

const getProducts = async (req, res) => {
  const {
    search,
    category,
    subCategory,
    gender,
    size,
    color,
    minPrice,
    maxPrice,
    featured,
    trending,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  const filters = {};

  if (search) {
    filters.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { subCategory: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) {
    filters.categoryName = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  }

  if (subCategory) {
    filters.subCategory = { $regex: `^${subCategory}$`, $options: 'i' };
  }

  if (gender) {
    filters.gender = gender;
  }

  if (size) {
    filters.sizes = size;
  }

  if (color) {
    filters['colors.name'] = { $regex: `^${color}$`, $options: 'i' };
  }

  if (featured === 'true') {
    filters.featured = true;
  }

  if (trending === 'true') {
    filters.trending = true;
  }

  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filters)
      .populate('category', 'name slug')
      .sort(normalizeSort(sort))
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filters),
  ]);

  res.json({
    products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      limit: Number(limit),
    },
  });
};

const getProductByIdOrSlug = async (req, res) => {
  const { idOrSlug } = req.params;

  const filter = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] }
    : { slug: idOrSlug };

  const product = await Product.findOne(filter).populate('category', 'name slug');

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json({ product });
};

const createProduct = async (req, res) => {
  const payload = { ...req.body };

  payload.slug = payload.slug ? slugify(payload.slug) : slugify(payload.name);

  const slugExists = await Product.findOne({ slug: payload.slug });
  if (slugExists) {
    payload.slug = `${payload.slug}-${Date.now()}`;
  }

  const product = await Product.create(payload);

  return res.status(201).json({ message: 'Product created', product });
};

const updateProduct = async (req, res) => {
  const payload = { ...req.body };

  if (payload.name && !payload.slug) {
    payload.slug = slugify(payload.name);
  }

  if (payload.slug) {
    payload.slug = slugify(payload.slug);
  }

  const product = await Product.findByIdAndUpdate(req.params.id, payload, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json({ message: 'Product updated', product });
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  return res.json({ message: 'Product deleted' });
};

module.exports = {
  getProducts,
  getProductByIdOrSlug,
  createProduct,
  updateProduct,
  deleteProduct,
};
