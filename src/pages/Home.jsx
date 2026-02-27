import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { fetchTopSellingProducts } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            const products = await fetchTopSellingProducts();
            setTopProducts(products);
            setLoading(false);
        };
        loadProducts();
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <Splide
                    options={{
                        type: 'loop',
                        autoplay: true,
                        interval: 4000,
                        arrows: false,
                        pagination: true,
                    }}
                    aria-label="Welcome to CampusCart"
                >
                    <SplideSlide>
                        <div className="hero-slide slide-1">
                            <div className="slide-content">
                                <h2>Welcome to CampusCart</h2>
                                <p>Everything you need for your campus life, delivered fast.</p>
                                <Link to="/products" className="btn-primary">Explore Store</Link>
                            </div>
                        </div>
                    </SplideSlide>
                    <SplideSlide>
                        <div className="hero-slide slide-2">
                            <div className="slide-content">
                                <h2>Student Marketplace</h2>
                                <p>Buy, sell, and exchange pre-owned items within your campus securely.</p>
                                <Link to="/marketplace" className="btn-secondary">Go to Marketplace</Link>
                            </div>
                        </div>
                    </SplideSlide>
                </Splide>
            </section>

            {/* Top Selling Products */}
            <section className="top-selling-section container">
                <div className="section-header">
                    <h2>Top Selling Products</h2>
                    <Link to="/products" className="view-all-link">View All</Link>
                </div>

                {loading ? (
                    <div className="loading-spinner">Loading products...</div>
                ) : (
                    <div className="products-slider-wrapper">
                        <Splide
                            options={{
                                type: 'slide',
                                perPage: 5,
                                perMove: 1,
                                gap: '1.5rem',
                                pagination: false,
                                breakpoints: {
                                    1200: { perPage: 4 },
                                    992: { perPage: 3 },
                                    768: { perPage: 2 },
                                    480: { perPage: 1, gap: '1rem' },
                                }
                            }}
                        >
                            {topProducts.map(product => (
                                <SplideSlide key={product.id}>
                                    <ProductCard product={product} />
                                </SplideSlide>
                            ))}
                        </Splide>
                    </div>
                )}
            </section>

            {/* Features Banner */}
            <section className="features-banner container">
                <div className="feature-item">
                    <div className="feature-icon">🚀</div>
                    <h3>Fast Delivery</h3>
                    <p>Get essentials delivered right to your hostel.</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">🛡️</div>
                    <h3>Secure Platform</h3>
                    <p>Safe transactions for students.</p>
                </div>
                <div className="feature-item">
                    <div className="feature-icon">💰</div>
                    <h3>Best Prices</h3>
                    <p>Exclusive discounts for campus students.</p>
                </div>
            </section>
        </div>
    );
};

export default Home;
