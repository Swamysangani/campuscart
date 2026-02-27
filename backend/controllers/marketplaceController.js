const Marketplace = require('../models/Marketplace');

// @desc    Get all marketplace listings
// @route   GET /api/marketplace
// @access  Public
const getListings = async (req, res) => {
    try {
        const listings = await Marketplace.find({}).populate('userId', 'name email');
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching listings' });
    }
};

// @desc    Add a listing
// @route   POST /api/marketplace
// @access  Private
const addListing = async (req, res) => {
    const { title, price, category, image, description } = req.body;

    if (!title || !price || !category || !image || !description) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const listing = await Marketplace.create({
            userId: req.user.id,
            title,
            price,
            category,
            image,
            description,
        });

        res.status(201).json(listing);
    } catch (error) {
        res.status(500).json({ message: 'Error creating listing' });
    }
};

// @desc    Delete a listing
// @route   DELETE /api/marketplace/:id
// @access  Private
const deleteListing = async (req, res) => {
    try {
        const listing = await Marketplace.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Check for user ownership
        if (listing.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to delete this listing' });
        }

        await listing.deleteOne();
        res.json({ message: 'Listing removed', id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting listing' });
    }
};

module.exports = {
    getListings,
    addListing,
    deleteListing,
};
