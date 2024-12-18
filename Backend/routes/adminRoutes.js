const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/Users');
const auth = require('../middleware/auth');
const router = express.Router();

// Admin login (public route - no auth needed)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Add debug logging
    console.log('Login attempt for username:', username);
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    res.json({ 
      success: true,
      token, 
      message: 'Admin logged in successfully' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Add debug logging
    console.log('Login attempt for username:', username);
    
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log('Admin not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    res.json({ 
      success: true,
      token, 
      message: 'Admin logged in successfully' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', auth, async (req, res) => {
  // Check if the requester is an admin
  if (!req.admin || !req.admin.isAdmin) {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }

  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', auth, async (req, res) => {
  // Check if the requester is an admin
  if (!req.admin || !req.admin.isAdmin) {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Delete user
router.delete('/users/:id', auth, async (req, res) => {
  // Check if the requester is an admin
  if (!req.admin || !req.admin.isAdmin) {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new user
router.post('/users', auth, async (req, res) => {
  // Check if the requester is an admin
  if (!req.admin || !req.admin.isAdmin) {
    return res.status(403).json({ message: 'Not authorized as admin' });
  }

  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Check if user already exists
    let existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    // Create new user with initial project
    const newUser = new User({
      username,
      email,
      password, // The User model will hash this password
      projects: [{
        name: "First Project",
        data: {
          
        },
        progress: {
          perfectAvatarProgress: 0,
          millionDollarProgress: 0,
          perfectOfferProgress: 0,
          ultimateLeadMagnetProgress: 0,
          authorityAmplifierProgress: 0,
          enrollmentScriptProgress: 0,
          contentRoadmapProgress: 0,
          trafficOnDemandProgress: 0,
          retargetingRoadmapProgress: 0
        }
      }]
    });

    // Save the user
    await newUser.save();

    console.log('New user created with hashed password:', newUser.password);

    // Set the active project
    newUser.activeProject = newUser.projects[0]._id;
    await newUser.save();

    res.json({ 
      message: 'User created successfully with initial project', 
      userId: newUser._id,
      projectId: newUser.projects[0]._id 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;