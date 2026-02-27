import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { toggleWishlist, isInWishlist } = useContext(WishlistContext);

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

    return (
        <div className="product-card card">
            <Link to={`/product/${product._id || product.id}`} className="product-card-link">
                <div className="product-image-container">
                    <img src={product.thumbnail || product.image} alt={product.title} className="product-image" loading="lazy" />
                    <button
                        className={`wishlist-btn ${isInWishlist(product._id || product.id) ? 'active' : ''}`}
                        onClick={handleToggleWishlist}
                        aria-label="Toggle Wishlist"
                    >
                        <Heart size={20} fill={isInWishlist(product._id || product.id) ? 'currentColor' : 'none'} />
                    </button>
                </div>
                <div className="product-info">
                    <h3 className="product-title" title={product.title}>{product.title}</h3>
                    <div className="product-rating">
                        <span className="star">★</span> {product.rating.toFixed(1)}
                    </div>
                    <div className="product-price-row">
                        <span className="product-price">₹{product.price.toFixed(2)}</span>
                        {product.discountPercentage > 0 && (
                            <>
                                <span className="product-original-price">
                                    ₹{(product.price * (1 + product.discountPercentage / 100)).toFixed(2)}
                                </span>
                                <span className="product-discount">{product.discountPercentage}% off</span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
            <div className="product-card-footer">
                <button className="btn-add-cart" onClick={handleAddToCart}>
                    <ShoppingCart size={18} /> Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
