import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { token, user } = useContext(AuthContext);

    // Fetch cart from backend when user logs in
    useEffect(() => {
        const fetchCart = async () => {
            if (token) {
                try {
                    const response = await fetch('http://localhost:5000/api/cart', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setCartItems(data.items || []);
                    }
                } catch (error) {
                    console.error("Error fetching cart:", error);
                }
            } else {
                setCartItems([]); // Clear cart on logout
            }
        };
        fetchCart();
    }, [token]);

    const addToCart = async (product) => {
        if (!token) {
            alert('Please login to add items to cart');
            return;
        }

        // MongoDB uses _id; fallback to id for any legacy data
        const productId = String(product._id || product.id);

        try {
            const response = await fetch('http://localhost:5000/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    title: product.title,
                    price: product.price,
                    image: product.thumbnail || product.image,
                    discountPercentage: product.discountPercentage || 0,
                    quantity: 1
                })
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items);
            } else {
                const err = await response.json();
                console.error('Add to cart failed:', err.message);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    const removeFromCart = async (productId) => {
        if (!token) return;

        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items);
            }
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        if (!token || newQuantity < 1) return;

        try {
            const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: newQuantity })
            });
            if (response.ok) {
                const data = await response.json();
                setCartItems(data.items);
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            cartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};
