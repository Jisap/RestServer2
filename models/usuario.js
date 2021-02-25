
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({

    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol:{
        type: String,
        required: true,
        //enum:['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }

});

UsuarioSchema.methods.toJSON = function(){
    const { __v, password, _id, ...usuario } = this.toObject(); // Del objeto UsuarioSchema extraemos __v, password y _id y el resto de elementos
                                                                // se agrupan en otro objeto llamado usuario
    usuario.uid = _id;                                          // _id lo renombramos y lo insertamos en usuario.                   
    return usuario                                              // usuario no contendrá la pass y no se mostrará

    
}

module.exports = model('Usuario', UsuarioSchema);