const express = require('express');     // Inicializamos la libreria express
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { dbConnection } = require('../database/config');

class Server{

    constructor(){
        this.app = express();               // Inicializamos la clase Server con express a través de app
        this.port = process.env.PORT;       // Inicializamos el puerto del server

        this.paths = {
            auth:      '/api/auth',         // Definimos el path para realizar la autenticación
            usuarios:  '/api/usuarios',     // Definimos el path de trabajo de usuarios
            categorias:'/api/categorias',   // Definimos el path de trabajo de categorias   
            productos: '/api/productos',
            buscar:    '/api/buscar',
            uploads:   '/api/uploads'
        }       

        this.conectarDB();                  // Conectamos a la bd

        this.middlewares();                 // Inicializamos un middleware
        
        this.routes();                      // Inicializamos nuestras rutas.
    }

    async conectarDB(){                     // Método para conectar a la bd configurado en config.js

        await dbConnection();
    }

    middlewares(){

        //const DIRECTORIO_PERMITIDO_CORS = "http://localhost:8080";
        //app.use(cors({origin:DIRECTORIO_PERMITIDO_CORS}))
        //Sino ponemos nada deja pasar todas las peticiones.

        this.app.use(cors());                                           // CORS permite restringir que dominios usan nuestro restserver
        this.app.use(express.json());                                   // Lectura y parseo del body (Cuando enviamos datos post)
        this.app.use(express.static('public'));                         // Nos redirecciona a index.html sino encuentra una ruta definida
        this.app.use(fileUpload({                                       // Gestiona la carga de archivos usando un directorio temporal
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
        
    }

    routes(){                                                           // Este método define mis rutas

        this.app.use(this.paths.usuarios, require('../routes/usuarios')); // Cuando se escriba la ruta definida se llamará al endpoint(usuarios.js)
                                                                          // y allí se usará el tipo de petición que definamos nosotros. 
        this.app.use(this.paths.auth, require('../routes/auth'));         // Cuando se escriba la ruta de auth se llamará a auth.js
    
        this.app.use(this.paths.categorias, require('../routes/categorias'));

        this.app.use(this.paths.productos, require('../routes/productos'));
    
        this.app.use(this.paths.buscar, require('../routes/buscar'));
    
        this.app.use(this.paths.uploads, require('../routes/uploads'))
    }                                                                    

    listen(){                                                           // Este método define el puerto de escucha   

        this.app.listen(this.port, ()=>{
            console.log('Servidor corriendo en puerto', this.port)
        });
    }
}

module.exports = Server;