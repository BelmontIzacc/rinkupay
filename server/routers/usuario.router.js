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

// rutas

// usuario
router.post('/', usuarioCtrl.registro);
router.post('/login', usuarioCtrl.login);
router.post('/buscar', usuarioCtrl.buscarUsuario);
router.get('/empleados', usuarioCtrl.obtenerEmpleados);
router.delete('/eliminar/:empleado', usuarioCtrl.eliminarUsuario);

// rol
router.post('/agregar_rol', usuarioCtrl.agregrRol)
router.get('/rols', usuarioCtrl.obtenerROL)

// export del modulo router
module.exports = router;