/**
 * @name Rutas de empledo
 * @description Rutas relacionadas a los empleados.
 * @author IIB
 */

// imports de modulo express y router
const express = require('express');
const router = express.Router();

// import de controlador
const usuarioCtrl = require('../controllers/usuario.controller');
const initCtrl = require('../controllers/init.controller');

// import de middleware
const autMiddleware = require('../middleware/aut.middleware');
const user_dto = require('./dto/user.dto');

// import de exceptions
const StandarException = require('../exception/StandarException');

// rutas

// usuario
router.post('/login', user_dto.buscarDto, async (req, res, next) => {
    const no_empleado = req.body.no_empleado === undefined ? null : req.body.no_empleado;
    const clave = req.body.clave === undefined ? null : req.body.clave;

    const resultado = await usuarioCtrl.login(no_empleado, clave);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, ...resultado });
});

router.post('/', autMiddleware.verifyToken, user_dto.registroDto, async (req, res, next) => {
    const nombre = req.body.nombre === undefined ? null : req.body.nombre;
    const no_empleado = req.body.no_empleado === undefined ? null : req.body.no_empleado;
    const clave = req.body.clave === undefined ? null : req.body.clave;
    const tipo_usuario = req.body.tipo_usuario === undefined ? null : req.body.tipo_usuario;
    const rol = req.body.rol === undefined ? null : req.body.rol;
    const isr = req.body.isr === undefined ? null : req.body.isr;

    const resultado = await usuarioCtrl.registro(nombre, no_empleado, clave, tipo_usuario, rol, isr);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, us: resultado });
});

router.post('/buscar', user_dto.buscarDto, async (req, res, next) => {
    const no_empleado = req.body.no_empleado === undefined ? null : req.body.no_empleado;
    const clave = req.body.clave === undefined ? null : req.body.clave;

    const resultado = await usuarioCtrl.buscarUsuario(no_empleado, clave);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, us: resultado });
});


router.get('/empleados', autMiddleware.verifyToken, async (req, res, next) => {
    const resultado = await usuarioCtrl.obtenerEmpleados();
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, empleados: resultado });

});


router.delete('/eliminar/:empleado', autMiddleware.verifyToken, async (req, res, next) => {
    const no_empleado = req.params.empleado;
    const resultado = await usuarioCtrl.eliminarUsuario(no_empleado);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, us: resultado });
});


router.put('/actualizar', autMiddleware.verifyToken, user_dto.actualizarUserDto, async (req, res, next) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const no_empleado = req.body.no_empleado;
    const rol = req.body.rol;

    const resultado = await usuarioCtrl.actualizarUser(id, nombre, no_empleado, rol);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, us: resultado });
});

// rol
router.post('/agregar_rol', autMiddleware.verifyToken, user_dto.agregarRolDto, async (req, res, next) => {
    const tipo = req.body.tipo;
    const sueldo = req.body.sueldo;
    const semana = req.body.semana;
    const jornada = req.body.jornada;
    const compensacion = req.body.compensacion;

    const resultado = await usuarioCtrl.agregrRol(tipo, sueldo, semana, jornada, compensacion);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, rol: resultado });
});

router.get('/rols', async (req, res, next) => {
    const resultado = await usuarioCtrl.obtenerROL();
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, rols: resultado });
});

// iniciar db
router.get('/init', autMiddleware.verifyToken, initCtrl.iniciarDB);

// export del modulo router
module.exports = router;