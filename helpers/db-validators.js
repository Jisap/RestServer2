const  Role = require('../models/role')
const Usuario = require('../models/usuario')

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


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorID
}