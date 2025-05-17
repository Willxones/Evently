import express from 'express';

import profiles from './controllers/attendee/profiles.controller.js';
import organisers from './controllers/organiser/organisers.controller.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/profiles', profiles);
app.use('/organisers', organisers);

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to the Evently API!');
});
