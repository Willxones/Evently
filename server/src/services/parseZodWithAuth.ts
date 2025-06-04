import { Request } from 'express';
import { ZodSchema } from 'zod';

import { AuthError } from '../utils/errors/authError.js';

function parseZodWithAuth(
    zodSchema: ZodSchema,
    reqBody: Request,
    actualUserId: string | undefined | null
) {
    const parsed = zodSchema.safeParse(reqBody);
    if (!parsed.success) {
        throw new AuthError('Missing or invalid required fields', 400);
    }
    const data = parsed.data;
    if (!actualUserId || actualUserId !== data.userId) {
        throw new AuthError('Unauthorized', 401);
    }
    return data;
}

export { parseZodWithAuth };
