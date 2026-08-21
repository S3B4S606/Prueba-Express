require('dotenv').config();
const express = require('express')
const app = express();
const port = process.env.port || 3030;

//endpoint raiz
app.get("/", (_, res) => {
    res.send("API REST - Aprendices");
});

app.listen(port, () => {
    console.log( `SERVIDOR http://localhost:${port}`);
});
