require('dotenv').config();
const { error } = require('console');
const express = require('express')
const app = express();
const port = process.env.port || 3030;
//configurar para la lectura del archivo
const sistemaArchivo = require("fs")
const ruta = require("path")
const rutaArchivoJson = ruta.join(__dirname, "datos.json")
//endpoint raiz
app.get("/", (_, res) => {
    res.send("API REST - Aprendices");
});

//endpoint para ver los datos del archivo
app.get("/api/aprendices", (req, res)=>{
    //datos viene del archivo
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos)=>{
        if(error){
            return res.json({Error: "No se puede leer los datos"})
        }
        const listaAprendices = JSON.parse(datos)
        res.json(listaAprendices)
    })
})

app.listen(port, () => {
    console.log( `SERVIDOR http://localhost:${port}`);
});
