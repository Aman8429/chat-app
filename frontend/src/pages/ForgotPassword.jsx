import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-base-200">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-center">Forgot Password</h2>

					{!isSubmitted ? (
						<form onSubmit={handleSubmit}>
							<p className="text-center">
								Enter your email address and we'll send you a link to reset your password.
							</p>
							<Input
								icon={Mail}
								type="email"
								placeholder="Email Address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
							<button
								className="btn btn-primary w-full mt-4"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? <Loader className="animate-spin" /> : "Send Reset Link"}
							</button>
						</form>
					) : (
						<div className="text-center">
							<div className="avatar">
								<div className="w-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
									<Mail className="h-8 w-8 text-white" />
								</div>
							</div>
							<p>
								If an account exists for {email}, you will receive a password reset link shortly.
							</p>
						</div>
					)}
				</div>
				<div className="card-actions justify-center p-4">
					<Link to={"/login"} className="link flex items-center">
						<ArrowLeft className="h-4 w-4 mr-2" /> Back to Login
					</Link>
				</div>
			</div>
		</div>
	);
};
export default ForgotPassword;
