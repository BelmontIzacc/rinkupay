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

// rutas
router.get('/info/:us', informeCtrl.obtenerReporte);
router.put('/info', informeCtrl.editarEntrega);
router.post('/info', informeCtrl.eliminarEntrega);

// export del modulo router
module.exports = router;