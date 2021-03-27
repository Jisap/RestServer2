const path = require('path');               // Nos traemos la prop path para poder conbstruir nuestros propios urls
const { v4: uuidv4 } = require('uuid');     // Paquete para renombrar archivos

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => { // Queremos subir un archivo a una carpeta 
                                                                                                     // según ext válidas.         

    return new Promise (( resolve, reject) => {                     // Haremos la subida con un sistema de promesas.

        const { archivo } = files;                                  // De la petición de subida extraigo lo que quiero subir
        const nombreCortado = archivo.name.split('.');              // Dividimos el nombre del archivo segun '.' para obtener la extensión
        const extension = nombreCortado[nombreCortado.length-1];    // Obtenemos la extensión

                                                                    // Dadas las extensiones permitidas, validamos que el archivo la tenga
        if(!extensionesValidas.includes(extension)){
            return reject(`La extension ${ extension } no es permitida, ${ extensionesValidas }`)
        }

        const nombreTemp = uuidv4() + '.' + extension;                              // Generamos un nombre para el archivo en el server  
        const uploadPath = path.join(__dirname, '../uploads/',carpeta, nombreTemp); // Definimos donde queremos subir el archivo, subimos un nivel 
                                                                                    // en el sist de directorios porque sino apuntaria a helpers 
                                                                                    // Carpeta estaría dentro de uploads y lo det el usuario

        archivo.mv(uploadPath, (err) => {                 // Movemos el archivo al path definido
            if (err) {
                reject (err);                             // Gestión del error si lo hay
            }

            resolve(nombreTemp);                          // Si todo fue bien mensaje de ok y devolvemos el nombre del archivo subido
        });

    });

}

module.exports = {
    subirArchivo
}