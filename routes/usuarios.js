
const { Router } = require('express');          // Desestructuramos Router del paquete express
const { check } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioPorID } = require('../helpers/db-validators');

// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar-jwt');
// const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');

const {validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares')

const { usuariosGet } = require('../controllers/usuarios');
const { usuariosPosts} = require('../controllers/usuarios')
const { usuariosPut} = require('../controllers/usuarios')
const { usuariosDelete} = require('../controllers/usuarios');

const router = Router();                        // router contendrá los distintos tipos de peticiones y su ruta asociada 
                                                // sin configurar. Esto es lo que se llaman como endpoints.

        router.get('/', usuariosGet);

        router.put('/:id',[
                check('id', 'No es una ID válido').isMongoId(),     // Usando express-validator (check) comprobamos que el id pertenece a mongo
                check('id').custom(existeUsuarioPorID),             // que el id existe en la bd    
                check('rol').custom(esRoleValido),                  // y que el role es válido.    
                validarCampos
        ],usuariosPut);                                             // Al usuariosPath se le añade el params :id (params es una parte del url que cambia)

        router.post('/',[                                                                       // Usando express-validator (check)                     
                check('nombre', 'El nombre esta vacio').not().isEmpty(),                        // Comprobamos que el nombre no viene vacio
                check('password', 'Password es obligatorio y min 6 letras').isLength({min:6}),  // la longitud de la pass
                check('correo', 'El correo no es válido').isEmail(),                            // que el correo es válido
                check('correo').custom(emailExiste),                                            // y ademas que no este repetido
                //check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),      // que los roles son válidos
                check('rol').custom(esRoleValido),                                              // para ello usamos un helper
                validarCampos                                                                   // Por último comprobamos si los anteriores 
                                                                                                // cheks han dado errores, y si los hay los muestra                                        
        ], usuariosPosts);

        router.delete('/:id',[
                validarJWT,                                                     // Comprobaremos que el usuario que quiere borrar esta validado
                //esAdminRole,                                                  // Este middleware es estricto, solo los admin_role puede borrar
                tieneRole('ADMIN_ROLE','VENTAS_ROLE'),                          // Este middleware admite los roles de la lista
                check('id', 'No es una ID válido').isMongoId(),                 // Se comprobará que id es un mongoId
                check('id').custom(existeUsuarioPorID),                         // Y comprobaremos que el usuario existe
                validarCampos
        ], usuariosDelete);



module.exports = router;