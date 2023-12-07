import express from 'express';

const app = express();
const port = 3000;
app.use(express.static('./public'));
app.listen(port, () => { console.log(`Server for Rpc assets listening on http://localhost:${port}`)});

console.log("Hello, world")