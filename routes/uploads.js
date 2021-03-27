//npm i jsonwebtoken
//npm i express-fileupload

const { Router } = require('express');          // Desestructuramos Router del paquete express
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

    router.post('/', validarArchivoSubir ,cargarArchivo);
    router.put('/:coleccion/:id',[
        validarArchivoSubir,
        check('id','El id debe ser de Mongo').isMongoId(),
        check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios','productos'])), // c -> coleccion, []->colecc permitidas
        validarCampos
    ], actualizarImagenCloudinary)    
    //], actualizarImagen)
    router.get('/:coleccion/:id',[
        check('id','El id debe ser de Mongo').isMongoId(),
        check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios','productos'])), // c -> coleccion, []->colecc permitidas
        validarCampos
    ],mostrarImagen)

module.exports = router;