const Product = require('../models/Product');

// @desc    Fetch all products with search, filter, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const { search, category, page = 1, limit = 8 } = req.query;
        const query = {};

        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }

        if (category && category.toLowerCase() !== 'all') {
            query.category = category;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(query)
            .limit(parseInt(limit))
            .skip(skip);

        const total = await Product.countDocuments(query);

        res.json({
            products,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            totalProducts: total,
            total // Keeping for compatibility
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching products' });
    }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(500).json({ message: 'Error fetching product' });
    }
};

module.exports = {
    getProducts,
    getProductById,
};
