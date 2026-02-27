const express = require('express');
const router = express.Router();
const { placeOrder, getOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', placeOrder);
router.get('/', getOrders);

module.exports = router;
