import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { signIn } from '../../features/auth/signIn';
import { useAuth } from '../../contexts/UserContext';

export default function SignIn() {
    const [error, setError] = useState<string | null>(null);
    const { user, isAuthResolved } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthResolved && user) {
            navigate('/');
        }
    }, [user, isAuthResolved, navigate]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            await signIn(email, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        }
    };

    return (
        <>
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit} autoComplete="on">
                <input type="text" name="email" placeholder="Email" autoComplete="email" />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                />
                <input type="submit" value="Sign In" />
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Don't have an account? <Link to="/onboarding">Sign Up</Link>
            </p>
            <p>
                <Link to="/">Back to Home</Link>
            </p>
        </>
    );
}
