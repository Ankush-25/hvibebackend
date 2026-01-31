import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../model/userModel.js";
import dotenv from "dotenv";
dotenv.config();

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

export async function login(req: Request, res: Response) {
  const { email, password, userType } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("User Not Found");
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json("invalid Password");
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECERT_KEY as string,
      {
        expiresIn: "80hr",
      },
    );
    res.json({
      message: "Login Successfully ",
      token: token,
      userId: user._id,
      userType: user.userType,
    });
  } catch (error) {
    console.error("Unable to Login Due to : ", error);
    res.status(500).json("Internal Server Error!");
  }
}

export async function SignUp(req: Request, res: Response) {
  const { username, email, password, userType } = req.body;
  try {
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
      userType: userType,
    });
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECERT_KEY as string,
      {
        expiresIn: "80hr",
      },
    );

    return res.status(201).json({
      message: "SignUp Successfully",
      token: token,
      userId: newUser._id,
      userType: userType,
    });
  } catch (error) {
    console.error("Unable to SignUp Due to : ", error);
    res.status(500).json("Internal Server Error!");
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  const userId = req.params.ID;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error while deleting the user", error);
    res.status(500).json("Internal Server Error");
  }
};

export const UpdateProfile = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.id;

    const {
      FullName,
      ProfileImage,
      bio,
      location,
      resume,
      profile,
      Role,
      PhoneNumber,
    } = req.body;

    const updatedFields: any = {
      ...(FullName && { FullName }),
      ...(ProfileImage && { ProfileImage }),
      ...(bio && { bio }),
      ...(location && { location }),
      ...(resume && { resume }),
      ...(Role && { Role }),
      ...(PhoneNumber && { PhoneNumber }),
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
      { new: true, runValidators: true },
    ).select("-password");

    res.status(200).json({ success: true, updatedUser });
  } catch (error) {
    console.error("Profile update failed:", error);
    res.status(500).json({ success: false, message: "Profile update failed" });
  }
};

export const UserProfile = async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User Not Found " });
    }
    return res.status(200).json({ response: user });
  } catch (error) {
    console.error("There is Some Error in fetching UserProfile ");
    res.status(500).json({ message: " Internal Server Error! " });
  }
};

export const deleteUserData = async (req: Request, res: Response) => {
  const { expId, userId } = req.body;
  try {
    const deletedExp = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { "profile.experience": { _id: expId } } },
      { new: true, runValidators: true },
    );
    if (!deletedExp) {
      return res.status(400).json({ message: "Experience Not Found" });
    }
    return res.status(200).json({ message: "Experience Deleted Successfully" });
  } catch (error) {
    console.error("Error while deleting the user", error);
    res.status(500).json("Internal Server Error");
  }
};
