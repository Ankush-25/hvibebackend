import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    logo: {
      type: String,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
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
    },
    website: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Company = mongoose.model("Company", companySchema);

export default Company;
