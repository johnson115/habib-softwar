require("dotenv").config();  // Load the .env variables
const mongoose = require("mongoose");

const connectDB = async () => {
    const url=process.env.MONGODB_URL
  try {
    // Connect to MongoDB
    await mongoose.connect(`${url}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);  // Exit the process if the DB connection fails
  }
};

module.exports = connectDB;
