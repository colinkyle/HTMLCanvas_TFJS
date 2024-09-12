import { existsSync, mkdirSync, writeFileSync } from 'fs';
import express from 'express';
// import { json } from 'body-parser';
import cors from 'cors';
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/save-images', (req, res) => {
    const { frameData, frameName } = req.body;
    var dir = frameName.substring(0, frameName.lastIndexOf('/'));// + "/";
    var file = frameName.substring(frameName.lastIndexOf('/')+1);// + "/";
    const directory = 'data/frames/'+dir;

    // Create the directory if it doesn't exist
    if (!existsSync(directory)) {
        mkdirSync(directory, { recursive: true });
    }

    try {
        const base64Data = frameData.replace(/^data:image\/png;base64,/, '');
        writeFileSync(`./${directory}/${file}.png`, base64Data, 'base64');
        console.log(`Saved frame ${frameName} to ${directory} directory`);
        res.status(200).send(`Frame ${frameName} saved successfully`);
    } catch (error) {
        console.error('Error saving frame:', error);
        res.status(500).send('Error saving frame');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});