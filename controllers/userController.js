import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config();

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("User Not Found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json("invalid Password");
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECERT_KEY, {
      expiresIn: "80hr",
    });
    res.json({message: "Login Successfully ", 'token': token, userId: user._id });
  } catch (error) {
    console.error("Unable to Login Due to : ", error);
    res.status(500).json("Internal Server Error!");
  }
}

export async function SignUp(req, res) {
  const { username, email, password } = req.body;
  try {
    console.log("Received body:", req.body);
    console.log("Password:", password);
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res
        .status(400)
        .json({ message: "The User already has an account! Login" });
    }
    const EncryptPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: EncryptPassword,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECERT_KEY, {
      expiresIn: "80hr",
    });

    return res
      .status(201)
      .json({
        message: "SignUp Successfully",
        token: token,
        userId: newUser._id,
      });
  } catch (error) {
    console.error("Unable to SignUp Due to : ", error);
    res.status(500).json("Internal Server Error!");
  }
}

export const deleteUser = async (req, res)=>{
  const userId = req.params.ID
  
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error while deleting the user", error);
    res.status(500).json("Internal Server Error")
    
  }
}

export const UpdateProfile = async(req, res)=>{
  try {
    const userId = req.user.id;

    const {
      FullName,
      ProfileImage,
      bio,
      location,
      resume,
      profile,
      Role,
      PhoneNumber
    } = req.body;

    const updatedFields = {
      ...(FullName && { FullName }),
      ...(ProfileImage && { ProfileImage }),
      ...(bio && { bio }),
      ...(location && { location }),
      ...(resume && { resume }),
      ...(Role&&{Role}),
      ...(PhoneNumber&&{PhoneNumber}),
      ...(profile && {
        profile: {
          ...(profile.skills && { skills: profile.skills }),
          ...(profile.experience && { experience: profile.experience }),
          ...(profile.education && { education: profile.education }),
        },
      }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFields },
      { new: true, runValidators:true}
    ).select("-password");

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
};

export const UserProfile = async(req, res)=>{
  const userId = req.user.id
  try {
    const user = await User.findById(userId).select("-password");
    if(!user){
      return req.status(400).json({message: "User Not Found "})
    }
    return res.status(200).json( {response: user})
  } catch (error) {
    console.error("There is Some Error in fetching UserProfile ")
    res.status(500).json({message:" Internal Server Error! "})
  }
}