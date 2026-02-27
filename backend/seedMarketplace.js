/**
 * seedMarketplace.js
 * 
 * Adds realistic sample marketplace listings.
 * - Does NOT delete existing listings
 * - Skips if a listing with the same title already exists
 * - All images are verified working URLs
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Marketplace = require('./models/Marketplace');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

const SAMPLE_LISTINGS = [
    // --- Electronics ---
    {
        title: 'Used Dell Inspiron 15 Laptop',
        price: 22000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        description: 'Good condition Dell laptop, 8GB RAM, 256GB SSD, Intel i5. Minor scratches on lid. Battery holds ~4 hrs.',
    },
    {
        title: 'Second-hand OnePlus 9 Pro',
        price: 18000,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        description: 'OnePlus 9 Pro in excellent condition, 12GB RAM, 256GB storage. Original charger included.',
    },
    {
        title: 'Boat Rockerz 450 Bluetooth Headphones',
        price: 900,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        description: 'Used for 6 months, works perfectly. Foldable design, 15hr battery life. Minor wear on ear cups.',
    },
    {
        title: 'Casio Scientific Calculator FX-991ES',
        price: 550,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=400',
        description: 'Standard calculator used for 1 year. All functions working. Comes with hard case.',
    },
    {
        title: 'Amazon Kindle Paperwhite (7th Gen)',
        price: 4500,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
        description: 'E-reader in great condition. Waterproof, 8GB, 300ppi display. Screen has no scratches.',
    },
    {
        title: 'HP DeskJet 2331 Inkjet Printer',
        price: 2800,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=400',
        description: 'Working printer, lightly used. Includes 1 spare black ink cartridge. Perfect for notes and assignments.',
    },
    {
        title: 'USB-C Hub (7-in-1) for Laptop',
        price: 700,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1601158935942-52255782d322?w=400',
        description: 'Works with MacBook and Windows laptops. Ports: HDMI, USB 3.0 x3, SD card, USB-C PD.',
    },

    // --- Books & Stationery ---
    {
        title: 'Engineering Mathematics Textbook (3rd Year)',
        price: 250,
        category: 'Books & Stationery',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
        description: 'Advanced Engineering Mathematics by Kreyszig. A few annotations in pencil, otherwise clean.',
    },
    {
        title: 'GATE 2024 CS Study Material Set',
        price: 1200,
        category: 'Books & Stationery',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
        description: 'Complete GATE CS prep notes and previous year papers. Includes 5 subject booklets.',
    },
    {
        title: 'College Notebook Bundle (10 pcs)',
        price: 180,
        category: 'Books & Stationery',
        image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400',
        description: '10 ruled notebooks, 200 pages each. Unused, bought in bulk. Perfect for semester notes.',
    },

    // --- Clothing ---
    {
        title: 'Campus Hoodie - Navy Blue (L)',
        price: 450,
        category: 'Clothing',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400',
        description: 'College hoodie, worn twice, washed and clean. Size L, fits M-L comfortably.',
    },
    {
        title: 'Formal Shirt - White (M)',
        price: 300,
        category: 'Clothing',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400',
        description: 'Used for internship interviews, dry cleaned. Size M, excellent condition.',
    },
    {
        title: 'Sports Shoes - Nike (Size 9)',
        price: 1500,
        category: 'Clothing',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        description: 'Nike running shoes, used for 3 months. No tears, soles intact. Size UK 9.',
    },

    // --- Furniture & Essentials ---
    {
        title: 'Wooden Study Table with Drawer',
        price: 2500,
        category: 'Furniture',
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        description: 'Solid wood study table with one wide drawer. 4 ft wide, perfect for hostel room. Minor scratches.',
    },
    {
        title: 'Ergonomic Study Chair',
        price: 1800,
        category: 'Furniture',
        image: 'https://images.unsplash.com/photo-1586880244406-556ebe35f282?w=400',
        description: 'Adjustable height mesh back chair. Used for 1 year, all adjustments work. Very comfortable.',
    },
    {
        title: 'Large Backpack (40L) - Black',
        price: 650,
        category: 'Clothing',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        description: 'Waterproof 40L backpack, fits 15" laptop. Used for 6 months, no tears or broken zips.',
    },
    {
        title: 'Mini Table Fan',
        price: 400,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        description: 'USB + AC powered table fan. 3-speed settings. Works great, used for 2 months in hostel.',
    },
    {
        title: 'Gym Dumbbell Set (2x5kg)',
        price: 800,
        category: 'Other',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
        description: 'Pair of 5kg iron dumbbells. Slightly rusted on edges, rubber grip intact. Great for dorm workouts.',
    },
    {
        title: 'Tiffin Box Set (3-Tier Steel)',
        price: 250,
        category: 'Other',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400',
        description: 'Stainless steel 3-tier lunch box. Leak-proof, easy to carry. Used for 1 semester.',
    },
    {
        title: 'Electric Kettle 1.5L',
        price: 500,
        category: 'Electronics',
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
        description: 'Bajaj electric kettle, 1500W. Boils in 2 mins. Used for 8 months, works perfectly.',
    },
];

const seedMarketplace = async () => {
    try {
        await connectDB();

        // Find or create a system user for these listings
        let systemUser = await User.findOne({ email: 'system@campuscart.com' });
        if (!systemUser) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('systempass123', salt);
            systemUser = await User.create({
                name: 'CampusCart Demo',
                email: 'system@campuscart.com',
                password: hashedPassword,
                role: 'admin',
            });
            console.log('Created system user for marketplace listings.');
        }

        // Get existing marketplace titles to skip duplicates
        const existing = await Marketplace.find({}, 'title');
        const existingTitles = new Set(existing.map(m => m.title.toLowerCase().trim()));

        console.log(`Marketplace currently has ${existingTitles.size} listings.`);

        const newListings = [];
        for (const item of SAMPLE_LISTINGS) {
            const normalizedTitle = item.title.toLowerCase().trim();
            if (existingTitles.has(normalizedTitle)) {
                console.log(`  [SKIP - duplicate] ${item.title}`);
                continue;
            }
            newListings.push({ ...item, userId: systemUser._id });
            existingTitles.add(normalizedTitle);
        }

        if (newListings.length === 0) {
            console.log('All sample listings already exist. Nothing to add.');
            process.exit();
        }

        const inserted = await Marketplace.insertMany(newListings);
        console.log(`\nSUCCESS: ${inserted.length} new marketplace listings added!`);

        const total = await Marketplace.countDocuments();
        console.log(`Total marketplace listings now: ${total}`);

        process.exit();
    } catch (error) {
        console.error('ERROR:', error.message);
        process.exit(1);
    }
};

seedMarketplace();
