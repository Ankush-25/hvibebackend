import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      required: false,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship"],
      required: true,
    },
    category: {
      type: String,
      enum: [
        "IT",
        "Marketing",
        "Design",
        "Finance",
        "Healthcare",
        "Education",
        "Other",
      ],
      required: true,
    },
    skillsRequired: [
      {
        type: String,
      },
    ],
    experienceLevel: {
      type: Number,
      required: true,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    Vacancies: {
      type: Number,
    },
    deadline: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
