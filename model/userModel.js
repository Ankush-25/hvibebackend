import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    FullName: {
      type: String,
    },
    PhoneNumber: {
      type: String,
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
      required: true,
    },
    Role: {
      type: String,
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
          fieldOfStudy: String,
          startDate: String,
          endDate: String,
          description: String,
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
    Recruiter: {
      companies: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Company",
        },
      ],
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("profile", ProfileSchema);

export default User;
