const mongoose = require('mongoose');
const dotenv = require('dotenv');

const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const seedProducts = async () => {
    try {
        await connectDB();

        console.log('--- FETCHING DATA FROM ALL SOURCES ---');

        // 1. Fetch from DummyJSON (General)
        console.log('Fetching from DummyJSON...');
        const dummyResponse = await fetch('https://dummyjson.com/products?limit=100');
        const dummyData = await dummyResponse.json();

        // 2. Fetch from FakeStore (Electronics)
        console.log('Fetching electronics from FakeStore...');
        const fakeResponse = await fetch('https://fakestoreapi.com/products/category/electronics');
        const fakeData = await fakeResponse.json();

        // 3. Fetch from Escuelajs (Large Dataset)
        console.log('Fetching from Escuelajs API...');
        const escuelaResponse = await fetch('https://api.escuelajs.co/api/v1/products');
        const escuelaData = await escuelaResponse.json();

        console.log('--- MAPPING AND FILTERING ---');

        // Helper to validate image URL
        const isValidImage = (url) => {
            if (!url || typeof url !== 'string') return false;
            return url.startsWith('http') && (url.includes('jpg') || url.includes('jpeg') || url.includes('png') || url.includes('webp') || url.includes('dummyjson'));
        };

        // Unified mapper for DummyJSON
        const mappedDummy = dummyData.products.map(item => {
            let cat = item.category;
            // Map tech categories to unified electronics
            if (cat === 'smartphones' || cat === 'laptops' || cat === 'mobile-accessories' || cat === 'tablets') {
                cat = 'electronics';
            }
            return {
                title: item.title,
                price: Math.round(item.price * 80),
                category: cat,
                description: item.description,
                image: item.thumbnail,
                rating: item.rating,
                stock: item.stock,
                brand: item.brand,
                discountPercentage: item.discountPercentage,
                thumbnail: item.thumbnail,
                source: 'DummyJSON'
            };
        }).filter(p => isValidImage(p.image));

        // Unified mapper for FakeStore
        const mappedFake = fakeData.map(item => ({
            title: item.title,
            price: Math.round(item.price * 80),
            category: 'electronics',
            description: item.description,
            image: item.image,
            rating: item.rating.rate,
            stock: Math.floor(Math.random() * 50) + 10,
            brand: 'FakeStore',
            discountPercentage: 0,
            thumbnail: item.image,
            source: 'FakeStore'
        })).filter(p => isValidImage(p.image));

        // Unified mapper for Escuelajs
        const mappedEscuela = escuelaData.map(item => {
            // Clean up the image URL which sometimes comes wrapped in brackets/quotes
            let imgUrl = item.images && item.images[0] ? item.images[0] : '';
            if (imgUrl.startsWith('[') && imgUrl.endsWith(']')) {
                try {
                    imgUrl = JSON.parse(imgUrl)[0];
                } catch (e) {
                    imgUrl = imgUrl.replace(/[\[\]"]/g, '');
                }
            }

            // Map categories to campuscart standard
            let cat = (item.category && item.category.name) ? item.category.name.toLowerCase() : 'other';
            if (cat.includes('electronics') || cat.includes('tech')) cat = 'electronics';

            return {
                title: item.title,
                price: Math.round(item.price * 80),
                category: cat,
                description: item.description,
                image: imgUrl,
                rating: 4.0, // Default rating for Escuelajs
                stock: 20,
                brand: 'Escuelajs',
                discountPercentage: 0,
                thumbnail: imgUrl,
                source: 'Escuelajs'
            };
        }).filter(p => isValidImage(p.image));

        // 4. Merge and Remove Duplicates (by normalized title)
        const allProducts = [...mappedDummy, ...mappedFake, ...mappedEscuela];
        const uniqueProducts = [];
        const seenTitles = new Set();

        for (const p of allProducts) {
            const normalizedTitle = p.title.toLowerCase().trim();
            if (!seenTitles.has(normalizedTitle)) {
                seenTitles.add(normalizedTitle);
                uniqueProducts.push(p);
            }
        }

        console.log(`Summary:`);
        console.log(`- DummyJSON: ${mappedDummy.length}`);
        console.log(`- FakeStore: ${mappedFake.length}`);
        console.log(`- Escuelajs: ${mappedEscuela.length}`);
        console.log(`- Total Unique valid: ${uniqueProducts.length}`);

        console.log('--- REFRESHING DATABASE ---');
        await Product.deleteMany({});
        const inserted = await Product.insertMany(uniqueProducts);

        console.log(`SUCCESS: ${inserted.length} products inserted into MongoDB.`);

        process.exit();
    } catch (error) {
        console.error('ERROR during seeding:', error);
        process.exit(1);
    }
};

seedProducts();
