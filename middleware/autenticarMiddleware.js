const jwt = require("jsonwebtoken")
//funcion para generar -verificar
const autenticarMiddleware = (req, res, next)=>{
    //capturar el token por el usuario
    const token = req.header("Autenticar")?.split(" ")[1]
    if(!token){
        res.status(401).json({mensaje: "Acceso denegado no proporciona token"})
    }
    //verificar
    jwt.verify(token, process.env.JWT_SECRET,(error, usuario)=>{
        if(error){
            res.status(403).json({mensaje: "Token invalido."})
        }
        req.usuario = usuario
    })
}

module.exports = autenticarMiddleware