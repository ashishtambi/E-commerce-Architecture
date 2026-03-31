const Category = require('../models/Category');

const getCategories = async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 });
  res.json({ categories });
};

const createCategory = async (req, res) => {
  const { name, slug, description, image, subCategories = [] } = req.body;

  const exists = await Category.findOne({ $or: [{ name }, { slug }] });
  if (exists) {
    return res.status(409).json({ message: 'Category already exists' });
  }

  const category = await Category.create({
    name,
    slug,
    description,
    image,
    subCategories,
  });

  res.status(201).json({ message: 'Category created', category });
};

const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json({ message: 'Category updated', category });
};

const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  res.json({ message: 'Category deleted' });
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
