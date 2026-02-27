import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Layers, Trash2, MessageCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { CompareContext } from '../context/CompareContext';
import './ProductDetails.css';
import './MarketDetails.css';

const MarketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
    const { addToCompare, isInCompare } = useContext(CompareContext);

    const getProductId = (item) => item._id || item.id;

    useEffect(() => {
        const stored = localStorage.getItem('marketplaceItems');

        if (stored) {
            const items = JSON.parse(stored);

            const found = items.find(
                item => getProductId(item) === id
            );

            setProduct(found || null);
        }

        setLoading(false);
        window.scrollTo(0, 0);
    }, [id]);

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this listing?")) {
            const stored = localStorage.getItem('marketplaceItems');

            if (stored) {
                let items = JSON.parse(stored);

                items = items.filter(
                    item => getProductId(item) !== id
                );

                localStorage.setItem('marketplaceItems', JSON.stringify(items));
                navigate('/marketplace');
            }
        }
    };

    if (loading)
        return <div className="container loading-text">Loading item details...</div>;

    if (!product)
        return (
            <div className="container error-text">
                <h2>Listing not found</h2>
                <p>This item might have been pulled down or deleted.</p>
                <Link to="/marketplace" className="btn-primary mt-4 d-inline-block">
                    Back to Marketplace
                </Link>
            </div>
        );

    const productId = getProductId(product);

    const originalPrice = product.discountPercentage
        ? (product.price * (1 + product.discountPercentage / 100)).toFixed(0)
        : null;

    return (
        <div className="product-details-page container">
            <div className="breadcrumbs">
                <Link to="/">Home</Link> &gt;
                <Link to="/marketplace"> Marketplace</Link> &gt;
                <span> {product.title}</span>
            </div>

            <div className="product-layout market-layout">

                {/* LEFT */}
                <div className="product-image-section">
                    <div className="main-image-container market-main-image">
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

                {/* RIGHT */}
                <div className="product-info-section market-info-section">
                    <span className="market-badge">{product.category}</span>
                    <h1 className="product-title-large">{product.title}</h1>

                    <div className="price-section market-price-section">
                        <span className="current-price">
                            ₹{product.price.toLocaleString('en-IN')}
                        </span>

                        {originalPrice && (
                            <span className="original-price">₹{originalPrice}</span>
                        )}

                        {product.discountPercentage && (
                            <span className="discount-perc">
                                {product.discountPercentage}% off (vs New)
                            </span>
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

                    <div className="highlights-section mt-4">
                        <div className="highlights-row">
                            <span className="highlight-label">Condition</span>
                            <span className="highlight-value">
                                Used / Second Hand
                            </span>
                        </div>

                        <div className="highlights-row">
                            <span className="highlight-label">Description</span>
                            <span className="highlight-value description-text">
                                {product.description}
                            </span>
                        </div>
                    </div>

                    <div className="action-buttons market-actions">
                        <button
                            className="btn-primary btn-contact"
                            onClick={() =>
                                alert("Simulating contacting the seller...")
                            }
                        >
                            <MessageCircle size={20} /> Contact Seller
                        </button>

                        <button
                            className="btn-outline btn-delete"
                            onClick={handleDelete}
                        >
                            <Trash2 size={20} /> Delete Listing
                        </button>
                    </div>

                    <div className="seller-safety-tip mt-4">
                        <h4>Safety Tip</h4>
                        <p>
                            Meet in public campus areas for exchange.
                            Never transfer money without seeing the item in person.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketDetails;