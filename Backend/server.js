require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS
app.use(cors());

// Your routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
const url = process.env.MONGODB_URL;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((err) => console.error("MongoDB connection error: ", err));
});