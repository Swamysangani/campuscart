const Cart = require('../models/Cart');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user.id });

    if (cart) {
        res.json(cart);
    } else {
        res.json({ userId: req.user.id, items: [] });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    const { productId, title, price, image, quantity, discountPercentage } = req.body;

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
        cart = await Cart.create({
            userId: req.user.id,
            items: [{ productId, title, price, image, quantity, discountPercentage }],
        });
    } else {
        // Check if item exists
        const itemIndex = cart.items.findIndex((item) => item.productId === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ productId, title, price, image, quantity, discountPercentage });
        }
        await cart.save();
    }

    res.status(201).json(cart);
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res) => {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId === productId);

    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        await cart.save();
        res.json(cart);
    } else {
        res.status(404).json({ message: 'Item not found in cart' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter((item) => item.productId !== productId);
    await cart.save();

    res.json(cart);
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
};
