import express from 'express';
import {checkStatus, login, logout, register, changePassword, updateAddress, promoteToAdmin} from './../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/status", checkStatus);
router.put("/change-password", auth, changePassword);
router.put("/update-address", auth, updateAddress);
router.put("/promote", auth, promoteToAdmin);

export default router;