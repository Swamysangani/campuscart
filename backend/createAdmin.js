/**
 * createAdmin.js
 * Creates an admin user in MongoDB.
 * Run once: node createAdmin.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const ADMIN_EMAIL = 'admin@campuscart.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME = 'CampusCart Admin';

const createAdmin = async () => {
    try {
        await connectDB();

        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            if (existing.role !== 'admin') {
                existing.role = 'admin';
                await existing.save();
                console.log(`✅ Existing user upgraded to admin: ${ADMIN_EMAIL}`);
            } else {
                console.log(`ℹ️  Admin already exists: ${ADMIN_EMAIL}`);
            }
            process.exit();
        }

        await User.create({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            role: 'admin',
        });

        console.log('\n✅ Admin user created!');
        console.log('   Email   :', ADMIN_EMAIL);
        console.log('   Password:', ADMIN_PASSWORD);
        console.log('\n⚠️  Change the password after first login!\n');
        process.exit();
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
};

createAdmin();
