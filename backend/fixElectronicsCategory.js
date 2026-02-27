require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

const fix = async () => {
    try {
        await connectDB();

        // Update all FakeStore brand products that aren't "electronics" to be "electronics"
        const result = await Product.updateMany(
            { brand: 'FakeStore', category: { $ne: 'electronics' } },
            { $set: { category: 'electronics' } }
        );
        console.log(`Updated ${result.modifiedCount} FakeStore products to electronics category.`);

        const elecCount = await Product.countDocuments({ category: 'electronics' });
        const total = await Product.countDocuments();
        console.log(`Electronics products: ${elecCount}`);
        console.log(`Total products: ${total}`);

        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

fix();
