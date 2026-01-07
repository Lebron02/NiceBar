import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext'; 
import { toast } from "sonner";

const ShopContext = createContext(null);

export const ShopProvider = ({ children }) => {
    const { api } = useAuth(); 
    
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, qty = 1) => {
        let success = false;

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.product._id === product._id);
            const currentQtyInCart = existingItem ? existingItem.qty : 0;
            const totalRequested = currentQtyInCart + qty;

            if (totalRequested > product.countInStock) {
                toast.error("Nie można dodać do koszyka", {
                    description: `Osiągnięto limit magazynowy. Dostępne tylko: ${product.countInStock} szt.`
                });
                return prevItems;
            }

            success = true; 

            if (existingItem) {
                return prevItems.map(item =>
                    item.product._id === product._id
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            } else {
                return [...prevItems, { product, qty }];
            }
        });

        return success;
    };

    const updateCartItemQuantity = (productId, newQty) => {
        setCartItems(prevItems => {
            return prevItems.map(item =>
                item.product._id === productId
                    ? { ...item, qty: Number(newQty) }
                    : item
            );
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.product._id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    const calculateTotal = (items) => {
        const total = items.reduce((acc, item) => acc + item.qty * item.product.price, 0);
        return Number(total.toFixed(2));
    };

    const cartTotal = calculateTotal(cartItems);

    const placeOrder = async (shippingAddress, paymentMethod) => {
        // eslint-disable-next-line no-useless-catch
        try {
           const orderItemsBackend = cartItems.map(item => ({
            name: item.product.name,
            qty: item.qty,
            image: item.product.images?.[0] || '', 
            price: item.product.price,
            product: item.product._id
        }));

            const orderData = {
                orderItems: orderItemsBackend,
                shippingAddress,
                paymentMethod,
                itemsPrice: cartTotal,
                shippingPrice: 0, 
                totalPrice: cartTotal,
            };

            const res = await api.post('/orders', orderData);
            return res.data; 
        } catch (error) {
            throw error;
        }
    };

    const formatPrice = (price) => {
        return Number(price).toFixed(2);
    };

    const value = {
        cartItems,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        clearCart,
        cartTotal, 
        cartTotalDisplay: formatPrice(cartTotal),
        placeOrder,
        formatPrice
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => {
    const context = useContext(ShopContext);
    if (!context) throw new Error('useShop musi być używany w ShopProvider');
    return context;
};