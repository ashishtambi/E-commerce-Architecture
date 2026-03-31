const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  const user = await User.findById(req.user._id).populate('cart.product');

  if (!user.cart.length) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const items = user.cart.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.images[0],
    price: item.product.discountedPrice || item.product.price,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
  }));

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: user._id,
    items,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod || 'dummy_gateway',
    paymentStatus: 'paid',
    totalAmount,
    status: 'placed',
  });

  await Promise.all(
    items.map((item) =>
      Product.findByIdAndUpdate(item.product, {
        $inc: {
          stock: -item.quantity,
          popularity: item.quantity,
        },
      })
    )
  );

  user.cart = [];
  await user.save();

  return res.status(201).json({ message: 'Order placed successfully', order });
};

const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

  return res.json({ orders });
};

const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  return res.json({ orders });
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status,
      paymentStatus: status === 'cancelled' ? 'failed' : 'paid',
    },
    { new: true, runValidators: true }
  );

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  return res.json({ message: 'Order updated', order });
};

const getOrderStats = async (req, res) => {
  const [totalOrders, totalRevenue, totalUsers] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, value: { $sum: '$totalAmount' } } }]),
    User.countDocuments({ role: 'customer' }),
  ]);

  const revenueValue = totalRevenue[0]?.value || 0;

  const recentOrders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: -1 })
    .limit(5);

  return res.json({
    stats: {
      totalOrders,
      totalUsers,
      totalRevenue: revenueValue,
    },
    recentOrders,
  });
};

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
};
