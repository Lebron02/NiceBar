import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get("/", getCategories); 
router.post("/", auth, adminAuth, createCategory);
router.put("/:id", auth, adminAuth, updateCategory);
router.delete("/:id", auth, adminAuth, deleteCategory);

export default router;