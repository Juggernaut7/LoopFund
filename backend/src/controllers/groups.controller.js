const { createGroup, joinGroup, listGroups, deleteGroup } = require('../services/group.service');

async function createGroupController(req, res, next) {
  try {
    const { name, description, targetAmount, maxMembers, durationMonths } = req.body;
    const group = await createGroup({ 
      name, 
      description, 
      targetAmount, 
      maxMembers, 
      durationMonths, 
      userId: req.user.userId 
    });
    res.status(201).json({ success: true, data: group });
  } catch (error) {
    console.error('Create group error:', error);
    next(error);
  }
}

async function joinGroupController(req, res, next) {
  try {
    const group = await joinGroup({ inviteCode: req.body.inviteCode, userId: req.user.userId });
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

async function deleteGroupController(req, res, next) {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    console.log('️ Deleting group:', groupId, 'by user:', userId);

    const result = await deleteGroup(groupId, userId);
    
    res.json({
      success: true,
      message: 'Group deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete group error:', error);
    next(error);
  }
}

module.exports = { 
  createGroup: createGroupController, 
  joinGroup: joinGroupController, 
  listGroups: listGroupsController,
  deleteGroup: deleteGroupController 
};