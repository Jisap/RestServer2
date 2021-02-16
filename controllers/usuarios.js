const { response, request } = require('express'); // Extraemos la respuesta del servidor para que vs pueda trabajar bien

const usuariosGet = (req = request, res = response) => {  

    const { q, nombre ='no name', apikey} = req.query;  // nombre tiene un valor por defecto

    res.json({
        ok: true,
        msg:'GET API - controlador',
        q,
        nombre,
        apikey
    });
}

const usuariosPosts = (req, res = response) => {

    const { nombre, edad } = req.body;              // Todos los datos enviados en un formulario

    res.json({                                      // Los reflejamos en la respuesta
        ok: true,
        nombre,
        edad
    });
}

const usuariosPut = (req, res = response) => {

    const { id } =req.params;

    res.json({
        ok: true,
        id,
        msg:'GET PUT - Controlador'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        ok: true,
        msg:'GET DELETE - Controlador'
    });
}




module.exports = {
    usuariosGet,
    usuariosPosts,
    usuariosPut,
    usuariosDelete
}