import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { CompareContext } from '../context/CompareContext';
import { CartContext } from '../context/CartContext';
import './Compare.css';

const Compare = () => {
    const { compareItems, removeFromCompare, clearCompare } = useContext(CompareContext);
    const { addToCart } = useContext(CartContext);

    if (compareItems.length === 0) {
        return (
            <div className="empty-compare-container container">
                <div className="empty-compare-content">
                    <div className="compare-icon-large">⚖️</div>
                    <h2>Compare Products</h2>
                    <p>You haven't added any products to compare yet.</p>
                    <p className="subtitle">Select up to 2 products to see them side-by-side.</p>
                    <Link to="/products" className="btn-primary mt-4">Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="compare-page container">
            <div className="compare-header">
                <h1>Compare Products</h1>
                <button className="btn-clear" onClick={clearCompare}>Clear All</button>
            </div>

            <div className="compare-table-container">
                <table className="compare-table">
                    <thead>
                        <tr>
                            <th className="feature-col">Features</th>
                            {compareItems.map(item => (
                                <th key={item.id} className="product-col">
                                    <div className="compare-product-header">
                                        <button
                                            className="btn-remove-compare"
                                            onClick={() => removeFromCompare(item.id)}
                                            title="Remove from compare"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="compare-img-wrapper">
                                            <img src={item.thumbnail} alt={item.title} />
                                        </div>
                                        <Link to={`/product/${item.id}`} className="compare-title">
                                            {item.title}
                                        </Link>
                                    </div>
                                </th>
                            ))}
                            {/* Empty placeholder if only 1 item */}
                            {compareItems.length === 1 && (
                                <th className="product-col empty-col">
                                    <div className="add-more-box">
                                        <div className="plus-icon">+</div>
                                        <p>Add a product</p>
                                        <Link to="/products" className="btn-outline">Browse</Link>
                                    </div>
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="feature-col">Price</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="price-cell">
                                    <span className="current-price">₹{item.price.toFixed(2)}</span>
                                    <span className="original-price">₹{(item.price * (1 + item.discountPercentage / 100)).toFixed(2)}</span>
                                    <span className="discount">{item.discountPercentage}% Off</span>
                                </td>
                            ))}
                            {compareItems.length === 1 && <td className="empty-cell"></td>}
                        </tr>

                        <tr>
                            <td className="feature-col">Rating</td>
                            {compareItems.map(item => (
                                <td key={item.id}>
                                    <div className="rating-badge">{item.rating.toFixed(1)} ★</div>
                                </td>
                            ))}
                            {compareItems.length === 1 && <td className="empty-cell"></td>}
                        </tr>

                        <tr>
                            <td className="feature-col">Brand</td>
                            {compareItems.map(item => (
                                <td key={item.id}>{item.brand || 'Generic'}</td>
                            ))}
                            {compareItems.length === 1 && <td className="empty-cell"></td>}
                        </tr>

                        <tr>
                            <td className="feature-col">Category</td>
                            {compareItems.map(item => (
                                <td key={item.id} className="category-cell">{item.category}</td>
                            ))}
                            {compareItems.length === 1 && <td className="empty-cell"></td>}
                        </tr>

                        <tr>
                            <td className="feature-col">Stock Status</td>
                            {compareItems.map(item => (
                                <td key={item.id} className={item.stock > 0 ? 'in-stock' : 'out-of-stock'}>
                                    {item.availabilityStatus}
                                </td>
                            ))}
                            {compareItems.length === 1 && <td className="empty-cell"></td>}
                        </tr>

                        <tr>
                            <td className="feature-col">Warranty</td>
                            {compareItems.map(item => (
                                <td key={item.id}>{item.warrantyInformation}</td>
                            ))}
                            {compareItems.length === 1 && <td className="empty-cell"></td>}
                        </tr>

                        <tr>
                            <td className="feature-col">Shipping</td>
                            {compareItems.map(item => (
                                <td key={item.id}>{item.shippingInformation}</td>
                            ))}
                            {compareItems.length === 1 && <td className="empty-cell"></td>}
                        </tr>

                        <tr className="action-row">
                            <td className="feature-col"></td>
                            {compareItems.map(item => (
                                <td key={item.id}>
                                    <button className="btn-add-to-cart-compare" onClick={() => addToCart(item)}>
                                        <ShoppingCart size={18} /> Add to Cart
                                    </button>
                                </td>
                            ))}
                            {compareItems.length === 1 && <td className="empty-cell"></td>}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Compare;
