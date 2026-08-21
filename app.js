import express from 'express';

const app = express();
const port = process.env.port || 3000;

app.get("/", (_, res) => {
    res.send("API REST - Aprendices");
});

app.listen(port, () => {
    console.log( `Servidor en funcionamiento en el puerto: ${port}`);
});
