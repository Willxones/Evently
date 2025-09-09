import { Request, Response, NextFunction } from 'express';

import { supabase } from '../../utils/connections/supabase.js';

export async function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    const token = req.cookies['sb-access-token'];

    if (!token) {
        res.sendStatus(401);
        return;
    }

    try {
        const { data, error } = await supabase.auth.getUser(token);

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
