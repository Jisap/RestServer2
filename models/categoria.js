const {Schema, model} = require('mongoose');
const { Categoria } = require('.');

const CategoriaSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    usuario:{ // usuario que creo/grabó la categoria
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: true
    }
});

CategoriaSchema.methods.toJSON = function(){
    const { __v, estado, ...data } = this.toObject();   // Del objeto CategoriaSchema extraemos __v y el estado y el resto de elementos
                                                        // se agrupan en otro objeto llamado data
                                                                 
    return data                                 
    
}

module.exports = model('Categoria', CategoriaSchema);