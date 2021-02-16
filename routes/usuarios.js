
const { Router } = require('express');          // Desestructuramos Router del paquete express
const { usuariosGet } = require('../controllers/usuarios');
const { usuariosPosts} = require('../controllers/usuarios')
const { usuariosPut} = require('../controllers/usuarios')
const { usuariosDelete} = require('../controllers/usuarios')

const router = Router();                        // router contendrá los distintos tipos de peticiones y su ruta asociada 
                                                // sin configurar. Esto es lo que se llaman como endpoints.

        router.get('/', usuariosGet);

        router.put('/:id', usuariosPut);        // Al usuariosPath se le añade el params :id (params es una parte del url que cambia)

        router.post('/', usuariosPosts);

        router.delete('/', usuariosDelete);



module.exports = router;