import express from 'express';
import { Play } from '../language/generated/ast.js';
import { generateIno } from '../generator/file-generator.js';

const app = express();
const port = 3000;
app.use(express.static('./public'));

app.get('/ino', (req, res) => {
    res.send('Hello, World!');
    let plays :  Play[] = [];
    // translateToArduino();
    generateIno({'plays':plays, '$type':'Game'},'examples/test.rpc',undefined);
});

app.listen(port, () => { console.log(`Server for Rpc assets listening on http://localhost:${port}`)});

console.log("Hello, world")