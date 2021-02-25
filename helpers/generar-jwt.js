const jwt = require('jsonwebtoken');


const generarJWT = (uid='') => {   //uid es el identificado único del usuario -> usuario.id

    return new Promise((resolve, reject) => {

        const payload = { uid };                                        // payload es la información útil en este caso el uid
        
        jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {             // Creamos el jwt con el payload y encriptando esa info con el secretKey
            expiresIn: '4h'                                             // El token tendrá una duración de 4 horas.
        }, (err, token) => {                                            // Resolución de la promesa
        
            if(err){                                                    // Si hay error 
                console.log(err);                                       // Mensaje de error    
                reject('No se puedo el token')                  
            }else{                                                      // Sino hay error
                resolve(token);                                         // retornamos el token
            }
        })
    })

}

module.exports = {
    generarJWT
}