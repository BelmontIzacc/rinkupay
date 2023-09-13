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
router.post('/', usuarioCtrl.registro);
router.post('/login', usuarioCtrl.login);

router.post('/agregar_rol', usuarioCtrl.agregrRol)

// export del modulo router
module.exports = router;