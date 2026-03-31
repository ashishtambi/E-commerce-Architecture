const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  const token = generateToken(user._id, user.role);

  return res.status(201).json({
    message: 'Registration successful',
    token,
    user: user.toSafeObject(),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id, user.role);

  return res.json({
    message: 'Login successful',
    token,
    user: user.toSafeObject(),
  });
};

const getMe = async (req, res) => {
  return res.json({ user: req.user.toSafeObject() });
};

module.exports = {
  register,
  login,
  getMe,
};
