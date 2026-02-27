import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Layers, Search, Moon, Sun, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { CompareContext } from '../context/CompareContext';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { cartCount } = useContext(CartContext);
    const { compareItems } = useContext(CompareContext);
    const { user, logout } = useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/products?search=${searchTerm}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span>Campus</span>Cart
                </Link>

                <form className="search-bar" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search for products, brands and more"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <Search size={20} />
                    </button>
                </form>

                <div className="navbar-links">
                    <Link to="/products" className="nav-link">Products</Link>
                    <Link to="/marketplace" className="nav-link">Marketplace</Link>
                    {user && <Link to="/orders" className="nav-link">My Orders</Link>}
                    {user && user.role === 'admin' && (
                        <Link to="/admin" className="nav-link admin-nav-link">
                            <Shield size={15} /> Admin
                        </Link>
                    )}

                    <Link to="/compare" className="nav-icon" aria-label="Compare">
                        <Layers size={24} />
                        {compareItems.length > 0 && <span className="badge">{compareItems.length}</span>}
                    </Link>

                    <Link to="/cart" className="nav-icon" aria-label="Cart">
                        <ShoppingCart size={24} />
                        {cartCount > 0 && <span className="badge">{cartCount}</span>}
                    </Link>

                    {user ? (
                        <div className="user-nav">
                            <span className="user-name">Hi, {user.name.split(' ')[0]}</span>
                            <button onClick={handleLogout} className="nav-icon logout-btn" title="Logout">
                                <LogOut size={22} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="nav-icon auth-link" title="Login">
                            <UserIcon size={24} />
                        </Link>
                    )}

                    <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle Theme">
                        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
