import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { signUp } from "../../features/auth/signUp";
import { useAuth } from "../../contexts/UserContext";

export default function SignUp() {
	const [error, setError] = useState<string | null>(null);
	const { user, isAuthResolved } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthResolved && user) {
			navigate("/");
		}
	}, [user, isAuthResolved, navigate]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError(null);
		const formData = new FormData(event.currentTarget);
		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		try {
			await signUp(email, password);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "An unknown error occurred."
			);
		}
	};

	return (
		<>
			<h1>Sign Up</h1>
			<form onSubmit={handleSubmit} autoComplete="on">
				<input
					type="text"
					name="email"
					placeholder="Email"
					autoComplete="email"
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					autoComplete="new-password"
				/>
				<input type="submit" value="Sign Up" />
			</form>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<p>
				Already have an account? <Link to="/signin">Sign In</Link>
			</p>
			<p>
				<Link to="/">Back to Home</Link>
			</p>
		</>
	);
}
