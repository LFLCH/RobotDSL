import express from 'express';
import { saveFile } from '../cli/generator.js';
import cors from 'cors';

const corsOptions = {
    origin: ['http://localhost'],
};

const app = express();
const port = 3001;
app.use(express.static('./public'), cors(corsOptions));


app.get('/save-arduino', (req, res) => {
    const isLocal = [req.hostname, req.headers.host, req.headers.referer].includes('localhost');
    if (!isLocal) {
        res.send({"level": "error", "message": "This endpoint is only available on localhost"});
        console.log("This endpoint (/save-arduino) is only available on localhost");
        return;
    }
    else {
        const content : string = req.query.content as string;
        saveFile(content, 'uploads/robotscript.ino');
        res.send({"level": "success", "message": "Saved compilation result at uploads/robotscript.ino"});
        console.log("Saved compilation result at uploads/robotscript.ino");
    }
});


app.listen(port, () => { console.log(`Server for RobotScript assets listening on http://localhost:${port}`)});
