/**
 * addElectronics.js
 * 
 * Safely adds electronics products from FakeStore API.
 * - Does NOT delete any existing products
 * - Checks for duplicates by title before inserting
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const addElectronics = async () => {
    try {
        await connectDB();

        console.log('--- Fetching ALL FakeStore products ---');
        const response = await fetch('https://fakestoreapi.com/products');
        const fakeData = await response.json();

        // Also fetch from electronics category specifically
        const elecResponse = await fetch('https://fakestoreapi.com/products/category/electronics');
        const elecData = await elecResponse.json();

        // Merge and de-dupe by id
        const allFake = [...fakeData, ...elecData];
        const seenIds = new Set();
        const uniqueFake = allFake.filter(item => {
            if (seenIds.has(item.id)) return false;
            seenIds.add(item.id);
            return true;
        });

        console.log(`FakeStore returned ${uniqueFake.length} total products.`);

        // Get existing titles from DB to avoid duplicates
        const existingProducts = await Product.find({}, 'title');
        const existingTitles = new Set(
            existingProducts.map(p => p.title.toLowerCase().trim())
        );

        console.log(`Database currently has ${existingTitles.size} products.`);

        // Map and filter only NEW products
        const newProducts = [];
        for (const item of uniqueFake) {
            const normalizedTitle = item.title.toLowerCase().trim();
            if (existingTitles.has(normalizedTitle)) {
                console.log(`  [SKIP - duplicate] ${item.title}`);
                continue;
            }

            // Determine category: electronics by default unless it's something else
            let category = item.category === "electronics" ? "electronics" : item.category;

            newProducts.push({
                title: item.title,
                price: Math.round(item.price * 80), // Convert to INR
                category: category,
                description: item.description,
                image: item.image,
                thumbnail: item.image,
                rating: item.rating?.rate || 4.0,
                stock: Math.floor(Math.random() * 50) + 10,
                brand: 'FakeStore',
                discountPercentage: 0,
            });

            existingTitles.add(normalizedTitle); // Track to avoid inserting dupes from this batch
        }

        if (newProducts.length === 0) {
            console.log('No new products to add. All FakeStore items already exist.');
            process.exit();
        }

        console.log(`\nInserting ${newProducts.length} new products...`);
        const inserted = await Product.insertMany(newProducts);
        console.log(`SUCCESS: ${inserted.length} new products added!`);

        // Summary by category
        const categoryCount = {};
        inserted.forEach(p => {
            categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
        });
        console.log('\nInserted by category:', categoryCount);

        const totalNow = await Product.countDocuments();
        console.log(`\nTotal products in DB now: ${totalNow}`);

        process.exit();
    } catch (error) {
        console.error('ERROR:', error.message);
        process.exit(1);
    }
};

addElectronics();
