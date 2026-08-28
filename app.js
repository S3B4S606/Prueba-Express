
import express from 'express';
//leer el archivo .env
import {configDotenv} from "dotenv"
configDotenv()

const app = express();
const port = process.env.PUERTO || 3030

app.get("/", (_, res) => {
res.send('Aprendiendo express,ficha 3407181, programa ADSO, 31 de Julio');
})
//otro endpoint
app.get("/otraruta",(req, res)=>{
    //usando template string
    res.send(`<h1>Otro ejemplo de ruta</h1>
        <h2>End point con res.send</h2>
        `)
})

app.get("/ruta2",(req, res)=>{
    res.json({"nombre": "sebastian", "apellido":"acosta","Cargo":"Aprenediz"})
})

app.get("/ruta3/:aprendiz/:otrodato",(req, res)=>{
    const dato_aprendiz = req.params.aprendiz
    const otro_dato = req.params.otrodato
    res.json({"nombre": dato_aprendiz, "otro": otro_dato})
})

app.get("/ruta4", (req, res)=>{
    //capturar el parametro de consulta query
    const orden = req.query.orden || "sin ordenar"
    const pagina = req.query.pagina || 1
    res.send(`<h1>Listado Aprendices</h1>
        <p>El listado esta en orden ${orden}</p>
        <p>Pagina: ${pagina}</P>
        `)
})

app.listen(port, function(){
    console.log( `SERVIDOR: http://localhost:${port} `)
})
