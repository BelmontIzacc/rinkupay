/**
 * @name Rutas de nomina
 * @description Rutas relacionadas a la nomina.
 * @author IIB
 */

// imports de modulo express y router
const express = require('express');
const router = express.Router();

// import de middleware
const autMiddleware = require('../middleware/aut.middleware');
const nomina_dto = require('./dto/nomina.dto');

// import de controlador
const nominaCtrl = require('../controllers/nomina.controller');

// import de exceptions
const StandarException = require('../exception/StandarException');

// rutas

// corte
router.get('/corte', autMiddleware.verifyToken, async (req, res, next) => {
    const resultado = await nominaCtrl.obtenerUserCo();
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, cos: resultado });
})

//isr
router.post('/reg_isr', autMiddleware.verifyToken, nomina_dto.registrar_isr, async (req, res, next) => {
    const tasa_base = req.body.base;
    const limite = req.body.limite;
    const adic = req.body.adicional;
    const dia_corte = req.body.dia_corte;

    const resultado = await nominaCtrl.registrar_isr(tasa_base, limite, adic, dia_corte);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, isr: resultado });
});

router.get('/isr', autMiddleware.verifyToken, async (req, res, next) => {
    const resultado = await nominaCtrl.obtenerIsr();
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, isr: resultado });
});

//entregas
router.post('/reg_entrega', nomina_dto.registrar_en, async (req, res, next) => {
    const us = req.body.us;
    const entregas = req.body.entregas;
    const hora = req.body.horas;
    const fecha = req.body.fecha;
    const co = req.body.co;

    const resultado = await nominaCtrl.registrar_en(us, entregas, hora, fecha, co);
    if (resultado instanceof StandarException) {
        next(resultado);
        return;
    }
    res.json({ estatus: true, en: resultado });
})

// export del modulo router
module.exports = router;