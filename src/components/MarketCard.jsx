import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './MarketCard.css';

const MarketCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

    // Placeholder image for broken links
    const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?q=80&w=1958&auto=format&fit=crop';

    const handleImageError = (e) => {
        e.target.src = PLACEHOLDER_IMAGE;
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
    };

    // Strict validation: Do not render if image URL is missing or empty
    if (!product.image && !product.thumbnail) {
        return null;
    }

    return (
        <div className="market-card card">
            <Link to={`/marketplace/${product._id || product.id}`} className="market-card-link">
                <div className="market-image-container">
                    <img
                        src={product.image || product.thumbnail}
                        alt={product.title}
                        className="market-image"
                        loading="lazy"
                        onError={handleImageError}
                    />
                    <button
                        className={`wishlist-btn ${isInWishlist(product._id || product.id) ? 'active' : ''}`}
                        onClick={handleToggleWishlist}
                        aria-label="Toggle Wishlist"
                    >
                        <Heart size={20} fill={isInWishlist(product._id || product.id) ? 'currentColor' : 'none'} />
                    </button>
                    {product.discountPercentage > 0 && (
                        <span className="market-discount-badge">{product.discountPercentage}% OFF</span>
                    )}
                </div>
                <div className="market-info">
                    <span className="market-category-badge">{product.category}</span>
                    <h3 className="market-title" title={product.title}>{product.title}</h3>
                    <div className="market-price-row">
                        <span className="market-price">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.discountPercentage > 0 && (
                            <span className="product-original-price">
                                ₹{(product.price * (1 + product.discountPercentage / 100)).toFixed(0)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
            <div className="market-card-footer">
                <button className="btn-add-cart" onClick={handleAddToCart}>
                    <ShoppingCart size={18} /> Add to Cart
                </button>
            </div>
        </div>
    );
};

export default MarketCard;
