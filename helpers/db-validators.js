const  Role = require('../models/role')
const {Usuario , Categoria, Producto} = require('../models')

const esRoleValido = async(rol='') => {
    const existeRol = await Role.findOne({rol});                                // Constrastaremos el rol del body contra el de la bd
        if(!existeRol){                                                         // Si el rol no existe lanzaremos un error
            throw new Error(`El rol ${ rol } no esta registrado en la BD`)
        }
}


const emailExiste = async(correo='') => {
    const existeEmail = await Usuario.findOne({correo: correo})   // Buscamos un correo en bd que coincida con el pasado por argumentos.  
        if(existeEmail){
            throw new Error(`El correo ${ correo } ya esta registrado`);
        }
}      
    
const existeUsuarioPorID = async(id='') => {
    const existeUsuario = await Usuario.findById(id)   // Buscamos un id en bd que coincida con el pasado por argumentos.  
        if(!existeUsuario){
            throw new Error(`El id ${ id } no existe en la bd`);
        }
}      

const existeCategoriaPorId = async(id='') => {
    const existeCategoria = await Categoria.findById(id)
        if(!existeCategoria){
            throw new Error(`El id ${id} no existe en la bd`);
        }
}

const existeProductoPorId = async(id='') => {
    const existeProducto = await Producto.findById(id)
        if(!existeProducto){
            throw new Error(`El id ${id} no existe en la bd`);
        }
}

const coleccionesPermitidas = (coleccion='', colecciones=[]) => {
    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}