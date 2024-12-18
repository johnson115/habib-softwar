const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

const createInitialAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ username: process.env.ADMIN_USERNAME });

    if (adminExists) {
      console.log('Admin already exists');
      return;
    }

    const newAdmin = new Admin({
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    });

    await newAdmin.save();
    console.log('Initial admin created successfully');
  } catch (error) {
    console.error('Error creating initial admin:', error);
  }
};

module.exports = createInitialAdmin;