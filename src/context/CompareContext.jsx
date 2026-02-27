import React, { createContext, useState, useEffect } from 'react';

export const CompareContext = createContext();

export const CompareProvider = ({ children }) => {

    const [compareItems, setCompareItems] = useState(() => {
        const saved = localStorage.getItem('compareItems');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('compareItems', JSON.stringify(compareItems));
    }, [compareItems]);

    // Helper to safely get ID
    const getProductId = (product) => {
        return product._id || product.id;
    };

    const addToCompare = (product) => {

        const productId = getProductId(product);

        // Restrict different category comparison
        if (compareItems.length > 0) {
            if (compareItems[0].category !== product.category) {
                alert("You can only compare products of the same category.");
                return;
            }
        }

        // Limit to 2 items
        if (compareItems.length >= 2) {
            alert("You can only compare up to 2 products at a time.");
            return;
        }

        const exists = compareItems.find(
            item => getProductId(item) === productId
        );

        if (!exists) {
            setCompareItems(prev => [...prev, product]);
        }
    };

    const removeFromCompare = (id) => {
        setCompareItems(prev =>
            prev.filter(item => getProductId(item) !== id)
        );
    };

    const clearCompare = () => {
        setCompareItems([]);
    };

    const isInCompare = (id) => {
        return compareItems.some(
            item => getProductId(item) === id
        );
    };

    return (
        <CompareContext.Provider
            value={{
                compareItems,
                addToCompare,
                removeFromCompare,
                clearCompare,
                isInCompare
            }}
        >
            {children}
        </CompareContext.Provider>
    );
};