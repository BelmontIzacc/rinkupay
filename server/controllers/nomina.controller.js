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
const usuarioModel = require("../models/usuario");
const rolModel = require("../models/rol");

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
    const dia_corte = req.body.dia_corte;

    const isr = new isrModel();
    isr.tasa_base = tasa_base;
    isr.limite = limite;
    isr.tasa_ad = adic;
    isr.creacion = new Date();
    isr.actualizado = new Date();
    isr.dia_corte = dia_corte;
    await isr.save()

    const id = isr._id;
    res.json({
        estatus: true,
        isr: id
    });
}


/**
 * @name recuperarISR
 * @author IIB
 * @version 0.0.2
 * @description Recupera el registro mas actual del ISR.
 * @returns { estatus: true, isr: {'...'}} | 
 */
nominaCtrl.obtenerIsr = async (req, res) => {
    const isr = await isrModel.find().sort({ creacion: -1 });

    res.json({
        estatus: true,
        isr: isr[0]
    })
}

/**
 * @name recuperarUserCO
 * @author IIB
 * @version 0.0.2
 * @description De la coleccion CORTE (CO) recupera el registro de corte mas actual.
 * @returns { estatus: true, cos: [{'...'}]} 
 */

nominaCtrl.obtenerUserCo = async (req, res) => {
    const cortes = await coModel.find().sort({ creacion: -1 });
    const unicCo = [];
    const idsReg = [""];
    for (let co of cortes) {
        const userId = co.US;
        const existe = idsReg.indexOf(elemento => elemento === userId);
        if (existe === -1) {
            idsReg.push(userId);
            unicCo.push(co);
        }
    }
    res.json({ estatus: true, cos: unicCo })
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

    const corte = await coModel.findOne({ _id: co });
    if (!corte) {
        res.send({
            estatus: false,
            mensaje: "No existe el registro CO"
        });
        return;
    }

    const usuario = await usuarioModel.findOne({ _id: us });
    if (!usuario) {
        res.send({
            estatus: false,
            mensaje: "No existe el usuario"
        });
        return;
    }
    const rolId = usuario.ROL;

    const rolRef = await rolModel.findOne({ _id: rolId });
    if (!rolRef) {
        res.send({
            estatus: false,
            mensaje: "El rol del usuario no existe"
        });
        return;
    }
    const limite_hrs = rolRef.dias_semana * rolRef.jornada;

    const actualizarCorte = [];

    // regitrar entrega
    const en = new enModel();
    en.US = us;
    en.CO = "Pendiente";
    en.entregas = entregas;
    en.horas = hora;
    en.fecha = fecha;
    en.creacion = new Date();
    en.actualizado = new Date();
    await en.save();

    // validar a que corte va
    const fechaCreacionCorte = new Date(corte.creacion); // fecha del registro corte
    fechaCreacionCorte.setHours(0);
    fechaCreacionCorte.setMinutes(0);
    fechaCreacionCorte.setSeconds(0);
    fechaCreacionCorte.setMilliseconds(0);
    const fechaFinCorte = new Date(corte.corte);
    const isr = await isrModel.find().sort({ creacion: -1 });
    const isrReg = isr[0];
    const diaCorteIsr = isrReg.dia_corte; // dia de corte indicado por el ISR

    const fechaEntrega = new Date(fecha); // dia del registro de la entrega
    const total_hrs_registradas = corte.hrs_total;

    if (fechaEntrega.getTime() >= fechaCreacionCorte.getTime() && fechaEntrega.getTime() <= fechaFinCorte.getTime() && limite_hrs > total_hrs_registradas) {
        const idEn = en._id;
        const enArray = corte.EN;
        enArray.push(idEn);

        await corte.updateOne({ EN: enArray });
        await en.updateOne({
            CO: "" + co
        });
        actualizarCorte.push(co);
        await calcularCorte(actualizarCorte, limite_hrs, rolRef, isrReg);
    } else {
        if (fechaEntrega.getTime() > fechaFinCorte.getTime()) {
            const nombre_mes = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
            const mes = new Date().getMonth() + 1;
            const year = new Date().getFullYear();
            const idEn = en._id;

            const fechaBase = new Date();
            const corte_md = new coModel();
            corte_md.US = us;
            corte_md.periodo = nombre_mes[mes] + " " + year;
            corte_md.entregas = 0;
            corte_md.pago_bruto = 0;
            corte_md.pago_neto = 0;
            corte_md.hrs_total = 0;
            corte_md.despensa = 0;
            corte_md.detalles = {};
            corte_md.EN = [idEn];
            corte_md.corte = new Date(fechaBase.getFullYear(), fechaBase.getMonth() + 1, diaCorteIsr);
            corte_md.creacion = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), diaCorteIsr + 1);
            corte_md.actualizado = fechaBase;
            await corte_md.save();
            await en.updateOne({
                CO: "" + corte_md._id
            });

            const buscarUsuario = await usuarioModel.findOne({ _id: us });
            const coArray = buscarUsuario.CO;
            coArray.push("" + corte_md._id)
            await buscarUsuario.updateOne({
                CO: coArray
            });
            actualizarCorte.push(corte_md._id)
            actualizarCorte.push(co);

            await calcularCorte(actualizarCorte, limite_hrs, rolRef, isrReg);
        } else {
            const idEn = en._id;
            await enModel.deleteOne({ _id: idEn });
            res.send({
                estatus: false,
                mensaje: "El registro esta fuera del corte"
            });
            return;
        }
    }

    res.json({
        estatus: true,
        en: en._id
    });
}

/**
 * @name calcularCorteHrsEntregas
 * @author IIB
 * @version 0.0.2
 * @description Calcula el total de horas trabajadas y entregas realizadas.
 * @param idsCorte Array de identificadores de corte, a los cuales se calculara sus horas y entregas totales
 */
calcularCorte = async (idsCorte, limite_hrs, rolRef, isrReg) => {
    // sueldos
    const sueldo_base = rolRef.sueldo_base;
    const compensacion = rolRef.compensacion;
    const valoresCompensacion = [-1, -1, -1];

    for (let comp of compensacion) {
        const tipo = comp.tipo - 1;
        valoresCompensacion[tipo] = comp.monto;
    }

    // impuestos
    const tasa_base = isrReg.tasa_base;
    const limite = isrReg.limite;
    const tasa_ad = isrReg.tasa_ad;

    for (let idCo of idsCorte) {
        const cortes = await coModel.findOne({ '_id': idCo });
        if (cortes) {
            const entregas = cortes.EN;
            const arrayEntregas = [];

            for (let entrega of entregas) {
                const entregaRef = enModel.findOne({ '_id': entrega });
                arrayEntregas.push(entregaRef);
            }
            const entregasResueltas = await Promise.all(arrayEntregas);
            if (entregasResueltas.length > 0) {
                let total_hrs = 0;
                let total_entregas = 0;
                for (let refRes of entregasResueltas) {
                    total_hrs += refRes.horas;
                    total_entregas += refRes.entregas;
                }

                if (total_hrs >= limite_hrs) {
                    total_hrs = limite_hrs;
                }

                const detalles = {
                    pago_entregas: 0,
                    pago_bonos: 0,
                    retenciones: 0
                };
                // calculo de salario hrs x sueldo base
                let totalBruto = total_hrs * sueldo_base;
                // calculo adicional entregas x compensacion
                const entrega_comp = valoresCompensacion[0] * total_entregas;
                detalles.pago_entregas = entrega_comp;
                totalBruto = totalBruto + entrega_comp;
                //  bono por hora x rol
                if (valoresCompensacion[1] !== -1) {
                    const bono_hora = (valoresCompensacion[1] * total_hrs);
                    totalBruto = totalBruto + bono_hora;
                    detalles.pago_bonos = bono_hora;
                }
                // retencion
                let retencion = (totalBruto * tasa_base);
                let pago_neto = totalBruto - retencion;
                if (totalBruto > limite) {
                    pago_neto = pago_neto - (totalBruto * tasa_ad);
                    retencion += (totalBruto * tasa_ad);
                }
                detalles.retenciones = retencion;
                // calculo de vale de despensa
                const despensa = valoresCompensacion[2] * pago_neto
                await cortes.updateOne({
                    entregas: total_entregas,
                    hrs_total: total_hrs,
                    pago_bruto: totalBruto,
                    pago_neto: pago_neto,
                    despensa: despensa,
                    detalles: detalles
                });
            }
        }
    }
}

module.exports = nominaCtrl;