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
const autMiddleware = require('../middleware/aut.middleware');
const info_dto = require('./dto/informe.dto');

// import de exceptions
const StandarException = require('../exception/StandarException');

// rutas
router.get('/info/:us', autMiddleware.verifyToken, async (req, res, next) => {
    const id = req.params.us;
    const resultado = await informeCtrl.obtenerReporte(id);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, informe: resultado });
});
router.put('/info', autMiddleware.verifyToken, info_dto.editarEntrega, async (req, res, next) => {
    const entregas = req.body.entregas;
    const horas = req.body.horas;
    const enId = req.body.en;
    const rolId = req.body.rol;

    const resultado = await informeCtrl.editarEntrega(entregas, horas, enId, rolId);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, informe: resultado });
});
router.post('/info', autMiddleware.verifyToken, info_dto.eliminarEntrega, async(req, res, next) => {
    const enId = req.body.en;
    const rolId = req.body.rol;

    const resutado = informeCtrl.eliminarEntrega(enId, rolId);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, informe: resultado });
});

// export del modulo router
module.exports = router;