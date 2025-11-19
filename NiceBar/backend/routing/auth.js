import express from 'express';
import {checkStatus, login, logout, register} from './../controllers/authController.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/status", checkStatus);

export default router;