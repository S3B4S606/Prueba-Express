require('dotenv').config();
const { error } = require('console');
const express = require('express')
const app = express();
const port = process.env.port || 3030;
//configurar para la lectura del archivo
const sistemaArchivo = require("fs")
const ruta = require("path")
const rutaArchivoJson = ruta.join(__dirname, "datos.json")
//importar libreria para subir archivos
const multer = require("multer")
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



//EL servidor en funcionamiento, la escucha
app.listen(port, () => {
    console.log( `SERVIDOR http://localhost:${port}`);
});
