const { Router, response } = require('express');          // Desestructuramos Router del paquete express
const { check } = require('express-validator');
const { crearCategoria,
        obtenerCategoria,
        actualizarCategoria,
        obtenerCategorias,
        borrarCategoria
             } = require('../controllers/categorias');
const { validarJWT, esAdminRole } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router();

//{{url}}/api/categorias

//Obtener todas las categorías - público
router.get('/', obtenerCategorias); 

//Obtener una categoría por id - público
router.get('/:id', [
    check('id', 'No es una ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos,
],obtenerCategoria);    

//Crear una nueva categoría - privado - cualquier persona con un token válido
router.post('/',[ 
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

//Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],
actualizarCategoria);

//Borrar una categoría - Solo admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es una ID válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],

borrarCategoria);


module.exports = router;
