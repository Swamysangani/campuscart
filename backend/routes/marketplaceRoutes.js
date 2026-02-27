const express = require('express');
const router = express.Router();
const { getListings, addListing, deleteListing } = require('../controllers/marketplaceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getListings);
router.post('/', protect, addListing);
router.delete('/:id', protect, deleteListing);

module.exports = router;
