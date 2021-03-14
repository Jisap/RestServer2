const { response } = require("express");
const { isValidObjectId } = require("mongoose");
const { Usuario, Categoria, Producto } = require("../models");

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios = async(termino='', res=response) => {

    const esMongoID = isValidObjectId(termino); //Si el termino de busqueda es un id de mongo da true sino lo es da false

    if(esMongoID){                                                  // Si el uid existe
        const usuario = await Usuario.findById(termino);            // buscamos un usuario en la bd que conicida con el termino de busqueda
        return res.json({                                           // La res será la siguiente:
            results: (usuario) ? [usuario] : []                     // Si existe el usuario lo mostramos sino ponemos un []
        });
    }

    const regex = new RegExp(termino, 'i')                      // Lo que busquemos será el término y será insensible a may y min
    const usuarios = await Usuario.find({                       // Si lo que buscamos no es por uid sino por un texto
        $or: [{nombre:regex},                                   // Mongo buscará en el nombre o en el correo con el término de busqueda
              {correo:regex}],                                  // un usuario que coincida en la bd
        $and:[{estado: true}]
            });
            
    res.json({                                           
            results: usuarios                    
        });
}

const buscarCategorias = async(termino='', res=response) => {

    const esMongoID = isValidObjectId(termino);

    if(esMongoID){                                                  // Si el uid existe
        const categoria = await Categoria.findById(termino);        // buscamos una categoria en la bd que conicida con el termino de busqueda
        return res.json({                                           // La res será la siguiente:
            results: (categoria) ? [categoria] : []                 // Si existe la categoria la mostramos sino ponemos un []
        });
    }

    const regex = new RegExp(termino, 'i')                      // Lo que buscamos será el término y será insensible a may y min
    const categorias = await Categoria.find({                   // Si lo que buscamos no es por uid sino por un texto
        nombre:regex, estado:true                               // Mongo buscará en el nombre con el término de busqueda
    });   
            
    res.json({                                           
            results: categorias                    
        });
}

buscarProductos = async(termino='', res=response) => {

    const esMongoID = isValidObjectId(termino);

    if(esMongoID){                                                  // Si el uid existe
        const producto = await (await Producto.findById(termino))   // buscamos una producto en la bd que conicida con el termino de busqueda
            .populate('categoria','nombre');                        // y de la categoria solo mostraremos su nombre    
        return res.json({                                           // La res será la siguiente:
            results: (producto) ? [producto] : []                   // Si existe el producto lo mostramos sino ponemos un []
        });
    }

    const regex = new RegExp(termino, 'i');                      // Lo que buscamos será el término y será insensible a may y min
    const productos = await Producto.find({                      // Si lo que buscamos no es por uid sino por un texto
        nombre:regex, estado:true                                // Mongo buscará en el nombre con el término de busqueda
    }).populate('categoria','nombre');   
            
    res.json({                                           
            results: productos                    
        });
    }        

const buscar = ( req ,res = response ) => {

    const { coleccion, termino } = req.params;           // Extraemos del url los params, colección y término de busqueda

    if(!coleccionesPermitidas.includes(coleccion)){      // Si la colección que se envía por la url no esta incluida en coleccionesPermitidas...      
        return res.status(400).json({
            msg:`Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        case 'categorias':
            buscarCategorias(termino, res);
            break;    
        case 'productos':
            buscarProductos(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta búsqueda'
            })
    }    
}

module.exports = {
    buscar
}