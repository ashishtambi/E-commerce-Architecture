const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  const [totalOrders, totalProducts, totalUsers, revenueAgg, orderStatusAgg, monthlyRevenue] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments({ role: 'customer' }),
    Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.aggregate([
      {
        $group: {
          _id: '$status',
          value: { $sum: 1 },
        },
      },
    ]),
    Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),
  ]);

  const statusMap = orderStatusAgg.reduce(
    (acc, item) => {
      acc[item._id] = item.value;
      return acc;
    },
    {
      placed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    }
  );

  res.json({
    stats: {
      totalOrders,
      totalProducts,
      totalUsers,
      totalRevenue: revenueAgg[0]?.total || 0,
      ordersByStatus: statusMap,
      monthlyRevenue,
    },
  });
};

module.exports = {
  getDashboardStats,
};
