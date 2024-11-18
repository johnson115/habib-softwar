const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/Users");
require("dotenv").config();

const createUser = async () => {
  const url = process.env.MONGODB_URL;
  
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = "john@example.com";
    const password = "password123";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists. Updating password...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await User.updateOne({ email }, { password: hashedPassword });
      console.log("Password updated successfully.");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        email,
        password: hashedPassword,
      });
      await newUser.save();
      console.log("User created successfully.");
    }

    const updatedUser = await User.findOne({ email });
    console.log("User in database:", updatedUser);
    console.log("Verifying password...");
    const isMatch = await bcrypt.compare(password, updatedUser.password);
    console.log("Password match:", isMatch);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.connection.close();
  }
};

createUser();