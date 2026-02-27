import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!token) return;
            try {
                const response = await fetch('http://localhost:5000/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [token]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered': return <CheckCircle className="status-icon delivered" />;
            case 'shipped': return <Package className="status-icon shipped" />;
            default: return <Clock className="status-icon pending" />;
        }
    };

    if (isLoading) return <div className="container mt-5">Loading orders...</div>;

    return (
        <div className="orders-container container">
            <h2 className="page-title">My Orders</h2>

            {orders.length === 0 ? (
                <div className="empty-orders">
                    <Package size={64} />
                    <h3>No orders found.</h3>
                    <p>Start shopping to see your orders here!</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <span className="order-id">Order ID: #{order._id.slice(-8)}</span>
                                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="order-status">
                                    {getStatusIcon(order.status)}
                                    <span className={`status-text ${order.status}`}>{order.status}</span>
                                </div>
                            </div>
                            <div className="order-items">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="order-item">
                                        <span className="item-name">{item.title}</span>
                                        <span className="item-qty">x{item.quantity}</span>
                                        <span className="item-price">₹{item.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <span className="order-total">Total: ₹{order.totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
