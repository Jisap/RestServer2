const { response } = require('express');
const { Categoria } = require('../models');

//obtenerCategorias - paginado - total - populate

const obtenerCategorias = async(req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;           // Extraemos de los querys del url (el limite y el desde)-> string 
    const query = { estado:true };                        // Definimos query como una prop del estado  
    
    const [total, categorias] = await Promise.all([         // La respuesta (resp->desestructurada) de la bd será una colleción de promesas  
        Categoria.countDocuments(query),                    // Primero esperaremos el conteo de registros  
        Categoria.find(query)                               // Despues esperaremos encontrar todos los registros según limites 
            .populate('usuario', 'nombre')                  // Del registro usuario solo mostraremos el nombre
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        categorias
    });
}

//obtenerCategoria - según id

const obtenerCategoria = async (req, res = response) => {

    const { id } =req.params;                                         // De los params (parte dinámica de la url) obtengo la id  
                                                                                   
    const categoria = await Categoria.findById(id)                   // Dentro del esquema Categoria buscamos un registro por id 
        .populate('usuario','nombre')

    res.json(categoria);
}

//actualizarCategoria

const actualizarCategoria = async (req, res = response) => {

    const { id } =req.params;                                      // De los params (parte dinámica de la url) obtengo la id  
    const { estado, usuario, ...data } = req.body;                 // Del body separo lo que no voy a actualizar de lo que si (resto)  
                                                                   // Sobre lo que hemos separado realizaremos validaciones para luego incluirlo en el resto  
    data.nombre = data.nombre.toUpperCase();                       // Ponemos en mayúsculas el nombre 
    data.usuario = req.usuario._id;                                // Ponemos como usuario el del id que viene en el body y cuyo token se uso.         

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true}); // Dentro del esquema Categoria buscamos un registro por id y actualizamos  

    res.json(categoria);
}

//borrarCategoria

const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;                                           // Extraemos el id de los params del url           
       
    const CategoriaBorrada = await Categoria.findByIdAndUpdate(id, {estado:false}, {new:true}); 
                                                                         // Buscamos el usuario en la bd con la id proporcionada y cambiamos el estado

    res.json(CategoriaBorrada);                                          // Mostramos la categoria borrada
     
}


const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();           // Extraemos del body el nombre y lo pasamos a mayúsculas

    const categoriaDB = await Categoria.findOne({nombre});  // Buscamos alguna coincidencia en la bd con en el nombre de la categoria

    if( categoriaDB ){                                      // Si existe coincidencia  -> mensaje de que existe ya esa categoria a crear    
        return res.status(400).json({
            msg:`La categoría ${categoriaDB.nombre }, ya existe`
        });
    }

    const data = {  // Contruimos la data que queremos ingresar en la nueva categoria, nombre y el id de usuario que crea la categoria
        nombre,                                                                            // Este usuario viene del jwt
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);  // Creamos la nueva categoria con esa data

    await categoria.save();                 // Guardamos en la bd la nueva categoria

    res.status(201).json(categoria);        // Emitimos la respuesta


}


module.exports = {

    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}