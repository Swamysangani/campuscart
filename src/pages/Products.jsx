import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const CATEGORIES = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'electronics', name: 'Electronics', icon: '💻' },
    { id: 'beauty', name: 'Beauty', icon: '💄' },
    { id: 'fragrances', name: 'Fragrances', icon: '✨' },
    { id: 'furniture', name: 'Furniture', icon: '🪑' },
    { id: 'groceries', name: 'Groceries', icon: '🍎' },
];

const PAGE_SIZE = 12;

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [allProducts, setAllProducts] = useState([]); // Full dataset cached
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const categoryParam = searchParams.get('category') || 'all';
    const queryParam = searchParams.get('search') || '';

    // Fetch ALL products once per category/search change, then paginate in-memory
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setCurrentPage(1); // Reset to page 1 on filter change
            const data = await fetchProducts(1, 500, queryParam, categoryParam);

            const products = data.products || [];
            console.log(`Loaded ${products.length} products for category="${categoryParam}"`);

            setAllProducts(products);
            setTotal(products.length);
            setLoading(false);
        };

        loadData();
    }, [categoryParam, queryParam]);

    // Slice the full dataset for the current page — fast, no new API call
    const paginatedProducts = allProducts.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );
    const totalPages = Math.ceil(allProducts.length / PAGE_SIZE);

    const handleCategoryChange = useCallback((catId) => {
        setSearchParams(prev => {
            if (catId === 'all') {
                prev.delete('category');
            } else {
                prev.set('category', catId);
            }
            return prev;
        });
    }, [setSearchParams]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="products-page-wrapper">
            <div className="products-layout">
                {/* Sidebar */}
                <aside className="products-sidebar">
                    <h2 className="sidebar-title">Categories</h2>
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
                    <div className="products-header">
                        <h2>
                            {queryParam
                                ? `Search results for "${queryParam}"`
                                : CATEGORIES.find(c => c.id === categoryParam)?.name || 'All Products'
                            }
                        </h2>
                        <span className="products-count">{total} items found</span>
                    </div>

                    {loading ? (
                        <div className="loading-grid">
                            {[...Array(PAGE_SIZE)].map((_, i) => (
                                <div key={i} className="skeleton-card"></div>
                            ))}
                        </div>
                    ) : paginatedProducts.length > 0 ? (
                        <>
                            <div className="products-grid">
                                {paginatedProducts.map(product => (
                                    <ProductCard key={product._id || product.id} product={product} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination-controls">
                                    <button
                                        className="btn-pagination"
                                        disabled={currentPage <= 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                    >
                                        ‹ Previous
                                    </button>

                                    <div className="page-numbers">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                                            .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                            .reduce((acc, p, idx, arr) => {
                                                if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...');
                                                acc.push(p);
                                                return acc;
                                            }, [])
                                            .map((p, i) =>
                                                p === '...' ? (
                                                    <span key={`ellipsis-${i}`} className="page-ellipsis">•••</span>
                                                ) : (
                                                    <button
                                                        key={p}
                                                        className={`page-number ${currentPage === p ? 'active' : ''}`}
                                                        onClick={() => handlePageChange(p)}
                                                    >
                                                        {p}
                                                    </button>
                                                )
                                            )
                                        }
                                    </div>

                                    <button
                                        className="btn-pagination"
                                        disabled={currentPage >= totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                    >
                                        Next ›
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="no-products">
                            <div className="no-products-icon">🔍</div>
                            <h3>No products found</h3>
                            <p>Try selecting a different category or clearing your search.</p>
                            <button className="btn-primary" onClick={() => handleCategoryChange('all')}>
                                View All Products
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Products;
