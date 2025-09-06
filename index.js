import express from 'express';
import { handler } from './handler.js';

const app = express();

app.use(express.json());


app.post('/scrape', async (req, res) => {
    try {
        const input = req.body;

    const response = await handler({ body: JSON.stringify(input) });

    res.json({
        response
    });
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


app.listen(3000, () => console.log("Server is running on port 3000"));