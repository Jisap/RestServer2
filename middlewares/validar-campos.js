const { validationResult } = require('express-validator');


const validarCampos = (req, res, next) => {

    const errors = validationResult(req);                         // El body (req) se envia a express-validators  
        if (!errors.isEmpty()) {                                  // Si existen errores los devolvemos en la respuesta (res)   
            return res.status(400).json(errors);                  // La respuesta será pues un error.
        }

        next();                                                   // Pero sino hay errores continua el resto de la programación  
}

module.exports = {
    validarCampos
}