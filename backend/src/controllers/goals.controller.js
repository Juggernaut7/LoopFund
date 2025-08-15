const { createGoal, listGoals, getGoal } = require('../services/goal.service');

async function createGoalController(req, res, next) {
  try {
    const goal = await createGoal({ ...req.body, userId: req.user.userId });
    res.status(201).json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
}

async function listGoalsController(req, res, next) {
  try {
    const goals = await listGoals(req.user.userId);
    res.json({ success: true, data: goals });
  } catch (error) {
    next(error);
  }
}

async function getGoalController(req, res, next) {
  try {
    const goal = await getGoal(req.params.id, req.user.userId);
    res.json({ success: true, data: goal });
  } catch (error) {
    next(error);
  }
}

module.exports = { createGoal: createGoalController, listGoals: listGoalsController, getGoal: getGoalController };