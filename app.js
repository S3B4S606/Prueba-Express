
import express from 'express';
//leer el archivo .env
import {configDotenv} from "dotenv"
configDotenv()

const app = express();
const port = process.env.PUERTO || 3030
//uso de middleware body-parse
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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

//endpoint para envio de datos forato JSON
app.post("/ruta2", (req, res)=>{
    const todosDatos = req.body
    const name = req.body.nombre
    const lastname = req.body.cargo
    res.status (201).json({Datos: todosDatos, nombre: name, cargo: lastname})
})

//ACTIVIDAD: Endpoint de validacion y mensaje sobre datos no encontrados 
app.post("/login", (req, res)=>{
    const usuario = req.body.usuario
    const perfil = req.body.perfil
    const contraseña = req.body.contraseña
    //validacion de datos
    if(!usuario || !perfil || !contraseña){
        return res.send("Datos incompletos")
    }

    //Validar los datos y dar acceso o bienvenida
    if (perfil === "admin"){
        return res.send(`Bienvenido administrador: ${usuario}`)
    }
    if (perfil === "user"){
        return res.send(`Bienvenido user: ${usuario}`)
    }
    //Si el perfil no existe
    return res.send("El perfil no existe. Acceso denegad")
})

//endpoint para enviar datos formdata
app.post("/formulario", (req, res)=>{
    const datosForm = req.body
    const miNombre = req.body.nombre
    const miApellido = req.body.apellido
    const miCargo = req.body.cargo
    if(!miNombre || !miApellido || !miCargo){
        return res.send("Datos incompletos")}
    res.status(200).json({Mensaje: "Datos recibidos", nombre: miNombre, apellido: miApellido, cargo: miCargo })
})
    

app.listen(port, function(){
    console.log( `SERVIDOR: http://localhost:${port} `)
})
