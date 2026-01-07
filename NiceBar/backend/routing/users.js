import express from 'express';
import { getAllUsers, deleteUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

router.get("/", auth, adminAuth, getAllUsers);
router.delete("/:id", auth, adminAuth, deleteUser);


export default router;