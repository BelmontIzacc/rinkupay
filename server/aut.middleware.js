/**
 * @name Middleware de autenticacion
 * @description Evalua el token enviado por medio de la petcion a api para verificar que se trata de un usuario valido del sistema
 * @author IIB
 */

// import para validar el token enviado
const jwt = require('jsonwebtoken');

const autMiddleware = {};
const tk = "zcz0au22eiz3s23l4oie2V222";

autMiddleware.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (authHeader === undefined || authHeader === null) return res.sendStatus(404);
    const token = authHeader && authHeader.split(" ")[0];
    if(token == null) return res.sendStatus(404);
    jwt.verify(token, tk, (err, user) => {
        if(err) return res.sendStatus(404);
        req.uid = user.id;
        req.no_empleado = user.no_empleado;
        next();
    });

};

module.exports = autMiddleware;