import { Request, Response, NextFunction } from 'express';

import { supabase } from '../../utils/supabase.js';

export async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const authHeader = req.headers['authorization'];
    const jwt = authHeader && authHeader.split(' ')[1];

    if (!jwt) {
        res.sendStatus(401);
        return;
    }

    try {
        const { data, error } = await supabase.auth.getUser(jwt);

        if (error || !data.user) {
            res.sendStatus(401);
            return;
        }

        req.user = { id: data.user.id };

        next();
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
}
