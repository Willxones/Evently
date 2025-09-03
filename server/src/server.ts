import cors from 'cors';
import express from 'express';

import eventRouter from './controllers/organiser/event.controller.js';
import organiserRouter from './controllers/organiser/organiserProfile.controller.js';
import ticketTypeRouter from './controllers/organiser/ticketType.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/organiser', organiserRouter);

app.use('/event', eventRouter);

app.use('/ticket-type', ticketTypeRouter);

app.use(express.json());

app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to the Evently API!');
});
