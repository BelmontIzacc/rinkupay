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
const autMiddleware = require('../aut.middleware');

// rutas

// usuario
router.post('/', autMiddleware.verifyToken, usuarioCtrl.registro);
router.post('/login', usuarioCtrl.login);
router.post('/buscar', usuarioCtrl.buscarUsuario);
router.get('/empleados', autMiddleware.verifyToken, usuarioCtrl.obtenerEmpleados);
router.delete('/eliminar/:empleado', autMiddleware.verifyToken, usuarioCtrl.eliminarUsuario);
router.put('/actualizar', autMiddleware.verifyToken, usuarioCtrl.actualizarUser);

// rol
router.post('/agregar_rol', autMiddleware.verifyToken, usuarioCtrl.agregrRol);
router.get('/rols', usuarioCtrl.obtenerROL);

// iniciar db
router.get('/init', autMiddleware.verifyToken, initCtrl.iniciarDB);

// export del modulo router
module.exports = router;