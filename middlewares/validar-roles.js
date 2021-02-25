const { request, response } = require("express")


const esAdminRole = (req=request, res=response, next) => {  // Toda la información del anterior middleware pasa al siguiente (este)

    if(!req.usuario){   // Si req.usuario devuelve undefined significa que no hemos validado adecuadamente este usuario
        return res.status(500).json({
            msg:'Se quiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario; //Extraemos rol y nombre del usuario que se auténtica
    
    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        })
    }

    next(); // Si si es administrador continua la tarea en la ruta
}

const tieneRole = (...roles) => {   // Todo lo que mandemos en los argumentos de la ruta como roles permitidos se almacenan en roles

    return  (req, res = response, next) => { // toda la información del anterior middleware (JWT) pasa a este.

        if(!req.usuario){                                   // Si req.usuario devuelve undefined significa que no hemos validado adecuadamente este usuario
            return res.status(500).json({
                msg:'Se quiere verificar el role sin validar el token primero'
            });
        }

        if(!roles.includes(req.usuario.rol)){               // Si el usuario autenticado tiene un role no incluido en la lista de roles -> msg
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }

        next();
    }

}




module.exports = {
    esAdminRole,
    tieneRole
}