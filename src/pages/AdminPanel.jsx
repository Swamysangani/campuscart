import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminPanel.css';

const API = 'http://localhost:5000/api';

const AdminPanel = () => {
    const { user, token } = useContext(AuthContext);
    const navigate = useNavigate();

    // ── Product State ──────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [productForm, setProductForm] = useState({
        title: '', price: '', category: 'electronics',
        image: '', description: '', brand: '', rating: '4.0',
        stock: '20', discountPercentage: '0'
    });
    const [productSearch, setProductSearch] = useState('');
    const [productMsg, setProductMsg] = useState('');

    // ── Order State ────────────────────────────────────────
    const [orders, setOrders] = useState([]);
    const [orderMsg, setOrderMsg] = useState('');

    // ── Tab ────────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState('products');

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };

    // ── Load Data ──────────────────────────────────────────
    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API}/products?limit=500`);
            const data = await res.json();
            setProducts(data.products || []);
        } catch (e) { console.error(e); }
    };

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API}/admin/orders`, { headers: authHeaders });
            if (res.ok) setOrders(await res.json());
        } catch (e) { console.error(e); }
    };

    // ── Product Handlers ───────────────────────────────────
    const handleProductChange = (e) => {
        setProductForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setProductMsg('');
        try {
            const res = await fetch(`${API}/admin/products`, {
                method: 'POST',
                headers: authHeaders,
                body: JSON.stringify({
                    ...productForm,
                    price: Number(productForm.price),
                    rating: Number(productForm.rating),
                    stock: Number(productForm.stock),
                    discountPercentage: Number(productForm.discountPercentage),
                    thumbnail: productForm.image
                })
            });
            if (res.ok) {
                const newProduct = await res.json();
                setProducts(prev => [newProduct, ...prev]);
                setProductForm({ title: '', price: '', category: 'electronics', image: '', description: '', brand: '', rating: '4.0', stock: '20', discountPercentage: '0' });
                setProductMsg('✅ Product added successfully!');
            } else {
                const err = await res.json();
                setProductMsg(`❌ Error: ${err.message}`);
            }
        } catch (e) { setProductMsg(`❌ ${e.message}`); }
    };

    const handleDeleteProduct = async (id, title) => {
        if (!window.confirm(`Delete "${title}"?`)) return;
        try {
            const res = await fetch(`${API}/admin/products/${id}`, {
                method: 'DELETE', headers: authHeaders
            });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p._id !== id));
                setProductMsg('🗑️ Product deleted.');
            }
        } catch (e) { console.error(e); }
    };

    // ── Order Handlers ─────────────────────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const res = await fetch(`${API}/admin/orders/${orderId}/status`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
                setOrderMsg(`✅ Order status updated to "${newStatus}".`);
                setTimeout(() => setOrderMsg(''), 3000);
            }
        } catch (e) { console.error(e); }
    };

    // ── Filtered Products ──────────────────────────────────
    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(productSearch.toLowerCase())
    );

    const statusBadge = (status) => {
        const colors = { pending: '#f59e0b', shipped: '#3b82f6', delivered: '#22c55e', cancelled: '#ef4444' };
        return <span className="status-badge" style={{ backgroundColor: colors[status] || '#6b7280' }}>{status}</span>;
    };

    return (
        <div className="admin-panel">
            {/* Header */}
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">⚙️ Admin Panel</h1>
                    <p className="admin-subtitle">Manage products and orders</p>
                </div>
                <div className="admin-stats">
                    <div className="stat-box">
                        <span className="stat-number">{products.length}</span>
                        <span className="stat-label">Products</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-number">{orders.length}</span>
                        <span className="stat-label">Orders</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                >📦 Products</button>
                <button
                    className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                >📋 Orders <span className="tab-badge">{orders.length}</span></button>
            </div>

            {/* ─── PRODUCTS TAB ──────────────────────────────── */}
            {activeTab === 'products' && (
                <div className="admin-content">
                    {/* Add Product Form */}
                    <section className="admin-section">
                        <h2 className="section-title">➕ Add New Product</h2>
                        {productMsg && <div className={`admin-msg ${productMsg.startsWith('✅') ? 'success' : 'error'}`}>{productMsg}</div>}
                        <form className="admin-form" onSubmit={handleAddProduct}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input name="title" value={productForm.title} onChange={handleProductChange} required placeholder="Product name" />
                                </div>
                                <div className="form-group">
                                    <label>Price (₹) *</label>
                                    <input type="number" name="price" value={productForm.price} onChange={handleProductChange} required min="0" placeholder="e.g. 1299" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select name="category" value={productForm.category} onChange={handleProductChange}>
                                        <option value="electronics">Electronics</option>
                                        <option value="beauty">Beauty</option>
                                        <option value="fragrances">Fragrances</option>
                                        <option value="furniture">Furniture</option>
                                        <option value="groceries">Groceries</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Brand</label>
                                    <input name="brand" value={productForm.brand} onChange={handleProductChange} placeholder="e.g. Samsung" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Image URL *</label>
                                <input name="image" value={productForm.image} onChange={handleProductChange} required placeholder="https://..." />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Rating (0–5)</label>
                                    <input type="number" name="rating" value={productForm.rating} onChange={handleProductChange} min="0" max="5" step="0.1" />
                                </div>
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input type="number" name="stock" value={productForm.stock} onChange={handleProductChange} min="0" />
                                </div>
                                <div className="form-group">
                                    <label>Discount (%)</label>
                                    <input type="number" name="discountPercentage" value={productForm.discountPercentage} onChange={handleProductChange} min="0" max="100" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description *</label>
                                <textarea name="description" value={productForm.description} onChange={handleProductChange} required rows={3} placeholder="Product description..." />
                            </div>
                            <button type="submit" className="btn-admin-primary">Add Product</button>
                        </form>
                    </section>

                    {/* Product List */}
                    <section className="admin-section">
                        <div className="section-header-row">
                            <h2 className="section-title">📋 All Products ({products.length})</h2>
                            <input
                                className="admin-search"
                                placeholder="Search products..."
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                            />
                        </div>
                        <div className="admin-table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(p => (
                                        <tr key={p._id}>
                                            <td>
                                                <img src={p.thumbnail || p.image} alt={p.title} className="table-img" onError={e => e.target.src = 'https://via.placeholder.com/50'} />
                                            </td>
                                            <td className="product-title-cell" title={p.title}>{p.title}</td>
                                            <td><span className="category-tag">{p.category}</span></td>
                                            <td className="price-cell">₹{p.price?.toLocaleString()}</td>
                                            <td>{p.stock ?? '—'}</td>
                                            <td>
                                                <button className="btn-delete" onClick={() => handleDeleteProduct(p._id, p.title)}>
                                                    🗑️ Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredProducts.length === 0 && (
                                <div className="table-empty">No products found.</div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {/* ─── ORDERS TAB ────────────────────────────────── */}
            {activeTab === 'orders' && (
                <div className="admin-content">
                    <section className="admin-section">
                        <h2 className="section-title">📋 All Orders ({orders.length})</h2>
                        {orderMsg && <div className="admin-msg success">{orderMsg}</div>}
                        {orders.length === 0 ? (
                            <div className="table-empty">No orders yet.</div>
                        ) : (
                            <div className="admin-table-wrapper">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th>
                                            <th>Customer</th>
                                            <th>Items</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th>Update Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order._id}>
                                                <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                                                <td>
                                                    <div>{order.userId?.name || 'Unknown'}</div>
                                                    <div className="order-email">{order.userId?.email || ''}</div>
                                                </td>
                                                <td>
                                                    <ul className="order-items-list">
                                                        {order.items.map((item, i) => (
                                                            <li key={i}>{item.title} × {item.quantity}</li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="price-cell">₹{order.totalPrice?.toLocaleString()}</td>
                                                <td>{statusBadge(order.status)}</td>
                                                <td>
                                                    <select
                                                        className="status-select"
                                                        value={order.status}
                                                        onChange={e => handleStatusChange(order._id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
