import express from 'express';
import { addOrderItems, getOrderById, getMyOrders, updateOrderToPaid, getAllOrders, updateOrderToDelivered, initPayment, confirmPayment } from '../controllers/orderController.js';

import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js'; 

const router = express.Router();

router.post("/", auth, addOrderItems);
router.get("/", auth, adminAuth, getAllOrders);
router.get("/myorders", auth, getMyOrders);
router.get("/:id", auth, getOrderById);
router.put("/:id/deliver", auth, updateOrderToDelivered);
router.put("/:id/pay", auth, updateOrderToPaid);
router.post("/payment/init", auth, initPayment);
router.post("/payment/confirm", auth, confirmPayment);

export default router;