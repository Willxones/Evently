import cors from 'cors';
import express from 'express';

import organiser from './controllers/organiser/organiserProfile.controller.js';
import events from './controllers/organiser/events.controller.js';
import ticketTypes from './controllers/organiser/ticketType.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
    cors({
        origin: 'http://localhost:5173',
        credentials: true,
        allowedHeaders: ['Content-Type', 'authorization'],
    })
);

app.use('/organiser', organiser);
app.use('/organiser', events);
app.use('/organiser', ticketTypes);

app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to the Evently API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
