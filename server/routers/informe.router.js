/**
 * @name Rutas de informe
 * @description Rutas relacionadas al reporte por usuario.
 * @author IIB
 */

// imports de modulo express y router
const express = require('express');
const router = express.Router();

// import de controlador
const informeCtrl = require('../controllers/informe.controller');

// import de middleware
const autMiddleware = require('../aut.middleware');
const info_dto = require('./dto/informe.dto');

// rutas
router.get('/info/:us', autMiddleware.verifyToken, informeCtrl.obtenerReporte);
router.put('/info', autMiddleware.verifyToken, info_dto.editarEntrega, informeCtrl.editarEntrega);
router.post('/info', autMiddleware.verifyToken, info_dto.eliminarEntrega, informeCtrl.eliminarEntrega);

// export del modulo router
module.exports = router;