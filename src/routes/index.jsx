import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetails from '../pages/ProductDetails';
import Cart from '../pages/Cart';
import Compare from '../pages/Compare';
import Marketplace from '../pages/Marketplace';
import MarketDetails from '../pages/MarketDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Orders from '../pages/Orders';
import AdminPanel from '../pages/AdminPanel';
import AdminRoute from '../components/AdminRoute';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="products" element={<Products />} />
                    <Route path="product/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="compare" element={<Compare />} />
                    <Route path="marketplace" element={<Marketplace />} />
                    <Route path="marketplace/:id" element={<MarketDetails />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="admin" element={
                        <AdminRoute>
                            <AdminPanel />
                        </AdminRoute>
                    } />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
