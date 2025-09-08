import cors from 'cors';
import express, { Request, Response } from 'express';

import { supabase } from '../../utils/connections/supabase.js';

const router = express.Router();

router.use(express.json());
router.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);

// Signup
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        res.status(400).json({ error: error.message });
        return;
    }

    if (!data.session) {
        res.json({ message: 'Check your email for a confirmation link' });
        return;
    }

    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    res.cookie('sb-access-token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie('sb-refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    res.json({ user: data.user });
});

// Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
        res.status(401).json({ error: error?.message || 'Invalid login' });
        return;
    }

    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    // Set as HTTP-only cookies
    res.cookie('sb-access-token', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie('sb-refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    res.json({ user: data.user });
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');
    res.json({ message: 'Logged out' });
});

export default router;
