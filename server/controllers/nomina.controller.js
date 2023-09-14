/**
 * @name Controlador de nomina
 * @description Contiene la logica y funciones relacionadas al registro de horas, calculo de nomina y retencion de impuestos.
 * @author IIB
 */

const nominaCtrl = {};

// import de modelos
const isrModel = require("../models/isr");
const enModel = require("../models/entrega");
const coModel = require("../models/corte");

/**
 * @name registrar_isr
 * @author IIB
 * @version 0.0.1
 * @description Crea un regitro de deduccion de impuestos (ISR).
 * @param base Tasa del impuesto sobre la renta (ISR) base.
 * @param limite Límite de ingresos para el impuesto sobre la renta (ISR) adicional.
 * @param adicional Tasa del impuesto sobre la renta (ISR) adicional, esta es válida cuando el ingreso sobrepasa el “limite” establecido.
 * @returns { estatus: true, isr: '...'} | 
 */
nominaCtrl.registrar_isr = async (req, res) => {
    const tasa_base = req.body.base;
    const limite = req.body.limite;
    const adic = req.body.adicional;

    const isr = new isrModel();
    isr.tasa_base = tasa_base;
    isr.limite = limite;
    isr.tasa_ad = adic;
    isr.creacion = new Date();
    isr.actualizado = new Date();
    await isr.save()

    const id = isr._id;
    res.json({
        estatus: true,
        isr: id
    });
}

/**
 * @name registrar_en
 * @author IIB
 * @version 0.0.1
 * @description Crea un regitro para la coleccion entregas (EN).
 * @param us Identificador del usuario, indica a que usuario pertenece el registro de entrega.
 * @param entregas Numero de entregas realizadas.
 * @param hora Total de horas trabajadas en el dia.
 * @param fecha Fecha en la cual se reporta la entrega.
 * @returns { estatus: true, en: '...'} | 
 */
nominaCtrl.registrar_en = async (req, res) => {
    const us = req.body.us;
    const entregas = req.body.entregas;
    const hora = req.body.horas;
    const fecha = req.body.fecha;
    const co = req.body.co; 

    const corte = await coModel.findOne({_id: co});
    if (!corte) {
        res.send({
            estatus: false,
            mensaje: "No existe el registro CO"
        }); 
        return;
    }

    const en = new enModel();
    en.US = us;
    en.CO = co;
    en.entregas = entregas;
    en.horas = hora;
    en.fecha = fecha;  // cambiar por date
    en.creacion = new Date();
    en.actualizado = new Date();
    await en.save();

    const idEn = en._id;
    const enArray = corte.EN;
    enArray.push(idEn);

    await coModel.findByIdAndUpdate(co, {EN: enArray});

    res.json({
        estatus: true,
        en: idEn
    });
}

module.exports = nominaCtrl;