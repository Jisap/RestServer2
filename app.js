//npm init -y
//npm i express dot env
//npm install cors
//npm install mongoose --save
//npm i bcryptjs
//npm i express-validator


require('dotenv').config();
const Server = require('./models/server');  // Requerimos el modelo del servidor


const server = new Server();    // Instanciamos el modelo

server.listen();    // Lanzamos el servidor en el puerto definido
 

 
