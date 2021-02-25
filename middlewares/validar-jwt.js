const { request, response } = require('express');
const Usuario = require('../models/usuario');
const jwt = require('jsonwebtoken');


const validarJWT = async( req = request, res = response, next) => {  // En la petición al server (req) los token iran en los headers 
                                                                                                                                    
    const token = req.header('x-token');                             // Identificamos el token en los headers 
    
    if(!token){                                                                 // Si no existe el token, mensaje de fallo   
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {                                                                       // Si existe el token -> try/catch para ...
        
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);      // verificar el Jwt en base al secretkey -> genera un payload
                                                                                // de este payload extraemos el uid
        const usuario = await Usuario.findById(uid);                            // Buscaremos un usuario en la bd con el uid de la petición (req)

        if(!usuario){                                                           // Si el usuario no existe en la bd -> mensaje de error
            return res.status(401).json({
                msg: 'El usuario no existe en la bd'
            })
        }

        if(!usuario.estado){
            return res.status(401).json({                                       // También hay que verificar que el estado del usuario que logea
                msg:'Token no válido - usuario con estado false'                // y usa su token para borrar no tenga el estado en false
            })
        }
                                                                                
        req.usuario = usuario;                                                  // Este usuario una vez validado lo introducimos en la petición (req)
        
        next();                                                                 // Continua con el proceso de validaciones en la rutas
                                                                                // para que al final de todas ella se ejecute usuariosDelete    
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no valido'
        })
    }

}

module.exports = {
    validarJWT
}