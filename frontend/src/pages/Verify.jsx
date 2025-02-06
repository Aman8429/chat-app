import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const Verify = () => {
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    const { isLoading, verifyEmail } = useAuthStore();

    const handleChange = (index, value) => {
        const newCode = [...code];

        if (value.length > 1) {
            const pastedCode = value.slice(0, 6).split("");
            for (let i = 0; i < 6; i++) {
                newCode[i] = pastedCode[i] || "";
            }
            setCode(newCode);
            const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
            const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
            inputRefs.current[focusIndex].focus();
        } else {
            newCode[index] = value;
            setCode(newCode);
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join("");
        try {
            await verifyEmail(verificationCode);
            navigate("/");
            toast.success("Email verified successfully");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (code.every((digit) => digit !== "")) {
            handleSubmit(new Event("submit"));
        }
    }, [code]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="card w-full max-w-md bg-base-100 shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center">Verify Your Email</h2>
                <p className="text-center">Enter the 6-digit code sent to your email address.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-between">
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="input input-bordered text-center text-2xl w-12 h-12"
                            />
                        ))}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading || code.some((digit) => !digit)}
                        className="btn btn-primary w-full"
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Verify;
