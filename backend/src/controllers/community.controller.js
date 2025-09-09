const communityService = require('../services/community.service');

// Create a new community post
const createPost = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const postData = req.body;

    const result = await communityService.createPost(postData, userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in createPost controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get all posts with filtering and pagination
const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, mood, tags, featured, author } = req.query;
    const filters = { category, mood, tags: tags ? tags.split(',') : null, featured, author };

    const result = await communityService.getPosts(filters, parseInt(page), parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getPosts controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get a single post by ID
const getPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    const result = await communityService.getPostById(postId, userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error in getPostById controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Like/unlike a post
const toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId || req.user.id;

    const result = await communityService.toggleLike(postId, userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in toggleLike controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Add comment to a post
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId || req.user.id;
    const commentData = req.body;

    const result = await communityService.addComment(postId, commentData, userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in addComment controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get trending posts
const getTrendingPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const result = await communityService.getTrendingPosts(parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getTrendingPosts controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get posts by category
const getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 10 } = req.query;

    const result = await communityService.getPostsByCategory(category, parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getPostsByCategory controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get user's posts
const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const result = await communityService.getUserPosts(userId, parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getUserPosts controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Search posts
const searchPosts = async (req, res) => {
  try {
    const { q } = req.query;
    const { limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search term is required'
      });
    }

    const result = await communityService.searchPosts(q, parseInt(limit));
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in searchPosts controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Get community statistics
const getCommunityStats = async (req, res) => {
  try {
    const result = await communityService.getCommunityStats();
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in getCommunityStats controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId || req.user.id;
    const updateData = req.body;

    const result = await communityService.updatePost(postId, updateData, userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in updatePost controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.userId || req.user.id;

    const result = await communityService.deletePost(postId, userId);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in deletePost controller:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getPostById,
  toggleLike,
  addComment,
  getTrendingPosts,
  getPostsByCategory,
  getUserPosts,
  searchPosts,
  getCommunityStats,
  updatePost,
  deletePost
}; 