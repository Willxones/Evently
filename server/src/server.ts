import cors from 'cors';
import express from 'express';

import organiser from './controllers/organiser/organiserProfile.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/organiser', organiser);

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
