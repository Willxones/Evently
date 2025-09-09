import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import authRouter from './controllers/organiser/auth.controller.js';
import eventRouter from './controllers/organiser/event.controller.js';
import organiserRouter from './controllers/organiser/organiserProfile.controller.js';
import ticketTypeRouter from './controllers/organiser/ticketType.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(helmet());
app.use(express.json({ limit: '32kb' }));
app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);

app.use('/organiser', organiserRouter);

app.use('/event', eventRouter);

app.use('/ticket-type', ticketTypeRouter);

app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to the Evently API!');
});
