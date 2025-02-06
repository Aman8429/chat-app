import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import { sendVerificationEmail,sendWelcomeEmail,sendForgotPasswordEmail,sendResetSuccessEmail } from "../mailer/email.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"

//import dotenv from 'dotenv'


export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = Math.floor(100000 + Math.random()*900000).toString(); 

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24*60*60*1000,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);

      await newUser.save();
      await sendVerificationEmail(newUser.email,verificationToken)

      res.status(201).json({
        message:"User created Successfully",
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        token:verificationToken

      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: error.message });
  }
};
export const verifyEmail = async(req,res)=>{
  const {code} = req.body
  try{
      const user = await User.findOne({
          verificationToken: code,
          verificationTokenExpiresAt: {$gt:Date.now()}
      })

      if(!user){
          console.log("expire")
          return res.status(400).json({success: false, message:"Invalid or expired verification code"})
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;

      await user.save();

      await sendWelcomeEmail(user.email, user.fullName);

      res.json({
          success:true,
          message:"Email verified successfully",
          user:{
              ...user._doc,
              password:undefined
          }
      })
  } catch(error){
      res.status(500).json({success:false,message:"Server error"});
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async(req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async(req,res) => {
  try{
    const {profilePic} = req.body;
    const userId = req.user._id;

    if(!profilePic){
      return res.status(400).json({message:"Profile pic is required"});
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic,{
      allowed_formats: ["jpg", "png", "jpeg", "webp"],}
    );
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true});
    res.status(200).json(updatedUser);
  }catch(error){
   console.log("error in update profile: ", error);
   res.status(500).json({message:"Internal server error"});
  }
}

export const checAuth = async(req,res) => {
  try{
    res.status(200).json(req.user);
  }catch(error){
    console.log("error in checkAuth controller",error.message);
    res.status(500).json({message:"Internal server error"});
  }
}

export const forgotPassword = async(req,res)=>{
  const {email} =req.body;
  try{
    const user =await User.findOne({email});
    if(!user){
      return res.status(400).json({success:false,message:"User not found"});
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1*60*60*1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();
    await sendForgotPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

    res.status(200).json({sccess:true,message:"Password reset link sent to your email"});
  }catch(error){
       console.log("Error in forgotPassword",error);
       res.status(400).json({success:false,message:error.message});
  }
}
export const resetPassword = async(req,res)=>{
  try{
      const {token} = req.params;
      const {password} = req.body;

      const user = await User.findOne({
          resetPasswordToken:token,
          resetPasswordExpiresAt:{$gt: Date.now()}

      })
      if(!user){
          return res.status(400).json({success:false,message:"Invalid or expired reset token"});
      }
      const hashedPassword = await bcrypt.hash(password,10);

      user.password = hashedPassword;
      user.resetPasswordExpiresAt = undefined;
      user.resetPasswordToken = undefined;
      await user.save();

      await sendResetSuccessEmail(user.email);

      res.status(200).json({success:true,message:"Password reset successful"});
  }catch(error){
    console.log("Error  in  resetPassword",error);
    res.status(400).json({success:false,message:error.message})
  }
}
