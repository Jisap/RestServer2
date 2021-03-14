const {Schema, model} = require('mongoose');


const ProductoSchema = Schema({
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
    usuario:{ // usuario que creo/grabó el producto
        type: Schema.Types.ObjectId,
        ref:'Usuario',
        required: true
    },
    precio:{
        type: Number,
        default: 0 
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        require: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true},
});

ProductoSchema.methods.toJSON = function(){
    const { __v, estado, ...data } = this.toObject();   // Del objeto CategoriaSchema extraemos __v y el estado y el resto de elementos
                                                        // se agrupan en otro objeto llamado data
                                                                 
    return data                                 
    
}

module.exports = model('Producto', ProductoSchema);