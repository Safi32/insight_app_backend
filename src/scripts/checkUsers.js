const mongoose = require("mongoose");

// MongoDB connection string
const MONGO_URI = "mongodb+srv://ismailahmadprofessional:10JLru4pbBBKVkr6@cluster1.yrttux6.mongodb.net/insight_app";

// User Schema (simplified for this script)
const userSchema = new mongoose.Schema({
  name: String,
  email: String
});

const User = mongoose.model("User", userSchema);

async function checkUsers() {
  try {
    // Connect to MongoDB
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully to MongoDB!");

    // Fetch all users with only name and email
    const users = await User.find({}, 'name email');
    
    console.log("\n=== USERS IN DATABASE ===");
    console.log(`Total users found: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log("No users found in the database.");
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. Name: ${user.name || 'N/A'}`);
        console.log(`   Email: ${user.email || 'N/A'}`);
        console.log("");
      });
    }

  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

// Run the script
checkUsers(); 