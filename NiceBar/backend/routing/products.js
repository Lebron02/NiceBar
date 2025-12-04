import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js'; 

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);

//trasy chronione
router.post("/", auth, adminAuth, createProduct);
router.put("/:id", auth, adminAuth, updateProduct);
router.delete("/:id", auth, adminAuth, deleteProduct);

export default router;