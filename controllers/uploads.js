//npm install uuid
const path = require('path');
const fs = require('fs');
const { response } = require('express');
const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const cargarArchivo = async(req, res = response) => {   // req.files contiene el archivo a subir

    try {
        
        const nombre = await subirArchivo(req.files,['txt','md'], 'textos');  // Usamos el controller subirArchivo para enviar el archivo al server
        res.json({nombre});                                                   // Mostramos el nombre del archivo subido
                                                   
    } catch (error) {
        res.status(400).json({
            error
        })        
    }
}

const actualizarImagen = async(req, res=response) =>{   // Vamos a actualizar la imagen de un usuario

    const {id, coleccion} = req.params;                 // Extraemos de los params lo que necesitamos, id y colección

    let modelo;

    switch (coleccion) {

        case 'usuarios':                                              // Verificamos que el id del usuario se encuentre en la bd
            modelo = await Usuario.findById(id);                      // A ese usuario lo llamamos modelo
            if (!modelo){                                             // Sino se encuentra msg de error.
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });
            }
            break;
    
        case 'productos':                                              // Verificamos que el id del producto se encuentre en la bd
            modelo = await Producto.findById(id);                      // A ese producto también lo llamamos modelo  
            if (!modelo){                                              // Sino se encuentra msg de error.
                return res.status(400).json({
                    msg:`No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
            
    }

    //limpiar imagenes previas
    if(modelo.img){  // Si el modelo tiene la prop img
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); // Construimos el path a esa imagen
        if(fs.existsSync( pathImagen )){                                              // preguntamos al file system si existe esa imagen en ese pathj
            fs.unlinkSync( pathImagen );                                              // si exite la borramos      
        }
    }

                                                                                            //por defecto son img
    const nombre = await subirArchivo(req.files, undefined, coleccion);  // Subimos un archivo sin expecificar el tipo a la carpeta coleccion en el server
    modelo.img = nombre;                                                 // Introducimos el nombre de la img dentro del usuario o producto
    await modelo.save();                                                 // Grabamos  ese usuario o producto en la bd

    res.json({
        modelo
    })
}

const actualizarImagenCloudinary = async(req, res=response) =>{   // Vamos a actualizar la imagen de un usuario

    const {id, coleccion} = req.params;                 // Extraemos de los params lo que necesitamos, id y colección

    let modelo;

    switch (coleccion) {

        case 'usuarios':                                              // Verificamos que el id del usuario se encuentre en la bd
            modelo = await Usuario.findById(id);                      // A ese usuario lo llamamos modelo
            if (!modelo){                                             // Sino se encuentra msg de error.
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });
            }
            break;
    
        case 'productos':                                              // Verificamos que el id del producto se encuentre en la bd
            modelo = await Producto.findById(id);                      // A ese producto también lo llamamos modelo  
            if (!modelo){                                              // Sino se encuentra msg de error.
                return res.status(400).json({
                    msg:`No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
            
    }

    //limpiar imagenes previas
    if(modelo.img){  // Si el modelo tiene la prop img
       const nombreArr = modelo.img.split('/');
       const nombre = nombreArr[nombreArr.length - 1];                         // id.img de la imagen en cloudinary   
       const [public_id] = nombre.split('.');                                  // id final de la imagen
       cloudinary.uploader.destroy(public_id);                                 // Borramos la imagen en cloudinary 
    }
                                                                               // En la petición al server se genera un directorio temp de subida
    const { tempFilePath } = req.files.archivo                                 // Obtenemos el directorio temp donde se guarda el archivo a subir
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath);     // Subimos a cloudinary el archivo y obtenemos una resp de la cual 
                                                                               // desestructuramos el secure_url 
                                                                               
    modelo.img = secure_url;                                                   // Guardamos ese secure_url en el producto/usuario como img  
    await modelo.save();                                                       // Y guardamos en la bd ese producto/usuario ya actualizado                                                                
    res.json({
        modelo
    })
}

const mostrarImagen = async(req, res= response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {

        case 'usuarios':                                              // Verificamos que el id del usuario se encuentre en la bd
            modelo = await Usuario.findById(id);                      // A ese usuario lo llamamos modelo
            if (!modelo){                                             // Sino se encuentra msg de error.
                return res.status(400).json({
                    msg:`No existe un usuario con el id ${id}`
                });
            }
            break;
    
        case 'productos':                                              // Verificamos que el id del producto se encuentre en la bd
            modelo = await Producto.findById(id);                      // A ese producto también lo llamamos modelo  
            if (!modelo){                                              // Sino se encuentra msg de error.
                return res.status(400).json({
                    msg:`No existe un producto con el id ${id}`
                });
            }
            break;

        default:
            return res.status(500).json({msg: 'Se me olvido validar esto'});
            
    }

    if(modelo.img){  // Si el modelo tiene la prop img
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img); // Construimos el path a esa imagen
        if(fs.existsSync( pathImagen )){                                              // preguntamos al file system si existe esa imagen en ese path
            return res.sendFile(pathImagen)                                           // Retornamos como respuesta el archivo con encabezado http       
        }
    }

    const pathImagen = path.join(__dirname, '../assets/no-image.jpg')                 // Sino existe la imagen construimos el path hacia el no-image  
    res.sendFile(pathImagen)                                                          // y retornamos como respues el archivo con encabezado htto de no-image  

}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}