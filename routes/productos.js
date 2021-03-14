const { Router, response } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, esAdminRole } = require('../middlewares');

const { obtenerProductos,
        actualizarProducto,
        obtenerProducto,
        crearProducto,
        borrarProducto } = require('../controllers/productos')

const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router();

//Obtener todas los productos - público
router.get('/', obtenerProductos); 

//Obtener un producto por id - público
router.get('/:id', [
    check('id', 'No es una ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos,
],obtenerProducto);  

//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es una ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],actualizarProducto
);

//Crear un nuevo producto - privado - cualquier persona con un token válido
router.post('/',[ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

//Borrar un producto - Solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es una ID válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],

borrarProducto);




module.exports = router;