const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
        },
        description: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            default: 0,
        },
        stock: {
            type: Number,
            default: 10,
        },
        brand: {
            type: String,
        },
        discountPercentage: {
            type: Number,
            default: 0,
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', productSchema);
