const { createGroup, joinGroup, listGroups } = require('../services/group.service');

async function createGroupController(req, res, next) {
  try {
    const group = await createGroup({ ...req.body, userId: req.user.userId });
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
}

async function joinGroupController(req, res, next) {
  try {
    const group = await joinGroup({ inviteLink: req.body.inviteLink, userId: req.user.userId });
    res.json({ success: true, data: group });
  } catch (error) {
    next(error);
  }
}

async function listGroupsController(req, res, next) {
  try {
    const groups = await listGroups(req.user.userId);
    res.json({ success: true, data: groups });
  } catch (error) {
    next(error);
  }
}

module.exports = { createGroup: createGroupController, joinGroup: joinGroupController, listGroups: listGroupsController };