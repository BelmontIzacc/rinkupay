/**
 * @name Controlador para iniciar base de datos
 * @description Contiene la logica y funciones relacionadas a la creacion y poblado de base de datos.
 * @author IIB
 */

const initCtrl = {};

const bcrypt = require('bcrypt-nodejs');
const usuarioModel = require("../models/usuario");
const rolModel = require("../models/rol");
const coModel = require("../models/corte");
const enModel = require("../models/entrega");
const isrModel = require("../models/isr")

const noCortexUsuario = 3;
const diaCorte = 24;
const noEntregasPorCorte = 15;
const noUsuarios = 26;

initCtrl.iniciarDB = async (req, res) => {

    let i = 0;
    while (i < noUsuarios) {
        // generar usuario
        const numero_clave = generarNumeroEmpleado();
        const rol = indicarRol();
        const us = new usuarioModel();
        us.nombre = nombreCompletoAleatorio();
        us.no_empleado = numero_clave;
        us.clave = generHash(numero_clave)
        us.tipo_usuario = false;
        us.ROL = rol;
        us.ISR = '650144dcde1b4e0d39080345';
        us.creacion = new Date();
        us.actualizado = new Date();
        await us.save()

        // generar corte y entregas
        const idsCorte = await generarCorte(us._id, rol);
        await us.updateOne({
            CO: idsCorte
        });
        i += 1;
    }
    res.json({
        estatus: true
    })
}

// Listas de nombres y apellidos aleatorios
const nombres = ["Juan", "María", "Carlos", "Luisa", "Ana", "Pedro", "Laura", "Miguel", "Sofía", "David"];
const apellidos = ["Gómez", "Rodríguez", "Pérez", "Fernández", "López", "González", "Martínez", "Díaz", "Hernández", "Torres"];

// Función para obtener un nombre completo aleatorio
nombreCompletoAleatorio = () => {
    const nombre = nombres[Math.floor(Math.random() * nombres.length)];
    const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
    return `${nombre} ${apellido}`;
}

// Funcion para crear numero de empleado
generarNumeroEmpleado = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let numeroEmpleado = '';
    for (let i = 0; i < 5; i++) {
        const caracterAleatorio = caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        numeroEmpleado += caracterAleatorio;
    }
    return numeroEmpleado;
}

// indicar un rol aleatorio 
indicarRol = () => {
    const roles = ['650143c79869c7dfe4c3740c', '650143ec9869c7dfe4c3740e', '650143fa9869c7dfe4c37410']
    const numero = Math.floor(Math.random() * 3); // 0, 1, 2
    return roles[numero]
}

// Funcion para encriptar contraseña
generHash = (clave) => {
    return bcrypt.hashSync(clave, bcrypt.genSaltSync(8), null);
}

// generar corte
generarCorte = async (usuario, rol) => {
    const rolRef = await rolModel.findOne({ _id: rol });
    const sueldo_base = rolRef.sueldo_base;
    const compensacion = rolRef.compensacion;
    const valoresCompensacion = [1, 1, 1];

    for (let comp of compensacion) {
        const tipo = comp.tipo - 1;
        valoresCompensacion[tipo] = comp.monto;
    }

    const tasa_base = 0.09;
    const limite = 10000;
    const tasa_ad = 0.03;


    let i = 0;
    const nombre_mes = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const idsCorte = [];
    while (i < noCortexUsuario) {
        const mes = Math.floor(Math.random() * 8); // 0 : 7

        const corte_md = new coModel();
        corte_md.US = usuario;
        corte_md.periodo = nombre_mes[mes] + " 2023";
        corte_md.entregas = null;
        corte_md.pago_bruto = null;
        corte_md.pago_neto = null;
        corte_md.hrs_total = null;
        corte_md.EN = [];
        corte_md.corte = new Date(2023, mes + 1, diaCorte);
        corte_md.creacion = new Date();
        corte_md.actualizado = new Date();
        await corte_md.save();
        idsCorte.push("" + corte_md._id);

        const idsEntregas = await generarEntrega(usuario, corte_md._id);

        const total_hrs = idsEntregas.hrs;
        const total_entregas = idsEntregas.entre;

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

        await corte_md.updateOne({
            EN: idsEntregas.ids,
            entregas: idsEntregas.entre,
            hrs_total: idsEntregas.hrs,
            pago_bruto: totalBruto,
            pago_neto: pago_neto,
            despensa: despensa,
            detalles: detalles
        });
        i += 1;
    }
    return idsCorte;
}


// generar entregas a un corte
generarEntrega = async (usuario, corte) => {
    const idsEntregas = [];
    let i = 1;
    let total_entrega = 0
    let total_hrs = 0
    while (i <= noEntregasPorCorte) {
        // regitrar entrega
        const entre = Math.floor(Math.random() * 51);
        total_entrega += entre;
        const hrs = Math.floor(Math.random() * 9);
        total_hrs += hrs;
        const en = new enModel();
        en.US = usuario;
        en.CO = corte;
        en.entregas = entre;
        en.horas = hrs;
        en.fecha = new Date();
        en.creacion = new Date();
        en.actualizado = new Date();
        await en.save();
        idsEntregas.push("" + en._id);
        i += 1;
    }
    return {
        ids: idsEntregas,
        entre: total_entrega,
        hrs: total_hrs
    };
}
module.exports = initCtrl;