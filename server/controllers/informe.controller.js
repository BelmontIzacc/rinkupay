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

// import de exceptions
const StandarException = require('../exception/StandarException');
const codigos = require('../exception/codigos');

/**
 * @name obtenerReporte
 * @author IIB
 * @version 0.0.3
 * @description recupera los cortes de un usuario y sus respectivas entregas
 * @param us identificador de usuario.
 * @returns informe: [{...}] | StandarException
 */
informeCtrl.obtenerReporte = async (id) => {
    const userFind = await usuarioModel.findOne({ '_id': id });
    if (!userFind) {
        return new StandarException('No existe el usuario indicado', codigos.noEncontradoUsuario);
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
    return arrayCorte;
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
 * @returns informe: "..." | StandarException
 */
informeCtrl.editarEntrega = async (entregas, horas, enId, rolId) => {
    const promesasAresolver = [];
    const refEnP = enModel.findOne({ '_id': enId });
    const rolRefP = rolModel.findOne({ _id: rolId });
    const isrP = isrModel.find().sort({ creacion: -1 });
    promesasAresolver.push(refEnP);
    promesasAresolver.push(rolRefP);
    promesasAresolver.push(isrP);

    const resuelto = await Promise.all(promesasAresolver);
    const refEn = resuelto[0];
    const rolRef = resuelto[1];
    const isr = resuelto[2];

    if (!refEn) {
        return new StandarException('No existe la entrega indicada', codigos.datoNoEncontrado);
    }

    if (!rolRef) {
        return new StandarException('No existe el rol indicado', codigos.datoNoEncontrado);
    }
    if (!isr) {
        return new StandarException('No existe el isr indicado', codigos.datoNoEncontrado);
    }
    const isrReg = isr[0];

    const limite_hrs = rolRef.dias_semana * rolRef.jornada;
    const corte = refEn.CO;
    await recalcularCorte(corte, limite_hrs, rolRef, isrReg);
    await refEn.updateOne({
        horas: horas,
        entregas: entregas
    });
    return enId;
}

/**
 * @name eliminarEntrega
 * @author IIB
 * @version 0.0.3
 * @description Eliminar un registro de entrega
 * @param en Identificador de entregas
 * @param rol Identificador del rol
 * @returns "..." | StandarException
 */
informeCtrl.eliminarEntrega = async (enId, rolId) => {
    const refEn = await enModel.findOne({ '_id': enId });
    if (!refEn) {
        return new StandarException('No existe la entrega indicada', codigos.datoNoEncontrado);
    }

    const rolRef = await rolModel.findOne({ _id: rolId });
    if (!rolRef) {
        return new StandarException('El rol del usuario no existe', codigos.datoNoEncontrado);
    }

    const isr = await isrModel.find().sort({ creacion: -1 });
    if(isr.length == 0){
        return new StandarException('No existen ISR', codigos.datosNoEncontrados);
    }
    const isrReg = isr[0];

    const limite_hrs = rolRef.dias_semana * rolRef.jornada;
    const corte = refEn.CO;

    const refCorte = await coModel.findOne({ '_id': corte });
    if (!rolRef) {
        return new StandarException('El corte no existe', codigos.datoNoEncontrado);
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
    return enId;
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