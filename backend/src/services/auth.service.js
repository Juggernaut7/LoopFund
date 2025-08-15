const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { env } = require('../config/env');

async function signup({ firstName, lastName, email, password, isAdmin = false }) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already in use');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ firstName, lastName, email, passwordHash, isAdmin });
  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, env.jwtSecret, { expiresIn: '7d' });
  return { token, user: { id: user._id, firstName, lastName, email, isAdmin } };
}

async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Invalid credentials');

  const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, env.jwtSecret, { expiresIn: '7d' });
  return { token, user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, isAdmin: user.isAdmin } };
}

module.exports = { signup, login };