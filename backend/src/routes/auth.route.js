import express from 'express';
import { signup,login,logout,updateProfile,checAuth, verifyEmail,forgotPassword,resetPassword } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email",verifyEmail);

router.post("/forgot-password",forgotPassword)

router.post("/reset-password/:token",resetPassword)

router.put("/update-profile",protectRoute,updateProfile);

router.get("/check",protectRoute,checAuth);

export default router
