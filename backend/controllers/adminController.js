const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Add a product
// @route   POST /api/admin/products
// @access  Private/Admin
const addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            Object.assign(product, req.body);
            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: req.params.id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('userId', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getUsers,
    getOrders,
    updateOrderStatus,
};
