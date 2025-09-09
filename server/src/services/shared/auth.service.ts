import type { Request, Response } from 'express';

import { supabase } from '../../utils/connections/supabase.js';

const isProd = process.env.NODE_ENV === 'production';

export async function signup(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

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
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie('sb-refresh-token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    res.json({ user: data.user });
}

export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) {
        res.status(401).json({ error: error?.message || 'Invalid login' });
        return;
    }

    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    res.cookie('sb-access-token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.cookie('sb-refresh-token', refreshToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: 'lax',
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    });

    res.json({ user: data.user });
}

export async function logout(_req: Request, res: Response): Promise<void> {
    res.clearCookie('sb-access-token');
    res.clearCookie('sb-refresh-token');
    res.json({ message: 'Logged out' });
}
