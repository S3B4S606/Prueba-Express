require("dotenv").config()
const express = require("express")

const miApp = express()

//mi aplicacion utiliza los middleware
miApp.use(express.json())
miApp.use(express.urlencoded({extended: true}))
//importar middleware propios

//ruta principal de mi api
miApp.get("/", (req, res)=>{
    res.send("Mi API Rest Ficha 3407181")
})

module.exports = miApp
