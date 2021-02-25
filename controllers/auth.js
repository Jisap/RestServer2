//
const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");



const login = async(req, res = response) => {

    const { correo, password } = req.body;  // Del body extraemos el correo y el password

    try{

        //Verificar si el email existe
        const usuario = await Usuario.findOne({correo});    // Buscamos en la bd un usuario que tenga el correo dado por el body.
        if(!usuario){                                       // Sino existe mensaje de error.
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - Correo'
            });
        }
        
        //Verificar si el usuario está activo
        if(!usuario.estado){                                            // Si el usuario tiene el estado en false
            return res.status(400).json({                               // mensaje de error
                msg: 'Usuario / Password no son correctos - Estado:false'
            });
        }
        //Verficar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password) // Comparamos la password del body con la pass de la bd
        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password '
            })
        }

        //General el JWT
        const token = await generarJWT(usuario.id); // Queremos que esto trabaje entorno a promesas. Para ello generarJWT será una func 
                                                    // que retornará promesas



        res.json({
            usuario,
            token
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            msg:'Hable con el administrador'
        });
    }

}

module.exports = {
    login
}