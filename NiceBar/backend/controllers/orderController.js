import * as orderService from "../services/orderService.js";

export const addOrderItems = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body, req.user.userId);
        res.status(201).json(order);
    } catch (error) {
        const status = error.message === "Brak elementów zamówienia" ? 400 : 500;
        res.status(status).json({ message: error.message });
    }
};

export const getMyOrders = async (req, res) => {
    try {
        const orders = await orderService.getMyOrders(req.user.userId);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania zamówień" });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        
        if (!order) {
            return res.status(404).json({ message: "Nie znaleziono zamówienia" });
        }
        
        const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
        if (req.user.role !== 'admin' && orderUserId !== req.user.userId) {
             return res.status(403).json({ message: "Brak dostępu" });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania zamówienia" });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Błąd pobierania listy zamówień" });
    }
};

export const updateOrderToDelivered = async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderDeliveryStatus(req.params.id, req.body.status);
        res.json(updatedOrder);
    } catch (error) {
        const status = error.message === "Zamówienie nie istnieje" ? 404 : 500;
        res.status(status).json({ message: error.message || "Błąd aktualizacji statusu" });
    }
};

export const initPayment = async (req, res) => {
    try {
        const result = await orderService.initializeOrderPayment(req.body.orderId);
        res.json(result);
    } catch (error) {
        console.error("Błąd initPayment:", error);
        const status = error.message === "Zamówienie nie istnieje" ? 404 : 500;
        res.status(status).json({ message: "Błąd Stripe", error: error.message });
    }
};

export const confirmPayment = async (req, res) => {
    const { orderId, paymentIntentId } = req.body;
    try {
        const order = await orderService.finalizeOrderPayment(orderId, paymentIntentId);
        res.json({ message: "Zamówienie opłacone", order });
    } catch (error) {
        if (error.message === "Płatność nie została zweryfikowana przez Stripe") {
            return res.status(400).json({ message: error.message });
        }
        if (error.message === "Zamówienie nie istnieje") {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: "Błąd weryfikacji" });
    }
};

export const updateOrderToPaid = async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderToPaid(req.params.id, req.body);
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: "Błąd aktualizacji płatności" });
    }
};