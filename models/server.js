const express = require('express');     // Inicializamos la libreria express
const cors = require('cors');

class Server{

    constructor(){
        this.app = express();               // Inicializamos la clase Server con express a través de app
        this.port = process.env.PORT;       // Inicializamos el puerto del server
        this.usuariosPath = '/api/usuarios';// Definimos el path de trabajo de usuarios

        this.middlewares();                 // Inicializamos un middleware
        
        this.routes();                      // Inicializamos nuestras rutas.
    }

    middlewares(){

        //const DIRECTORIO_PERMITIDO_CORS = "http://localhost:8080";
        //app.use(cors({origin:DIRECTORIO_PERMITIDO_CORS}))
        //Sino ponemos nada deja pasar todas las peticiones.

        this.app.use(cors());                                           // CORS permite restringir que dominios usan nuestro restserver
        this.app.use(express.json());                                   // Lectura y parseo del body (Cuando enviamos datos post)
        this.app.use(express.static('public'));                         // Nos redirecciona a index.html sino encuentra una ruta definida
    }

    routes(){                                                           // Este método define mis rutas

        this.app.use(this.usuariosPath, require('../routes/usuarios')); // Cuando se escriba la ruta definida se llamará al endpoint(usuarios.js)
    }                                                                   // y allí se usará el tipo de petición que definamos nosotros.  

    listen(){                                                           // Este método define el puerto de escucha   

        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server;