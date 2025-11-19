import express from 'express';
import { getPosts, getPostById, addPost, editPost, deletePost, addComment, deleteComment } from '../controllers/postController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", auth, addPost);
router.put("/:id", auth, editPost);
router.delete("/:id", auth, deletePost);

router.post("/:id/comments", auth, addComment);
router.delete("/:id/comments/:commentId", auth, deleteComment);


export default router;