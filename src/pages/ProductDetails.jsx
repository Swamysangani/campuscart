import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Layers } from 'lucide-react';
import { fetchProductById, fetchProducts } from '../services/api';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { CompareContext } from '../context/CompareContext';
import ProductCard from '../components/ProductCard';
import './ProductDetails.css';

const ProductDetails = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const { addToCompare, isInCompare } = useContext(CompareContext);

    useEffect(() => {
        const getProduct = async () => {
            try {
                setLoading(true);

                const data = await fetchProductById(id);
                setProduct(data);

                if (data && data.category) {
                    const response = await fetchProducts(1, 20);
                    const allProducts = response.products || [];

                    const related = allProducts
                        .filter(p => p.category === data.category && p.id !== data.id)
                        .slice(0, 4);

                    setRelatedProducts(related);
                }

            } catch (error) {
                console.error("Error loading product details:", error);
            } finally {
                setLoading(false);
                window.scrollTo(0, 0);
            }
        };

        getProduct();
    }, [id]);

    if (loading)
        return <div className="container loading-text">Loading product details...</div>;

    if (!product)
        return <div className="container error-text">Product not found.</div>;

    const productId = product._id || product.id;

    const originalPrice = product.discountPercentage
        ? (product.price * (1 + product.discountPercentage / 100)).toFixed(2)
        : product.price;

    return (
        <div className="product-details-page container">

            <div className="breadcrumbs">
                <Link to="/">Home</Link> &gt;
                <Link to="/products"> Products</Link> &gt;
                <span> {product.title}</span>
            </div>

            <div className="product-layout">

                {/* LEFT SECTION */}
                <div className="product-image-section">
                    <div className="main-image-container">

                        <button
                            className={`wishlist-icon-btn ${isInWishlist(productId) ? 'active' : ''}`}
                            onClick={() => toggleWishlist(product)}
                        >
                            <Heart
                                size={24}
                                fill={isInWishlist(productId) ? 'currentColor' : 'none'}
                            />
                        </button>

                        <img
                            src={product.image || product.thumbnail}
                            alt={product.title}
                            className="main-image"
                        />
                    </div>

                    <div className="action-buttons">
                        <button
                            className="btn-add-to-cart"
                            onClick={() => addToCart(product)}
                        >
                            <ShoppingCart size={20} /> ADD TO CART
                        </button>

                        <button
                            className="btn-buy-now"
                            onClick={() => {
                                addToCart(product);
                                alert('Added to cart & redirecting to checkout...');
                            }}
                        >
                            BUY NOW
                        </button>
                    </div>
                </div>

                {/* RIGHT SECTION */}
                <div className="product-info-section">

                    <h1 className="product-title-large">{product.title}</h1>

                    <div className="product-rating-large">
                        <span className="rating-badge">
                            {product.rating ? product.rating.toFixed(1) : "0.0"} ★
                        </span>
                        <span className="reviews-count">
                            ({Math.floor(Math.random() * 500) + 50} Ratings & Reviews)
                        </span>
                    </div>

                    <div className="price-section">
                        <span className="current-price">
                            ₹{product.price.toFixed(2)}
                        </span>

                        {product.discountPercentage && (
                            <>
                                <span className="original-price">
                                    ₹{originalPrice}
                                </span>
                                <span className="discount-perc">
                                    {product.discountPercentage}% off
                                </span>
                            </>
                        )}
                    </div>

                    <div className="compare-action">
                        <button
                            className={`btn-compare ${isInCompare(productId) ? 'active' : ''}`}
                            onClick={() => addToCompare(product)}
                        >
                            <Layers size={18} />
                            {isInCompare(productId)
                                ? ' Added to Compare'
                                : ' Add to Compare'}
                        </button>
                    </div>

                    <div className="offers-section">
                        <h3>Available offers</h3>
                        <ul>
                            <li><strong>Bank Offer:</strong> 5% Cashback on Campus Bank Credit Card</li>
                            <li><strong>Special Price:</strong> Extra 10% off</li>
                            <li><strong>Partner Offer:</strong> ₹50 gift card</li>
                        </ul>
                    </div>

                    <div className="highlights-section">

                        <div className="highlights-row">
                            <span className="highlight-label">Brand</span>
                            <span className="highlight-value">
                                {product.brand || 'Generic'}
                            </span>
                        </div>

                        <div className="highlights-row">
                            <span className="highlight-label">Stock Status</span>
                            <span
                                className="highlight-value"
                                style={{
                                    color: product.stock > 0
                                        ? 'var(--success-color)'
                                        : 'var(--accent-color)'
                                }}
                            >
                                {product.stock > 0
                                    ? `In Stock (${product.stock})`
                                    : 'Out of Stock'}
                            </span>
                        </div>

                        <div className="highlights-row">
                            <span className="highlight-label">Description</span>
                            <span className="highlight-value description-text">
                                {product.description}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            {/* RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
                <div className="related-products-section">
                    <h2>Similar Products</h2>
                    <div className="related-grid">
                        {relatedProducts.map(rp => (
                            <ProductCard key={rp.id} product={rp} />
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default ProductDetails;