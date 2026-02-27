const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        const order = await Order.create({
            userId: req.user.id,
            items: cart.items.map(item => ({
                productId: item.productId,
                title: item.title,
                price: item.price,
                quantity: item.quantity
            })),
            totalPrice,
            status: 'pending' // explicit default
        });

        // Clear cart after order
        await Cart.deleteOne({ userId: req.user.id });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error placing order' });
    }
};

// @desc    Get user order history
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

module.exports = {
    placeOrder,
    getOrders,
};
