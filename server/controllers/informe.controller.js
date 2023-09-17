/**
 * @name Controlador de informe
 * @description Recupera los datos de un empleado para generar un informe detallado
 * @author IIB
 */

const informeCtrl = {};

// import de modelos
const enModel = require("../models/entrega");
const coModel = require("../models/corte");
const usuarioModel = require("../models/usuario");
const rolModel = require("../models/rol");
const isrModel = require("../models/isr")

/**
 * @name obtenerReporte
 * @author IIB
 * @version 0.0.3
 * @description recupera los cortes de un usuario y sus respectivas entregas
 * @param us identificador de usuario.
 * @returns { estatus: true, informe: [{...}]} | 
 */
informeCtrl.obtenerReporte = async (req, res) => {
    const id = req.params.us;

    const userFind = await usuarioModel.findOne({ '_id': id });
    if (!userFind) {
        res.json({
            estatus: false,
            informe: "No existe el usuario indicado"
        });
        return;
    }

    const corte = userFind.CO;
    const arrayCorte = [];
    for (let idCo of corte) {
        const refCorte = await coModel.findOne({ _id: idCo });
        if (refCorte) {
            const consultaEntregas = [];
            const entregas = refCorte.EN;
            for (let idEnt of entregas) {
                const refEntregas = enModel.findOne({ _id: idEnt });
                consultaEntregas.push(refEntregas);
            }
            const resuelto = await Promise.all(consultaEntregas);

            arrayCorte.push({
                CO: refCorte,
                EN: resuelto
            });
        }
    }
    res.json({
        estatus: true,
        informe: arrayCorte
    });
}

/**
 * @name eidtarEntrega
 * @author IIB
 * @version 0.0.3
 * @description Edita los datos de una entrega
 * @param entregas Numero de entregas realizadas en el dia
 * @param horas Numero de horas realizadas en el dia
 * @param en Identificador de entregas
 * @param rol Identificador del rol
 * @returns { estatus: true, en: "..."} | 
 */
informeCtrl.editarEntrega = async (req, res) => {
    const entregas = req.body.entregas;
    const horas = req.body.horas;
    const enId = req.body.en;
    const rolId = req.body.rol;

    const promesasAresolver = [];
    const refEnP = await enModel.findOne({ '_id': enId });
    const rolRefP = await rolModel.findOne({ _id: rolId });
    const isrP = await isrModel.find().sort({ creacion: -1 });
    promesasAresolver.push(refEnP);
    promesasAresolver.push(rolRefP);
    promesasAresolver.push(isrP);

    const resuelto = await Promise.all(promesasAresolver);
    const refEn = resuelto[0];
    const rolRef = resuelto[1];
    const isr = resuelto[2];
    
    const isrReg = isr[0];

    const limite_hrs = rolRef.dias_semana * rolRef.jornada;
    const corte = refEn.CO;
    await recalcularCorte(corte, limite_hrs, rolRef, isrReg);
    await refEn.updateOne({
        horas: horas,
        entregas: entregas
    });
    res.json({
        estatus: true,
        informe: enId
    });
}

/**
 * @name eliminarEntrega
 * @author IIB
 * @version 0.0.3
 * @description Eliminar un registro de entrega
 * @param en Identificador de entregas
 * @param rol Identificador del rol
 * @returns { estatus: true, en: "..."} | 
 */
informeCtrl.eliminarEntrega = async (req, res) => {
    const enId = req.body.en;
    const rolId = req.body.rol;

    const refEn = await enModel.findOne({ '_id': enId });
    if (!refEn) {
        res.json({
            estatus: false,
            informe: "No existe la entrega indicada"
        });
        return;
    }

    const rolRef = await rolModel.findOne({ _id: rolId });
    if (!rolRef) {
        res.json({
            estatus: false,
            informe: "El rol del usuario no existe"
        });
        return;
    }

    const isr = await isrModel.find().sort({ creacion: -1 });
    const isrReg = isr[0];

    const limite_hrs = rolRef.dias_semana * rolRef.jornada;
    const corte = refEn.CO;

    const refCorte = await coModel.findOne({ '_id': corte });
    if (!rolRef) {
        res.json({
            estatus: false,
            informe: "El corte no existe"
        });
        return;
    }

    const enArray = refCorte.EN;
    const nuevoEn = [];
    for (let ref of enArray) {
        if (ref != enId) {
            nuevoEn.push(ref);
        }
    }

    await refCorte.updateOne({
        EN: nuevoEn
    });

    await recalcularCorte(corte, limite_hrs, rolRef, isrReg);
    res.json({
        estatus: true,
        informe: enId
    });
}

/**
 * @name recalcularCorte
 * @author IIB
 * @version 0.0.3
 * @description Vuelve a calcular el corte
 * @param corte identificador del corte a re-calcular 
 */
recalcularCorte = async (corte, limite_hrs, rolRef, isrReg) => {

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

    const cortes = await coModel.findOne({ '_id': corte });
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

module.exports = informeCtrl;