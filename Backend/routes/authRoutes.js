const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/Users');
const router = express.Router();


// User login
// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for email:', email);
    console.log('Received password:', password);
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('User found:', user);
    console.log('Stored hashed password:', user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);

    if (!isMatch) {
      console.log('Password does not match');
      return res.status(400).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log('Login successful');
    res.json({ 
      success: true,
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      message: 'User logged in successfully' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get user's projects
router.get('/projects', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User projects:', user.projects); // Add this line for debugging
    res.json(user.projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new project
router.post('/projects', auth, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Create a new project
    const newProject = new Project({
      name,
      userId: req.user.id,
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
      },
      data: {
        perfectAvatar: {},
        millionDollar: {},
        perfectOffer: {},
        ultimateLeadMagnet: {},
        authorityAmplifier: {},
        enrollmentScript: {},
        contentRoadmap: {},
        trafficOnDemand: {},
        retargetingRoadmap: {}
      }
    });

    // Save the project
    await newProject.save();

    // Add the project to the user's projects array
    const user = await User.findById(req.user.id);
    if (!user.projects) {
      user.projects = [];
    }
    user.projects.push(newProject._id);
    await user.save();

    res.json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific project
router.get('/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const project = user.projects.id(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a project
router.delete('/projects/:projectId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.projects = user.projects.filter(project => project._id.toString() !== req.params.projectId);
    await user.save();
    res.json(user.projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post("/select-project", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.activeProject = req.body._id;
    await user.save();
    console.log('Active project updated:', user.activeProject); // Add this line for debugging
    res.json({ message: 'Active project updated successfully' });
  } catch (err) {
    console.error('Error selecting project:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get active project and its progress
router.get("/active-project", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const activeProject = user.projects.id(user.activeProject);
    res.json({ 
      activeProject: activeProject._id,
      progress: activeProject.progress
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get("/project-data", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const activeProject = user.projects.id(user.activeProject);
    res.json(activeProject.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific step data for PDF generation
router.get("/project-data/:step", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const activeProject = user.projects.id(user.activeProject);
    res.json(activeProject.data[req.params.step]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/projects/:projectId/data/:step', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const project = user.projects.id(req.params.projectId);
    res.json(project.data[req.params.step] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// change password : 

router.post('/users/change-password', authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});



// Save step data to a project
router.post('/projects/:projectId/data', authMiddleware, async (req, res) => {
  const { step, data } = req.body;

  try {
    console.log('Received request:', { step, data });

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const project = user.projects.id(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    console.log('Before update:', {
      projectId: project._id,
      currentData: project.data
    });

    // Update the data
    project.data[step] = { ...project.data[step], ...data };

    // Mark the projects array as modified
    user.markModified('projects');

    console.log('After update, before save:', {
      projectId: project._id,
      updatedData: project.data
    });

    await user.save();

    // Verify the save immediately
    const verifiedUser = await User.findById(req.user.userId);
    const verifiedProject = verifiedUser.projects.id(req.params.projectId);
    
    console.log('After save verification:', {
      projectId: verifiedProject._id,
      savedData: verifiedProject.data,
      specificStepData: verifiedProject.data[step]
    });

    if (!verifiedProject.data[step]) {
      throw new Error('Data verification failed - saved data not found');
    }

    res.json({ 
      success: true,
      message: 'Data saved and verified successfully', 
      data: verifiedProject.data[step]
    });

  } catch (err) {
    console.error("Error saving project data:", err);
    res.status(500).json({ 
      success: false,
      message: 'Server error saving data',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});
// Update progress for a project step
router.post('/projects/:projectId/update-progress', authMiddleware, async (req, res) => {
  const { step, progress } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    const project = user.projects.id(req.params.projectId);

    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (!project.progress) project.progress = {}; // Initialize if missing
    project.progress[step] = progress;

    await user.save();
    res.json({ message: 'Progress updated successfully' });
  } catch (err) {
    console.error("Error updating progress:", err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;