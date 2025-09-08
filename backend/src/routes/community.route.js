const express = require("express");
const router = express.Router();
const communityController = require("../controllers/community.controller");
const { authenticateToken: auth } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validateRequest");
const { body, param, query } = require("express-validator");

// Validation schemas
const createPostValidation = [
  body("title").trim().isLength({ min: 1, max: 200 }).withMessage("Title must be between 1 and 200 characters"),
  body("content").trim().isLength({ min: 1, max: 2000 }).withMessage("Content must be between 1 and 2000 characters"),
  body("category").isIn([
    "success_story", "struggle_share", "tips_advice", "goal_update", "emotional_support",
    "financial_education", "habit_tracking", "celebration", "question", "motivation"
  ]).withMessage("Invalid category"),
  body("mood").isIn([
    "excited", "hopeful", "stressed", "frustrated", "proud", "anxious", "grateful", "determined"
  ]).withMessage("Invalid mood"),
  body("isAnonymous").optional().isBoolean().withMessage("isAnonymous must be a boolean"),
  body("displayName").optional().isLength({ max: 50 }).withMessage("Display name must be less than 50 characters"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().isLength({ max: 20 }).withMessage("Each tag must be less than 20 characters"),
  body("financialMetrics.savingsAmount").optional().isNumeric().withMessage("Savings amount must be a number"),
  body("financialMetrics.debtReduction").optional().isNumeric().withMessage("Debt reduction must be a number"),
  body("financialMetrics.goalProgress").optional().isNumeric().withMessage("Goal progress must be a number"),
  body("financialMetrics.emotionalSpendingReduction").optional().isNumeric().withMessage("Emotional spending reduction must be a number"),
  body("privacyLevel").optional().isIn(["public", "community_only", "anonymous"]).withMessage("Invalid privacy level")
];

const addCommentValidation = [
  body("content").trim().isLength({ min: 1, max: 500 }).withMessage("Comment must be between 1 and 500 characters"),
  body("isAnonymous").optional().isBoolean().withMessage("isAnonymous must be a boolean"),
  body("displayName").optional().isLength({ max: 50 }).withMessage("Display name must be less than 50 characters")
];

const updatePostValidation = [
  body("title").optional().trim().isLength({ min: 1, max: 200 }).withMessage("Title must be between 1 and 200 characters"),
  body("content").optional().trim().isLength({ min: 1, max: 2000 }).withMessage("Content must be between 1 and 2000 characters"),
  body("category").optional().isIn([
    "success_story", "struggle_share", "tips_advice", "goal_update", "emotional_support",
    "financial_education", "habit_tracking", "celebration", "question", "motivation"
  ]).withMessage("Invalid category"),
  body("mood").optional().isIn([
    "excited", "hopeful", "stressed", "frustrated", "proud", "anxious", "grateful", "determined"
  ]).withMessage("Invalid mood"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("tags.*").optional().isLength({ max: 20 }).withMessage("Each tag must be less than 20 characters")
];

const paginationValidation = [
  query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50"),
  query("category").optional().isIn([
    "success_story", "struggle_share", "tips_advice", "goal_update", "emotional_support",
    "financial_education", "habit_tracking", "celebration", "question", "motivation"
  ]).withMessage("Invalid category filter"),
  query("mood").optional().isIn([
    "excited", "hopeful", "stressed", "frustrated", "proud", "anxious", "grateful", "determined"
  ]).withMessage("Invalid mood filter"),
  query("featured").optional().isBoolean().withMessage("Featured must be a boolean")
];

const searchValidation = [
  query("q").trim().isLength({ min: 1 }).withMessage("Search term is required"),
  query("limit").optional().isInt({ min: 1, max: 50 }).withMessage("Limit must be between 1 and 50")
];

// Routes
router.post("/", auth, createPostValidation, validateRequest, communityController.createPost);
router.get("/", paginationValidation, validateRequest, communityController.getPosts);
router.get("/trending", communityController.getTrendingPosts);
router.get("/category/:category", communityController.getPostsByCategory);
router.get("/search", searchValidation, validateRequest, communityController.searchPosts);
router.get("/stats", communityController.getCommunityStats);
router.get("/:postId", communityController.getPostById);
router.get("/user/:userId", communityController.getUserPosts);
router.post("/:postId/like", auth, communityController.toggleLike);
router.post("/:postId/comments", auth, addCommentValidation, validateRequest, communityController.addComment);
router.put("/:postId", auth, updatePostValidation, validateRequest, communityController.updatePost);
router.delete("/:postId", auth, communityController.deletePost);

module.exports = router;
