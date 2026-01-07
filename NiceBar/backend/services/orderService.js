import Order from "../models/Order.js";
import Product from "../models/Product.js"; // <--- IMPORTUJEMY PRODUKT
import * as paymentService from "./paymentService.js";

export const createOrder = async (orderData, userId) => {
    const {
        orderItems, shippingAddress, paymentMethod,
        itemsPrice, shippingPrice, totalPrice,
    } = orderData;

    if (orderItems && orderItems.length === 0) {
        throw new Error("Brak elementów zamówienia");
    }

    // Sprawdzenie dostępności produktów przed zapisem
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new Error(`Produkt o ID ${item.product} nie został znaleziony.`);
        }
        if (product.countInStock < item.qty) {
            throw new Error(`Produkt "${product.name}" nie jest dostępny w wybranej ilości (Dostępne: ${product.countInStock}).`);
        }
    }

    // Utworzenie zamówienia
    const order = new Order({
        orderItems,
        user: userId,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
    });

    const savedOrder = await order.save();

    // Aktualizacja stanów magazynowych (zmniejszenie ilości)
    for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
            $inc: { countInStock: -item.qty }
        });
    }

    return savedOrder;
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

    order.deliveryStatus = status;
    if (status === 'Delivered') {
        order.deliveredAt = Date.now();
    }

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

    if (order.isPaid) {
        throw new Error("Zamówienie jest już opłacone");
    }

    const orderDate = new Date(order.createdAt);
    const now = new Date();
    const timeDiff = now - orderDate; 
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff > 24) {
        throw new Error("Czas na opłacenie zamówienia minął (limit 24h). Złóż nowe zamówienie.");
    }

    if (order.paymentIntentId) {
        try {
            const existingIntent = await paymentService.retrievePaymentIntent(order.paymentIntentId);
            
            if (existingIntent.status !== 'canceled' && existingIntent.status !== 'succeeded') {
                console.log("Przywracanie istniejącej płatności:", existingIntent.id);
                return { clientSecret: existingIntent.client_secret };
            }
        } catch (error) {
            console.warn("Nie udało się odzyskać płatności lub wygasła, tworzenie nowej...");
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