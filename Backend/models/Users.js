const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const StepProgressSchema = new mongoose.Schema({
  perfectAvatarProgress: { type: Number, default: 0 },
  millionDollarProgress: { type: Number, default: 0 },
  perfectOfferProgress: { type: Number, default: 0 },
  ultimateLeadMagnetProgress: { type: Number, default: 0 },
  authorityAmplifierProgress: { type: Number, default: 0 },
  enrollmentScriptProgress: { type: Number, default: 0 },
  contentRoadmapProgress: { type: Number, default: 0 },
  trafficOnDemandProgress: { type: Number, default: 0 },
  retargetingRoadmapProgress: { type: Number, default: 0 }
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  progress: StepProgressSchema,
  data: {
    perfectAvatar: { type: Object, default: {} },
    millionDollar: { type: Object, default: {} },
    perfectOffer: { type: Object, default: {} },
    ultimateLeadMagnet: { type: Object, default: {} },
    authorityAmplifier: { type: Object, default: {} },
    enrollmentScript: { type: Object, default: {} },
    contentRoadmap: { type: Object, default: {} },
    trafficOnDemand: { type: Object, default: {} },
    retargetingRoadmap: { type: Object, default: {} }
  }
});
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  projects: [{
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true
    },
    name: {
      type: String,
      default: "First Project"
    },
    data: {
      type:{},
    },
    progress: {
      type: {},
      
    }
  }],
  activeProject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }
}, { timestamps: true });

// Hash the password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});



module.exports = mongoose.model("User", UserSchema);