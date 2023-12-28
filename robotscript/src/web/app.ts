import express from 'express';
import { saveFile } from '../cli/generator.js';

const app = express();
const port = 3001;
app.use(express.static('./public'));

app.get('/save-arduino', (req, res) => {
    const content : string = req.query.content as string;
    saveFile(content, 'uploads/robotscript.ino');
    res.send({"level": "success", "message": "Saved compilation result at uploads/robotscript.ino"});
    console.log("Saved compilation result at uploads/robotscript.ino");
});


app.listen(port, () => { console.log(`Server for RobotScript assets listening on http://localhost:${port}`)});
