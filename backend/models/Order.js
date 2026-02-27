const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        items: [
            {
                productId: {
                    type: String,
                    required: true,
                },
                title: String,
                price: Number,
                quantity: Number,
            },
        ],
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'shipped', 'delivered'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', orderSchema);
