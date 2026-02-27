import React, { createContext, useState } from 'react';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState([]);

    const toggleWishlist = (product) => {
        setWishlistItems(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isInWishlist = (id) => {
        return wishlistItems.some(item => item.id === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};
