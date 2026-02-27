import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MarketCard from '../components/MarketCard';
import AddProductForm from '../components/AddProductForm';
import { fetchMarketplaceListings } from '../services/api';
import './Marketplace.css';

const CATEGORIES = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'Electronics', name: 'Electronics', icon: '💻' },
    { id: 'Books & Stationery', name: 'Books & Stationery', icon: '📚' },
    { id: 'Clothing', name: 'Clothing', icon: '👕' },
];

const Marketplace = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [isAddFormOpen, setIsAddFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const categoryParam = searchParams.get('category') || 'all';

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await fetchMarketplaceListings();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleCategoryChange = (catId) => {
        setSearchParams(prev => {
            if (catId === 'all') {
                prev.delete('category');
            } else {
                prev.set('category', catId);
            }
            return prev;
        });
    };

    const handleAddProduct = () => {
        loadProducts(); // Refresh from backend
    };

    const filteredProducts = categoryParam.toLowerCase() === 'all'
        ? products
        : products.filter(p => p.category === categoryParam);

    return (
        <div className="marketplace-layout container">
            {/* Sidebar Filters */}
            <aside className="products-sidebar">
                <div className="sidebar-header">
                    <h2 className="sidebar-title">Categories</h2>
                </div>
                <ul className="category-list">
                    {CATEGORIES.map(cat => (
                        <li key={cat.id}>
                            <button
                                className={`category-item ${categoryParam === cat.id ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(cat.id)}
                            >
                                <span className="category-icon">{cat.icon}</span>
                                <span className="category-name">{cat.name}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content */}
            <main className="products-main">
                <div className="marketplace-header-area">
                    <div className="products-header" style={{ marginBottom: 0, borderBottom: 'none' }}>
                        <h2>
                            {CATEGORIES.find(c => c.id === categoryParam)?.name || 'All Products'}
                        </h2>
                        <span className="products-count">{filteredProducts.length} items</span>
                    </div>
                    <button className="btn-primary btn-sell" onClick={() => setIsAddFormOpen(true)}>
                        + Sell Item
                    </button>
                </div>
                <hr style={{ borderColor: 'var(--border-color)', margin: '0 0 1.5rem 0' }} />

                {isLoading ? (
                    <div className="loading-state">Loading products...</div>
                ) : filteredProducts.length > 0 ? (
                    <div className="products-grid">
                        {filteredProducts.map(product => (
                            <MarketCard key={product.id || product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="no-products">
                        <div className="no-products-icon">📦</div>
                        <h3>No items in this category yet.</h3>
                        <p>Be the first to list an item for sale!</p>
                        <button className="btn-outline mt-4" onClick={() => setIsAddFormOpen(true)}>
                            Sell an Item
                        </button>
                    </div>
                )}
            </main>

            {/* Add Product Modal */}
            {isAddFormOpen && (
                <AddProductForm
                    onAddProduct={handleAddProduct}
                    onClose={() => setIsAddFormOpen(false)}
                />
            )}
        </div>
    );
};

export default Marketplace;
