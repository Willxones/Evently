import express, { Request, Response } from 'express';

import { stripe } from '../../utils/stripe.js';

const router = express.Router();

router.use(express.json());
router.post('/account', async (req: Request, res: Response) => {
    try {
        const account = await stripe.accounts.create({});

        res.json({
            account: account.id,
        });
    } catch (error) {
        error instanceof Error
            ? res.status(500).send({ error: error.message })
            : res.status(500).send({ error: 'An unknown error occurred.' });
    }
});

export default router;
