const CommunityPost = require('../models/CommunityPost');
const User = require('../models/User');

class CommunityService {
  // Create a new community post
  async createPost(postData, userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const post = new CommunityPost({
        ...postData,
        author: userId,
        displayName: postData.isAnonymous ? (postData.displayName || 'Anonymous User') : user.name
      });

      await post.save();
      
      // Populate author info for response
      await post.populate('author', 'name email avatar');
      
      return {
        success: true,
        data: post,
        message: 'Post created successfully'
      };
    } catch (error) {
      console.error('Error creating community post:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get all posts with filtering and pagination
  async getPosts(filters = {}, page = 1, limit = 10) {
    try {
      const query = { status: 'active' };
      
      // Apply filters
      if (filters.category) {
        query.category = filters.category;
      }
      if (filters.mood) {
        query.mood = filters.mood;
      }
      if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
      }
      if (filters.featured) {
        query.featured = true;
      }
      if (filters.author) {
        query.author = filters.author;
      }

      const skip = (page - 1) * limit;
      
      const posts = await CommunityPost.find(query)
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await CommunityPost.countDocuments(query);

      return {
        success: true,
        data: {
          posts,
          pagination: {
            current: page,
            total: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1
          }
        }
      };
    } catch (error) {
      console.error('Error fetching community posts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get a single post by ID
  async getPostById(postId, userId = null) {
    try {
      const post = await CommunityPost.findById(postId)
        .populate('author', 'name email avatar')
        .populate('engagement.comments.user', 'name email avatar');

      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      // Increment view count
      post.engagement.views += 1;
      await post.save();

      // Check if user has liked the post
      let userLiked = false;
      if (userId) {
        userLiked = post.engagement.likes.some(like => 
          like.user.toString() === userId.toString()
        );
      }

      return {
        success: true,
        data: {
          post,
          userLiked
        }
      };
    } catch (error) {
      console.error('Error fetching post:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Like/unlike a post
  async toggleLike(postId, userId) {
    try {
      const post = await CommunityPost.findById(postId);
      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      const userLiked = post.engagement.likes.some(like => 
        like.user.toString() === userId.toString()
      );

      if (userLiked) {
        post.removeLike(userId);
      } else {
        post.addLike(userId);
      }

      await post.save();

      return {
        success: true,
        data: {
          liked: !userLiked,
          likeCount: post.likeCount
        }
      };
    } catch (error) {
      console.error('Error toggling like:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Add comment to a post
  async addComment(postId, commentData, userId) {
    try {
      const post = await CommunityPost.findById(postId);
      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      const comment = post.addComment(
        userId,
        commentData.content,
        commentData.isAnonymous,
        commentData.displayName
      );

      await post.save();
      await post.populate('engagement.comments.user', 'name email avatar');

      return {
        success: true,
        data: comment,
        message: 'Comment added successfully'
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get trending posts
  async getTrendingPosts(limit = 5) {
    try {
      const posts = await CommunityPost.aggregate([
        { $match: { status: 'active' } },
        {
          $addFields: {
            engagementScore: {
              $add: [
                { $multiply: [{ $size: '$engagement.likes' }, 2] },
                { $multiply: [{ $size: '$engagement.comments' }, 3] },
                { $multiply: [{ $size: '$engagement.shares' }, 5] },
                '$engagement.views'
              ]
            }
          }
        },
        { $sort: { engagementScore: -1, createdAt: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author'
          }
        },
        { $unwind: '$author' },
        {
          $project: {
            'author.password': 0,
            'author.__v': 0
          }
        }
      ]);

      return {
        success: true,
        data: posts
      };
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get posts by category
  async getPostsByCategory(category, limit = 10) {
    try {
      const posts = await CommunityPost.find({
        category,
        status: 'active'
      })
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: posts
      };
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get user's posts
  async getUserPosts(userId, limit = 10) {
    try {
      const posts = await CommunityPost.find({
        author: userId,
        status: 'active'
      })
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: posts
      };
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Search posts
  async searchPosts(searchTerm, limit = 10) {
    try {
      const posts = await CommunityPost.find({
        $and: [
          { status: 'active' },
          {
            $or: [
              { title: { $regex: searchTerm, $options: 'i' } },
              { content: { $regex: searchTerm, $options: 'i' } },
              { tags: { $in: [new RegExp(searchTerm, 'i')] } }
            ]
          }
        ]
      })
        .populate('author', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(limit);

      return {
        success: true,
        data: posts
      };
    } catch (error) {
      console.error('Error searching posts:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get community statistics
  async getCommunityStats() {
    try {
      const stats = await CommunityPost.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
            totalLikes: { $sum: { $size: '$engagement.likes' } },
            totalComments: { $sum: { $size: '$engagement.comments' } },
            totalViews: { $sum: '$engagement.views' },
            categories: { $addToSet: '$category' },
            moods: { $addToSet: '$mood' }
          }
        }
      ]);

      const categoryStats = await CommunityPost.aggregate([
        { $match: { status: 'active' } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]);

      return {
        success: true,
        data: {
          overall: stats[0] || {
            totalPosts: 0,
            totalLikes: 0,
            totalComments: 0,
            totalViews: 0
          },
          categories: categoryStats
        }
      };
    } catch (error) {
      console.error('Error fetching community stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Update post
  async updatePost(postId, updateData, userId) {
    try {
      const post = await CommunityPost.findById(postId);
      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      // Check if user is the author
      if (post.author.toString() !== userId.toString()) {
        return {
          success: false,
          error: 'Unauthorized to update this post'
        };
      }

      Object.assign(post, updateData);
      await post.save();

      return {
        success: true,
        data: post,
        message: 'Post updated successfully'
      };
    } catch (error) {
      console.error('Error updating post:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Delete post
  async deletePost(postId, userId) {
    try {
      const post = await CommunityPost.findById(postId);
      if (!post) {
        return {
          success: false,
          error: 'Post not found'
        };
      }

      // Check if user is the author
      if (post.author.toString() !== userId.toString()) {
        return {
          success: false,
          error: 'Unauthorized to delete this post'
        };
      }

      post.status = 'deleted';
      await post.save();

      return {
        success: true,
        message: 'Post deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting post:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = new CommunityService(); 