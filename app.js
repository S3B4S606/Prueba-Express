import express from 'express';

const app = express();
const port = 3030;

app.get("/", (_, res) => {
    res.send("Aprendiendo express,ficha 3407181");
});

app.listen(port, () => {
    console.log( `Servidor en funcionamiento en el puerto: ${port}`);
});
