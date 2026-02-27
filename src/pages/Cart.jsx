import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, clearCart, cartCount } = useContext(CartContext);
    const { token, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        if (!user) {
            alert("Please login to place an order");
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert("Order placed successfully!");
                clearCart();
                navigate('/orders');
            } else {
                const data = await response.json();
                alert(data.message || "Failed to place order");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const calculateSubtotal = () => cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const calculateOriginalTotal = () => cartItems.reduce((acc, item) => {
        const discountPercentage = item.discountPercentage || 0;
        const origPrice = item.price * (1 + discountPercentage / 100);
        return acc + (origPrice * item.quantity);
    }, 0);

    const subtotal = calculateSubtotal();
    const originalTotal = calculateOriginalTotal();
    const discount = originalTotal - subtotal;
    const deliveryCharges = subtotal > 50 ? 0 : 5.99; // Free delivery over $50

    const totalAmount = subtotal + deliveryCharges;

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart-container container">
                <div className="empty-cart-content">
                    <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/empty-cart_ee8df1.png" alt="Empty Cart" className="empty-cart-img" />
                    <h2>Your cart is empty!</h2>
                    <p>Add items to it now.</p>
                    <Link to="/products" className="btn-primary mt-4">Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page container">
            <div className="cart-layout">

                {/* Left Column - Cart Items */}
                <div className="cart-items-section">
                    <div className="cart-header">
                        <h2>Shopping Cart ({cartCount} items)</h2>
                        <button className="btn-clear" onClick={clearCart}>Clear Cart</button>
                    </div>

                    <div className="cart-list">
                        {cartItems.map(item => (
                            <div key={item._id || item.productId} className="cart-item">
                                <Link to={`/product/${item.productId}`} className="cart-item-image">
                                    <img src={item.image || item.thumbnail} alt={item.title} />
                                </Link>

                                <div className="cart-item-details">
                                    <Link to={`/product/${item.id}`} className="cart-item-title">{item.title}</Link>
                                    <p className="cart-item-brand">{item.brand || 'Generic'}</p>

                                    <div className="cart-item-price-row">
                                        <span className="current-price">₹{item.price.toFixed(2)}</span>
                                        {item.discountPercentage > 0 && (
                                            <>
                                                <span className="original-price">₹{(item.price * (1 + item.discountPercentage / 100)).toFixed(2)}</span>
                                                <span className="discount-perc">{item.discountPercentage}% Off</span>
                                            </>
                                        )}
                                    </div>

                                    <div className="cart-item-actions">
                                        <div className="quantity-controls">
                                            <button
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                disabled={item.quantity <= 1}
                                            >-</button>
                                            <span className="quantity-value">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                                        </div>

                                        <button className="btn-remove" onClick={() => removeFromCart(item.productId)}>
                                            <Trash2 size={18} /> Remove
                                        </button>
                                    </div>
                                </div>

                                <div className="cart-item-delivery">
                                    <p>Delivery by <strong>Tomorrow</strong></p>
                                    <span>Hostel / Campus delivery</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Price Summary */}
                <div className="cart-summary-section">
                    <div className="price-details-card">
                        <h3 className="summary-title">PRICE DETAILS</h3>

                        <div className="summary-row">
                            <span>Price ({cartCount} items)</span>
                            <span>₹{originalTotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row discount-row">
                            <span>Discount</span>
                            <span>-₹{discount.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery Charges</span>
                            <span className={deliveryCharges === 0 ? 'free-delivery' : ''}>
                                {deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges.toFixed(2)}`}
                            </span>
                        </div>

                        <div className="summary-total-row">
                            <span>Total Amount</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>

                        <div className="savings-msg">
                            You will save ₹{discount.toFixed(2)} on this order
                        </div>
                    </div>

                    <button className="btn-place-order" onClick={handlePlaceOrder}>
                        PLACE ORDER
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
