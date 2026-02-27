const express = require('express');
const router = express.Router();
const {
    addProduct,
    updateProduct,
    deleteProduct,
    getUsers,
    getOrders,
    updateOrderStatus,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// All routes here are protected and admin-only
router.use(protect);
router.use(admin);

router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.get('/users', getUsers);

router.get('/orders', getOrders);
router.put('/orders/:id/status', updateOrderStatus);

module.exports = router;
