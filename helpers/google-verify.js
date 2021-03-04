


const { OAuth2Client } = require('google-auth-library'); // Requerimos la libreria de google para autentificar tokens de google

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Identificamos el client ID de google

const googleVerify = async (idToken ='') => {                 // Con googleVerify comprobamos que idToken proporcionado en el body de la petición            
                                                              // a nuestro server pertenece a google, para ello  
  const ticket = await client.verifyIdToken({                 // confrontamos nuestro cliente_Id con el idToken del body  

    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,  

  });                                                         // Si todo va bien  

  const {name: nombre,
         picture: img,
         email: correo } = ticket.getPayload();        // generamos un payload y extraemos lo que nos hace falta
                                                       // Lo renombramos como lo tenemos en el modelo de nuestro restserver2 
  
  return {
      nombre, img, correo
  };
}

module.exports = {
    googleVerify
}