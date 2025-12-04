import Order from "../models/Order.js";
import * as paymentService from "./paymentService.js";

export const createOrder = async (orderData, userId) => {
    const {
        orderItems, shippingAddress, paymentMethod,
        itemsPrice, shippingPrice, totalPrice,
    } = orderData;

    if (orderItems && orderItems.length === 0) {
        throw new Error("Brak elementów zamówienia");
    }

    const order = new Order({
        orderItems,
        user: userId,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
    });

    return await order.save();
};

export const getOrderById = async (id) => {
    return await Order.findById(id).populate("user", "firstName lastName email");
};

export const getMyOrders = async (userId) => {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getAllOrders = async () => {
    return await Order.find({})
        .populate('user', 'id firstName lastName email')
        .sort({ createdAt: -1 });
};


export const updateOrderDeliveryStatus = async (orderId, status) => {
    const order = await Order.findById(orderId);
    
    if (!order) {
        throw new Error("Zamówienie nie istnieje");
    }

    // order.deliveryStatus = status;
    // if (status === 'Delivered') {
    //     order.deliveredAt = Date.now();
    // }

    return await order.save();
};

export const updateOrderToPaid = async (id, paymentResult) => {
    const order = await Order.findById(id);
    if (!order) throw new Error("Nie znaleziono zamówienia");

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult; 

    return await order.save();
};

export const initializeOrderPayment = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Zamówienie nie istnieje");

    if (order.paymentIntentId) {
        try {
            const existingIntent = await paymentService.retrievePaymentIntent(order.paymentIntentId);
            
            console.log("Przywracanie istniejącej płatności:", existingIntent.id);
            return { clientSecret: existingIntent.client_secret };
        } catch (error) {
            console.warn("Nie udało się odzyskać płatności, tworzenie nowej...");
        }
    }

    const intent = await paymentService.createPaymentIntent(order.totalPrice);

    order.paymentIntentId = intent.id;
    await order.save();

    console.log("Utworzono nową płatność:", intent.id);
    return { clientSecret: intent.client_secret };
};

export const finalizeOrderPayment = async (orderId, paymentIntentId) => {
    const verification = await paymentService.verifyPayment(paymentIntentId);

    if (!verification.verified) {
        throw new Error("Płatność nie została zweryfikowana przez system płatności");
    }
    
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Zamówienie nie istnieje");

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = verification.details;
    
    return await order.save();
};