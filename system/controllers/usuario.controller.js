/**
 * @name Controlador de empledo
 * @description Contiene la logica y funciones relacionadas al registro, editar, eliminar, buscar empleados.
 * @author IIB
 */

const usuarioCtrl = {};

const bcrypt = require('bcrypt-nodejs');
const usuarioModel = require("../models/us");
const rolModel = require("../models/rol");
const coModel = require("../models/co");

/**
 * @name registro
 * @author IIB
 * @version 0.0.0
 * @description Crea un regitro de usuario para la coleccion Usuario (US) y a su vez crea un registro en Corte
 * @param nombre Nombre completo del usuario.
 * @param no_empleado Numero de identificacion del usuario.
 * @param clave Contraseña para ingreso al sistema.
 * @param tipo_usuario Tipo de usuario, false para empleado, true para administrador.
 * @param fecha Fecha en la cual se reporta la entrega.
 * @param rol Identificador de la coleccion ROL para determinar a que tipo de rol pertenece el usuario.
 * @param isr Identificador de la coleccion ISR sobre la retencion sobre el salario que se realizara al empleado.
 * @returns { estatus: true, us: '...'} | 
 */
usuarioCtrl.registro = async (req, res) => {
    const nombre = req.body.nombre;
    const no_empleado = req.body.no_empleado;
    const clave = req.body.clave;
    const tipo_usuario = req.body.tipo_usuario;
    let rol = req.body.rol;
    let isr = req.body.isr;

    if (tipo_usuario == true) {
        rol = null;
        isr = null;
    }

    const us = new usuarioModel();
    us.nombre = nombre;
    us.no_empleado = no_empleado;
    us.clave = generHash(clave)
    us.tipo_usuario = tipo_usuario;
    us.ROL = rol;
    us.ISR = isr;
    us.creacion = new Date();
    us.actualizado = new Date();

    await us.save()
    const id = us._id;

    const nombre_mes = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
    const mes = new Date().getMonth();
    const year = new Date().getFullYear();

    const corte_md = new coModel();
    corte_md.US = id;
    corte_md.periodo = nombre_mes[mes] + " " + year;
    corte_md.entregas = null;
    corte_md.pago_bruto = null;
    corte_md.pago_neto = null;
    corte_md.hrs_total = null;
    corte_md.EN = [];
    corte_md.creacion = new Date();
    corte_md.actualizado = new Date();
    await corte_md.save();

    const idCorte = corte_md._id;

    await us.updateOne({
        CO: [""+idCorte]
    })


    res.json({
        estatus: true,
        us: id
    });
}

/**
 * @name login
 * @author IIB
 * @version 0.0.0
 * @description Busca el usuario indicado y crea el token de autenticacion en caso de existir
 * @param no_empleado Numero de identificacion del usuario.
 * @param clave Contraseña para ingreso al sistema.
 * @returns { estatus: true, us: '...', token: '....'} | 
 */
usuarioCtrl.login = async (req, res) => {
    const no_empleado = req.body.no_empleado
    const clave = req.body.clave

    const userFind = await usuarioModel.findOne({ 'no_empleado': no_empleado });
    if (!userFind) {
        res.json({
            estatus: false,
            mensaje: "No existe el numero de empleado"
        });
    } else {
        const passUser = userFind.clave === undefined ? null : userFind.clave;
        if (passUser != null && validarClave(clave, passUser)) {
            res.json({
                estatus: true,
                us: userFind
            });
        } else {
            res.json({
                estatus: false,
                mensaje: "Contraseña incorrecta"
            });
        }
    }
}

/**
 * @name registroRol
 * @author IIB
 * @version 0.0.0
 * @description Registra un rol para un empleado
 * @param Tipo Nombre del tipo de empleado.
 * @param sueldo Sueldo base por hora segun del tipo de empleado.
 * @param semana Numero de dias a la semana que labora el tipo de empleado.
 * @param jornada Numero de horas que trabaja el empleado por dia.
 * @param compensacion Array object que indica el tipo de compensacion que recive el empleado.
 * @returns { estatus: true, rol: '...'} | 
 */
usuarioCtrl.agregrRol = async (req, res) => {
    const tipo = req.body.tipo;
    const sueldo = req.body.sueldo;
    const semana = req.body.semana;
    const jornada = req.body.jornada;
    const compensacion = req.body.compensacion;

    const rol = new rolModel()
    rol.tipo = tipo;
    rol.sueldo_base = sueldo;
    rol.dias_semana = semana;
    rol.jornada = jornada;
    rol.compensacion = compensacion;
    rol.creacion = new Date();
    rol.actualizado = new Date();
    await rol.save()

    const id = rol._id;
    res.json({
        estatus: true,
        rol: id
    });
}

/**
 * @name validarClave
 * @author IIB
 * @version 0.0.0
 * @description Compara dos contraseñas, una encriptada y la otra sin encriptar para indicar si son iguales
 * @param passComparar Clave que indica el usuario sin encriptar.
 * @param PassUser Clave encriptada que se va a comparar con la clave sin encriptar.
 * @returns true | false
 */
validarClave = (passComparar, passUser) => {
    try {
        return bcrypt.compareSync(passComparar, passUser);
    } catch (error) {
        return false;
    }
}

/**
 * @name generarHash
 * @author IIB
 * @version 0.0.0
 * @description Encripta la clave indicada por un usuario
 * @param clave Clave que indica el usuario sin encriptar
 * @returns '...'
 */
generHash = (clave) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

module.exports = usuarioCtrl;