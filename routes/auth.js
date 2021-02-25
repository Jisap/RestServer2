//npm i jsonwebtoken

const { Router } = require('express');          // Desestructuramos Router del paquete express
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

    router.post('/login', [                                                 // Configuramos la ruta hacia login. Apuntamos así a api/auth/login
        check('correo', 'El correo es obligatorio').isEmail(),              // Chekeamos que el correo sea tipo email
        check('password', 'La contraseña es obligatoria').not().isEmpty(),  // Chekeamos que la password no venga vacia
        validarCampos
    ],login );                                                          

module.exports = router;