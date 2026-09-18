require('dotenv').config()
const { error } = require('console')
const express = require('express')
const app = express()
const port = process.env.port || 3030
//configurar para la lectura del archivo
const sistemaArchivo = require("fs")
const ruta = require("path")
const rutaArchivoJson = ruta.join(__dirname, "datos.json")
//importar libreria para subir archivos
const multer = require("multer")
const jwt = require("jsonwebtoken")
//Importacion de middleware personales
const registroMiddleware = require("./middleware/registroMiddleware")
const manejadorErrores = require("./middleware/manejadorErrores")
const autenticarMiddleware = require("./middleware/autenticarMiddleware")

//configurar almacenamiento
const almacenamiento = multer.diskStorage({
    destination: (req, filem, cb)=>{
        cb(null, "misImagenes/")
    },
    filename: (req, filem, cb)=>{
        const extensionArchivo = ruta.extname(filem.originalname)
        cb(null, `${Date.now()}${extensionArchivo}`)
    }
})

const subirArchivo = multer({storage: almacenamiento})

// IMPORTAR VALIDACIONES 
const { validarNombre, validarCorreo, generarId } = require("./Utilidades/validaciones");

//middleware body-parse; formate los datos enviados
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//middelware creados, se ejecuta cada ves que hago peticion(GET, POST, PUT, DELETE)
app.use((req, res, next)=>{
    console.log(`tiempo milisegundo: ${Date.now()}`)
    console.log(`fecha: ${new Date().toISOString()}`)
    next()
})

app.use(registroMiddleware)

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

//endpoint para crear aprendices
app.post("/api/aprendices", subirArchivo.single("Imagen"), (req, res)=>{
    //validar que se envien los datos
    const nuevoAprendiz = req.body
    // validar nombre
    if (!validarNombre(nuevoAprendiz.Nombre)) {
        return res.status(400).json({
            Error: "El nombre debe tener mínimo 3 letras."
        })
    }
    // validar correo
    if (!validarCorreo(nuevoAprendiz.Correo)) {
        return res.status(400).json({
            Error: "El correo electrónico no es válido."
        })
    }
    nuevoAprendiz.Imagen = req.file?`/misImagenes/${req.file.filename}`: "Sin imagen"
    //utilizamos la lectura del archivo
    sistemaArchivo.readFile(rutaArchivoJson, "utf-8", (error, datos)=>{
        if(error){
            return res.json({Error: "No se puede leer los datos"})
        }
        const listaAprendices = JSON.parse(datos)
        // GENERAR ID AUTOMÁTICAMENTE
        nuevoAprendiz.id = generarId(listaAprendices)
        //agregar el nuevo aprendiz
        listaAprendices.push(nuevoAprendiz)
        //escribir en el archivo
        sistemaArchivo.writeFile(rutaArchivoJson, JSON.stringify(listaAprendices, null, 2), (error)=>{
            if(error){
                res.status(500).json({Error: "No se puede registrar el aprendiz."})
            }
            res.status(201).json({mensaje: "Aprendiz creado con exito."})
        })
    })
})

//endpoint para modificar 
app.put("/api/aprendices/:id", (req, res)=>{
    res.status(200).json ({mensaje: "Endpoint en construcción de modificar"})
})

//endpoint para eliminar
app.delete("/api/aprendices/:id", (req, res)=>{
    res.status(200).json ({mensaje: "Endpoint en construcción de eliminar"})
})

//provocar error, utilizo nexts
app.get("/error", (req, res, next) => {
    next(new Error("Error intencional para probrar."))
})

//ruta protegida
app.get("/rutaprotegida", autenticarMiddleware ,(req, res) => {
    res.json({mensaje: "Esta ruta esta protegida."})
})

//endpoint inciar sesion, generar token
app.post("/login", (req, res)=>{
    //capturar usuario y clave
    const {usuario, clave} = req.body
    //Simular usuario de base de datos
    const usuarioBd = {"user": "Sebastian", "clave": "abc123"}
    //verficar datos
    if(usuario !== usuarioBd.user || clave !== usuarioBd.clave){
        res.json({mensaje: "Credenciales incorrectas."})
    }
    //generar token
    const token = jwt.sign(
        {usuario: usuario}, 
        process.env.JWT_SECRET, 
        {expiresIn: "2h"}
    )
    res.json({token: token})
})

//uso del middleware de errores
app.use(manejadorErrores)

//EL servidor en funcionamiento, la escucha
app.listen(port, () => {
    console.log( `SERVIDOR http://localhost:${port}`);
});
