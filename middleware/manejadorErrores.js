const manejadorErrores = (error, req, res, next) => {
    const codigoError = error.statusCode || 500
    const mensajeError = error.message || "Error insesperado!!"
    //mostrar error por consola
    console.error(`[Manejador de errores] - ${new Date().toISOString()} - ${codigoError} - ${mensajeError}`)
    //validar mas mensajes de errores, detalles
    if (error.stack){
        console.error(error.stack)
    }
    //mensaje para el usuario normal
    res.json({Erros: "Manejador de errores", 
        codigoError, 
        mensajeError,
        //validar .env si estamos en desarrollo o produccion
        ...(process.env.NODE_ENV === "development" && {stack: error.stack})
    })
}

module.exports = manejadorErrores