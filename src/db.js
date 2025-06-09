const mongoose = require("mongoose");

const connectDB = async () => {
  const connection_uri = process.env.MONGO_URI;
  try {
    await mongoose.connect(connection_uri);
  } catch (error) {
    console.error(
      `Error connecting to the database. The following error occured: ${error}`
    );
    process.exit(1);
  }
};

module.exports = connectDB;
