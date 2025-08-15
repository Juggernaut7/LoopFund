const { Goal } = require('../models/Goal');
const { Contribution } = require('../models/Contribution');
const { User } = require('../models/User');

async function getAllGoals() {
  return Goal.find().populate('createdBy', 'firstName lastName email').populate('group').lean();
}

async function getAllContributions() {
  return Contribution.find().populate('user', 'firstName lastName email').populate('goal', 'name').lean();
}

async function getAllUsers() {
  return User.find().select('-passwordHash').lean();
}

module.exports = { getAllGoals, getAllContributions, getAllUsers };