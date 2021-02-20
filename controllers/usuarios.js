const { response, request } = require('express'); // Extraemos la respuesta del servidor para que vs pueda trabajar bien
const Usuario = require('../models/usuario');     // Requerimos el modelo de Usuario  
const bcryptjs = require('bcryptjs');
const { emailExiste } = require('../helpers/db-validators');


const usuariosGet = async(req = request, res = response) => {  

    const { limite = 5, desde = 0} = req.query;           // Extraemos de los querys del url (el limite y el desde)-> string 
    const query = { estado:true };                        // Definimos query como una prop del estado  
    
    const [total, usuarios] = await Promise.all([         // La respuesta (resp->desestructurada) de la bd será una colleción de promesas  
        Usuario.countDocuments(query),                    // Primero esperaremos el conteo de registros  
        Usuario.find(query)                               // Despues esperaremos encontrar todos los registros según limites 
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        usuarios
    });
}

const usuariosPosts = async (req, res = response) => {

    const {nombre, correo, password, rol} = req.body;             // Todos los datos enviados en un formulario serían el body
    const usuario = new Usuario({nombre, correo, password, rol}); // Para crear un usuario de bd creamos una nueva instancia del modelo Usuario
    
    //Encriptar password
    const salt = bcryptjs.genSaltSync(10);                        // Para encriptar la pass 1º generamos el lvl de complejidad (salt)
    usuario.password = bcryptjs.hashSync(password, salt)          // 2º encriptamos la pass usando bcryptjs 

    await usuario.save();                                         // Grabamos el usuario en la bd

    res.json({                                                    // Lo reflejamos en la respuesta
        ok: true,
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } =req.params;                                     // De los params (parte dinámica de la url) obtengo la id  
    const { _id, password, google, correo, ...resto } = req.body; // Del body separo lo que no voy a actualizar de lo que si (resto)  
                                                                  // Sobre lo que hemos separado realizaremos validaciones para luego incluirlo en el resto  
    //Validad contra bd
    if(password){
        const salt = bcryptjs.genSaltSync(10);                    // Si la contraseña viene en el body es que hay que actualizarla
        resto.password = bcryptjs.hashSync(password, salt)        // Generamos una nueva y la añado a resto
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);   // Dentro del esquema Usuario buscamos un registro por id y actualizamos  

    res.json(usuario);
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;                                    // Extraemos el id de los params del url          
    
    //Físicamente lo borramos
    //const usuario = await Usuario.findByIdAndDelete(id)
    
    const usuario = await Usuario.findByIdAndUpdate(id, {estado:false});

    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPosts,
    usuariosPut,
    usuariosDelete
}