const mongoose = require("mongoose");

const connectDB = async () => {
  const connection_uri = process.env.MONGO_URI;
  try {
    console.log("DB Connection in progress.");
    await mongoose.connect(connection_uri);
    console.log("Connected successfully to DB.");
  } catch (error) {
    console.error(
      `Error connecting to the database. The following error occured: ${error}`
    );
    process.exit(1);
  }
};

module.exports = connectDB;
