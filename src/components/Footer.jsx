import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h3>CampusCart</h3>
                    <p>Your one-stop destination for all campus needs. Books, electronics, hostel essentials, and more.</p>
                </div>

                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/products">Products</a></li>
                        <li><a href="/marketplace">Marketplace</a></li>
                        <li><a href="/compare">Compare</a></li>
                        <li><a href="/cart">Cart</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Customer Service</h4>
                    <ul>
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#faq">FAQ</a></li>
                        <li><a href="#shipping">Shipping Policy</a></li>
                        <li><a href="#returns">Returns</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Connect with Us</h4>
                    <p>Email: support@campuscart.com</p>
                    <div className="social-links">
                        <a href="#facebook" aria-label="Facebook">FB</a>
                        <a href="#twitter" aria-label="Twitter">TW</a>
                        <a href="#instagram" aria-label="Instagram">IG</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} CampusCart. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
