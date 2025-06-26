const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/user.model');

const MONGO_URI = 'mongodb+srv://ismailahmadprofessional:10JLru4pbBBKVkr6@cluster1.yrttux6.mongodb.net/insight_app';

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter the email of the user to delete: ', async (email) => {
    if (!email) {
      console.error('No email entered. Exiting.');
      rl.close();
      process.exit(1);
    }
    try {
      await mongoose.connect(MONGO_URI);
      console.log('Connected to MongoDB.');
      const result = await User.deleteMany({ email });
      console.log(`Deleted ${result.deletedCount} user(s) with email: ${email}`);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      await mongoose.disconnect();
      rl.close();
      process.exit(0);
    }
  });
}

main(); 