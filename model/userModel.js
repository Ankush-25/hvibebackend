const { model } = require("mongoose");
const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  FullName: {
    type: String,
  },
  PhoneNumber:{
    type:String,
  },
  ProfileImage: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: ["job_seeker", "employer", "admin"],
  },
  Role:{
    type:String,
  },
  profile: {
    skills: [String],
    experience: [
      {
        title: String,
        startDate: String,
        endDate: String,
        company: String,
        duration: String,
        description: String,
      },
    ],
    education: [
      {
        degree: String,
        institution: String,
        year: String,
      },
    ],
  },
  resume: {
    type: String, // resume file path or URL
  },
  bio: {
    type: String,
    maxlength: 1000,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  savedJobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = new model("profile", ProfileSchema);

module.exports = User;
