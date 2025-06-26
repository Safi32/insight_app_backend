const mongoose = require('mongoose');
const User = require('../models/user.model');

const MONGO_URI = 'mongodb+srv://ismailahmadprofessional:10JLru4pbBBKVkr6@cluster1.yrttux6.mongodb.net/insight_app';

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');
    const users = await User.find({}, 'name email role');
    if (users.length === 0) {
      console.log('No users found.');
    } else {
      console.log('Users:');
      users.forEach((user, idx) => {
        console.log(`${idx + 1}. Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
      });
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main(); 