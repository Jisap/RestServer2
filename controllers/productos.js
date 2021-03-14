const { response } = require('express');
const { Producto } = require('../models');


// Obtener todos los productos

const obtenerProductos = async(req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;           // Extraemos de los querys del url (el limite y el desde)-> string 
    const query = { estado:true };                        // Definimos query como una prop del estado  
    
    const [total, productos] = await Promise.all([         // La respuesta (resp->desestructurada) de la bd será una colleción de promesas  
        Producto.countDocuments(query),                    // Primero esperaremos el conteo de registros  
        Producto.find(query)                               // Despues esperaremos encontrar todos los registros según limites 
            .populate('usuario', 'nombre')                 // Del registro usuario solo mostraremos el nombre
            .populate('categoria','nombre')                // Y del registro categoria solo mostraremos el nombre también. 
            .skip(Number(desde))
            .limit(Number(limite))
    ])
    
    res.json({
        total,
        productos
    });
}

//obtenerProducto - según id

const obtenerProducto = async (req, res = response) => {

    const { id } =req.params;                                         // De los params (parte dinámica de la url) obtengo la id  
                                                                                   
    const producto = await Producto.findById(id)                     // Dentro del esquema Categoria buscamos un registro por id 
        .populate('usuario','nombre')                                // De usuario solo mostraremos el nombre   
        .populate('categoria', 'nombre')                             // Y de categoria también.

    res.json(producto);
}

//actualizarProducto

const actualizarProducto = async (req, res = response) => {

    const { id } =req.params;                                      // De los params (parte dinámica de la url) obtengo la id  
    const { estado, usuario, ...data } = req.body;                 // Del body separo lo que no voy a actualizar de lo que si (resto o data)  
                                                                   // Sobre lo que hemos separado realizaremos validaciones para luego incluirlo en el resto  
    if(data.nombre){                                               // Si en la data del body viene el nombre... 

        data.nombre = data.nombre.toUpperCase();                   // Lo ponemos en mayúsculas. 

    }

    data.usuario = req.usuario._id;                                // Ponemos como usuario el del id que viene en el body y cuyo token se uso.         

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true}); // Dentro del esquema Producto buscamos un registro por id y actualizamos  

    res.json(producto);
}

const crearProducto = async(req, res = response) => {

    const { estado, usuario, ...body } = req.body;          // Estraemos del body lo que no vamos a modificar el resto se guarda en body

    const nombre = req.body.nombre.toUpperCase();           // Extraemos del body el nombre y lo pasamos a mayúsculas

    const productoDB = await Producto.findOne({nombre});    // Buscamos alguna coincidencia en la bd con en el nombre de la categoria

    if( productoDB ){                                       // Si existe coincidencia  -> mensaje de que existe ya esa categoria a crear    
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre }, ya existe`
        });
    }

    const data = {  // Contruimos la data que queremos ingresar en la nueva categoria, nombre y el id de usuario que crea la categoria
        ...body,
        nombre,                                                                            
        usuario: req.usuario._id // Este usuario viene del jwt
    }

    const producto = new Producto(data);  // Creamos la nueva categoria con esa data

    await producto.save();                 // Guardamos en la bd la nueva categoria

    res.status(201).json(producto);        // Emitimos la respuesta

}

//borrarProducto

const borrarProducto = async(req, res = response) => {

    const { id } = req.params;                                           // Extraemos el id de los params del url           
       
    const ProductoBorrado = await Producto.findByIdAndUpdate(id, {estado:false}, {new:true}); 
                                                                         // Buscamos el usuario en la bd con la id proporcionada y cambiamos el estado

    res.json(ProductoBorrado);                                          // Mostramos la categoria borrada
     
}

module.exports = {

    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    crearProducto,
    borrarProducto    
}