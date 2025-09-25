const { createGroup, joinGroup, listGroups, deleteGroup, getGroupDetails, addGroupContribution, getGroupContributions } = require('../services/group.service');
const notificationService = require('../services/notification.service');

// Helper function to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

async function createGroupController(req, res, next) {
  try {
    const { name, description, targetAmount, maxMembers, durationMonths, accountInfo, feeData } = req.body;
    
    // Process wallet deduction if feeData is provided
    if (feeData && feeData.totalFee > 0) {
      const Wallet = require('../models/Wallet');
      
      // Find user's wallet
      let wallet = await Wallet.findOne({ user: req.user.userId });
      if (!wallet) {
        return res.status(404).json({
          success: false,
          message: 'Wallet not found. Please create a wallet first.'
        });
      }
      
      // Check if user has sufficient balance
      if (wallet.balance < feeData.totalFee) {
        return res.status(400).json({
          success: false,
          message: `Insufficient wallet balance. Required: ₦${feeData.totalFee.toLocaleString()}, Available: ₦${wallet.balance.toLocaleString()}`
        });
      }
      
      // Deduct fee from wallet
      wallet.balance -= feeData.totalFee;
      
      // Add transaction record
      wallet.transactions.push({
        type: 'group_creation_fee',
        amount: -feeData.totalFee, // Negative for deduction
        description: `Group creation fee for "${name}"`,
        status: 'completed',
        timestamp: new Date(),
        metadata: {
          groupName: name,
          targetAmount: targetAmount,
          durationMonths: durationMonths,
          feeBreakdown: feeData
        }
      });
      
      await wallet.save();
      console.log(`✅ Group creation fee of ₦${feeData.totalFee} deducted from wallet`);
    }
    
    const group = await createGroup({ 
      name, 
      description, 
      targetAmount, 
      maxMembers, 
      durationMonths, 
      accountInfo,
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
    
    // Send notification to group members about new member
    try {
      await notificationService.notifyGroupJoin(group._id, req.user.userId);
    } catch (notificationError) {
      console.error('Error sending group join notification:', notificationError);
      // Don't fail the join if notification fails
    }
    
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

async function getGroupDetailsController(req, res, next) {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const group = await getGroupDetails(groupId, userId);
    
    res.json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('❌ Get group details error:', error);
    next(error);
  }
}

async function addGroupContributionController(req, res, next) {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;
    const { amount, method, description } = req.body;

    const result = await addGroupContribution(groupId, userId, { amount, method, description });
    
    // Send notification to all group members (except the contributor)
    try {
      const contributorName = result.contribution.user?.firstName 
        ? `${result.contribution.user.firstName} ${result.contribution.user.lastName}`
        : 'A member';

      // Notify group owner if they're not the contributor
      if (result.group.createdBy._id.toString() !== userId) {
        await notificationService.createNotification({
          userId: result.group.createdBy._id,
          type: 'contribution',
          title: 'New Group Contribution',
          message: `${contributorName} contributed ${formatCurrency(amount)} to ${result.group.name}`,
          relatedId: groupId,
          relatedType: 'group',
          data: {
            groupId: groupId,
            contributionId: result.contribution._id,
            amount: amount,
            contributorId: userId,
            contributorName: contributorName
          }
        });
      }

      // Notify all other group members
      for (const member of result.group.members) {
        if (member.user && member.user._id.toString() !== userId && member.user._id.toString() !== result.group.createdBy._id.toString()) {
          await notificationService.createNotification({
            userId: member.user._id,
            type: 'contribution',
            title: 'New Group Contribution',
            message: `${contributorName} contributed ${formatCurrency(amount)} to ${result.group.name}`,
            relatedId: groupId,
            relatedType: 'group',
            data: {
              groupId: groupId,
              contributionId: result.contribution._id,
              amount: amount,
              contributorId: userId,
              contributorName: contributorName
            }
          });
        }
      }
    } catch (notificationError) {
      console.error('❌ Failed to send notifications:', notificationError);
      // Don't fail the contribution if notification fails
    }
    
    res.status(201).json({
      success: true,
      data: result,
      message: 'Contribution added successfully'
    });
  } catch (error) {
    console.error('❌ Add group contribution error:', error);
    next(error);
  }
}

async function getGroupContributionsController(req, res, next) {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId;

    const contributions = await getGroupContributions(groupId, userId);
    
    res.json({
      success: true,
      data: contributions
    });
  } catch (error) {
    console.error('❌ Get group contributions error:', error);
    next(error);
  }
}

module.exports = { 
  createGroup: createGroupController, 
  joinGroup: joinGroupController, 
  listGroups: listGroupsController,
  deleteGroup: deleteGroupController,
  getGroupDetails: getGroupDetailsController,
  addGroupContribution: addGroupContributionController,
  getGroupContributions: getGroupContributionsController
};