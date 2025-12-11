import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories, getAiSuggestedPosts } from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js'; 

const router = express.Router();

router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProductById);

//trasy chronione
router.post("/", auth, adminAuth, createProduct);
router.put("/:id", auth, adminAuth, updateProduct);
router.delete("/:id", auth, adminAuth, deleteProduct);
router.post("/suggest-posts", auth, adminAuth, getAiSuggestedPosts);

export default router;