const { getAllGoals, getAllContributions, getAllUsers } = require('../services/admin.service');

async function getAllGoalsController(req, res, next) {
  try {
    const goals = await getAllGoals();
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
}

async function getAllContributionsController(req, res, next) {
  try {
    const contributions = await getAllContributions();
    res.json({ success: true, data: contributions });
  } catch (error) {
    next(error);
  }
}

async function getAllUsersController(req, res, next) {
  try {
    const users = await getAllUsers();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllGoals: getAllGoalsController, getAllContributions: getAllContributionsController, getAllUsers: getAllUsersController };