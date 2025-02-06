import React from 'react'
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { replace, useNavigate, useParams } from "react-router-dom";
import Input from "../components/Input";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";
const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { resetPassword, isloading } = useAuthStore();
  
    const { token } = useParams();
    const navigate = useNavigate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      try {
        await resetPassword(token, password);
  
        toast.success("Password reset successfully, redirecting to login page...");
        navigate("/login", { replace: true });
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Error resetting password");
      }
    };
  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl ">
      <div className="max-w-md w-full p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Reset Password
        </h2>
        {<p className="text-red-500 text-sm mb-4"></p>}
        { <p className="text-sm mb-4"></p>}

        <form onSubmit={handleSubmit}>
          <Input
            icon={Lock}
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            icon={Lock}
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            className="w-full py-3 px-4 font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200"
            type="submit"
            disabled={isloading}
          >
            {isloading ? "Resetting..." : "Set New Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
