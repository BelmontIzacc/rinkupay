/**
 * @name Rutas de nomina
 * @description Rutas relacionadas a la nomina.
 * @author IIB
 */

// imports de modulo express y router
const express = require('express');
const router = express.Router();

// import de controlador
const nominaCtrl = require('../controllers/nomina.controller');

// rutas

//isr
router.post('/reg_isr', nominaCtrl.registrar_isr);

//entregas
router.post('/reg_entrega', nominaCtrl.registrar_en)

// export del modulo router
module.exports = router;