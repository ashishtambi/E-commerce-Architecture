const User = require('../models/User');
const Product = require('../models/Product');

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .select('-password')
    .populate('wishlist')
    .populate('cart.product');

  res.json({ user });
};

const updateProfile = async (req, res) => {
  const { name, phone } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone },
    { new: true, runValidators: true }
  ).select('-password');

  res.json({ message: 'Profile updated', user });
};

const getUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
};

const toggleWishlist = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const user = await User.findById(req.user._id);

  const exists = user.wishlist.some((id) => id.toString() === productId);

  if (exists) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();

  await user.populate('wishlist');

  res.json({
    message: exists ? 'Removed from wishlist' : 'Added to wishlist',
    wishlist: user.wishlist,
  });
};

const getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ wishlist: user.wishlist });
};

const getCart = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');
  res.json({ cart: user.cart });
};

const addToCart = async (req, res) => {
  const { productId, quantity = 1, size = 'M', color = 'Default' } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }

  const user = await User.findById(req.user._id);

  const existingItem = user.cart.find(
    (item) =>
      item.product.toString() === productId &&
      item.size === size &&
      item.color.toLowerCase() === color.toLowerCase()
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    user.cart.push({
      product: productId,
      quantity: Number(quantity),
      size,
      color,
    });
  }

  await user.save();
  await user.populate('cart.product');

  res.status(201).json({ message: 'Added to cart', cart: user.cart });
};

const updateCartItem = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  const user = await User.findById(req.user._id);

  const item = user.cart.find((cartItem) => cartItem.product.toString() === productId);

  if (!item) {
    return res.status(404).json({ message: 'Cart item not found' });
  }

  item.quantity = Math.max(1, Number(quantity));
  await user.save();
  await user.populate('cart.product');

  res.json({ message: 'Cart updated', cart: user.cart });
};

const removeCartItem = async (req, res) => {
  const { productId } = req.params;

  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((item) => item.product.toString() !== productId);

  await user.save();
  await user.populate('cart.product');

  res.json({ message: 'Item removed', cart: user.cart });
};

const clearCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ message: 'Cart cleared', cart: [] });
};

module.exports = {
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
};
