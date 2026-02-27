const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        items: [
            {
                productId: {
                    type: String, // String because it could be numeric from DummyJSON or custom
                    required: true,
                },
                title: String,
                price: Number,
                discountPercentage: Number,
                image: String,
                quantity: {
                    type: Number,
                    required: true,
                    default: 1,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Cart', cartSchema);
