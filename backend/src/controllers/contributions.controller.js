const { addContribution, listContributions } = require('../services/contribution.service');

async function addContributionController(req, res, next) {
  try {
    const contribution = await addContribution({ ...req.body, userId: req.user.userId });
    res.status(201).json({ success: true, data: contribution });
  } catch (error) {
    next(error);
  }
}

async function listContributionsController(req, res, next) {
  try {
    const contributions = await listContributions(req.params.goalId, req.user.userId);
    res.json({ success: true, data: contributions });
  } catch (error) {
    next(error);
  }
}

module.exports = { addContribution: addContributionController, listContributions: listContributionsController };