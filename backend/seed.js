const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Marketplace = require('./models/Marketplace');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // 1. Seed Products from DummyJSON
        console.log('Fetching products from DummyJSON...');
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();

        const transformedProducts = data.products.map(item => ({
            title: item.title,
            price: Math.round(item.price * 80), // Convert to INR
            category: item.category,
            image: item.thumbnail,
            thumbnail: item.thumbnail,
            description: item.description,
            rating: item.rating,
            stock: item.stock,
            brand: item.brand,
            discountPercentage: item.discountPercentage
        }));

        await Product.deleteMany();
        await Product.insertMany(transformedProducts);
        console.log(`${transformedProducts.length} Products seeded successfully!`);

        // 2. Seed Initial Marketplace Data
        // We need at least one user to own these items
        let adminUser = await User.findOne();
        if (!adminUser) {
            console.log('No user found. Creating a system user for seeding...');
            adminUser = await User.create({
                name: 'System Admin',
                email: 'admin@campuscart.com',
                password: 'password123',
                role: 'admin'
            });
        }

        if (adminUser) {
            const marketplaceItems = [
                {
                    userId: adminUser._id,
                    title: 'Engineering Graphics Set',
                    price: 450,
                    category: 'Books & Stationery',
                    image: 'https://images.unsplash.com/photo-1583521214690-73421a1829a9?auto=format&fit=crop&q=80&w=800',
                    description: 'Complete set for first year engineering students. Includes drafter, compass, and sheets.'
                },
                {
                    userId: adminUser._id,
                    title: 'Laboratory Coat (Size L)',
                    price: 250,
                    category: 'Clothing',
                    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&q=80&w=800',
                    description: 'White lab coat, used for one semester. Good condition, washed and sanitized.'
                },
                {
                    userId: adminUser._id,
                    title: 'Dorm Desk Lamp',
                    price: 600,
                    category: 'Electronics',
                    image: 'https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800',
                    description: 'LED desk lamp with 3 brightness modes. Perfect for late night study sessions.'
                }
            ];

            await Marketplace.deleteMany();
            await Marketplace.insertMany(marketplaceItems);
            console.log('Marketplace data seeded successfully!');
        } else {
            console.log('Skipping Marketplace seeding: No user found in database.');
        }

        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
