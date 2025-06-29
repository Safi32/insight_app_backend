const mongoose = require('mongoose');
const User = require('../models/user.model');
require('dotenv').config();

const migrateProfilePictureSource = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users without profilePictureSource
    const users = await User.find({ 
      $or: [
        { profilePictureSource: { $exists: false } },
        { profilePictureSource: null }
      ]
    });

    console.log(`Found ${users.length} users to migrate`);

    for (const user of users) {
      let source = 'default';
      
      if (user.profilePicture) {
        if (user.profilePicture.includes('googleusercontent.com')) {
          source = 'google';
        } else {
          source = 'custom';
        }
      }

      await User.findByIdAndUpdate(user._id, { profilePictureSource: source });
      console.log(`Updated user ${user.email} with profilePictureSource: ${source}`);
    }

    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateProfilePictureSource();