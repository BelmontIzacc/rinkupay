/**
 * @name Controlador de empledo
 * @description Contiene la logica y funciones relacionadas al registro, editar, eliminar, buscar empleados.
 * @author IIB
 */

const usuarioCtrl = {};

const bcrypt = require('bcrypt-nodejs');
const usuarioModel = require("../models/usuario");
const rolModel = require("../models/rol");
const coModel = require("../models/corte");
const enModel = require("../models/entrega");
const isrModel = require("../models/isr")

const jwt = require('jsonwebtoken');

const tk = "zcz0au22eiz3s23l4oie2V222";

/**
 * @name registro
 * @author IIB
 * @version 0.0.1
 * @description Crea un regitro de usuario para la coleccion Usuario (US) y a su vez crea un registro en Corte
 * @param nombre Nombre completo del usuario.
 * @param no_empleado Numero de identificacion del usuario.
 * @param clave Contraseña para ingreso al sistema.
 * @param tipo_usuario Tipo de usuario, false para empleado, true para administrador.
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

    const userFind = await usuarioModel.findOne({ 'no_empleado': no_empleado });
    if (userFind) {
        res.json({
            estatus: false,
            us: "Ya existe el numero de empleado registrado"
        });
        return;
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

    if (tipo_usuario != true) {
        const nombre_mes = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"]
        const mes = new Date().getMonth();
        const year = new Date().getFullYear();

        const corte_md = new coModel();
        corte_md.US = id;
        corte_md.periodo = nombre_mes[mes] + " " + year;
        corte_md.entregas = 0;
        corte_md.pago_bruto = 0;
        corte_md.despensa = 0;
        corte_md.pago_neto = 0;
        corte_md.hrs_total = 0;
        corte_md.detalles = {
            pago_entregas: 0,
            pago_bonos: 0,
            retenciones: 0
        };
        corte_md.entregas = 0;
        corte_md.EN = [];

        const isr = await isrModel.find().sort({ creacion: -1 });
        const isrReg = isr[0];
        const diaCorteIsr = isrReg.dia_corte; // dia de corte indicado por el ISR
        const fechaBase = new Date();
        if (fechaBase.getDate() <= diaCorteIsr) {
            corte_md.corte = new Date(fechaBase.getFullYear(), fechaBase.getMonth(), diaCorteIsr);
        } else {
            corte_md.corte = new Date(fechaBase.getFullYear(), fechaBase.getMonth() + 1, diaCorteIsr);
        }

        corte_md.creacion = new Date();
        corte_md.actualizado = fechaBase;
        await corte_md.save();

        const idCorte = corte_md._id;

        await us.updateOne({
            CO: ["" + idCorte]
        })
    }

    res.json({
        estatus: true,
        us: id
    });
}

/**
 * @name actualizarUser
 * @author IIB
 * @version 0.0.2
 * @description Actualiza la informacion basica del usuario
 * @param nombre Nombre completo del usuario.
 * @param no_empleado Numero de identificacion del usuario.
 * @param rol Identificador de la coleccion ROL para determinar a que tipo de rol pertenece el usuario.
 * @returns { estatus: true, us: '...'} | 
 */
usuarioCtrl.actualizarUser = async (req, res) => {
    const id = req.body.id;
    const nombre = req.body.nombre;
    const no_empleado = req.body.no_empleado;
    const rol = req.body.rol;

    const userFind = await usuarioModel.findOne({ '_id': id });
    if (!userFind) {
        res.json({
            estatus: false,
            us: "No existe el usuario indicado"
        });
        return;
    }
    if (userFind.no_empleado !== no_empleado) {
        const buscarOtroUsuario = await usuarioModel.findOne({ 'no_empleado': no_empleado });
        if (buscarOtroUsuario) {
            res.json({
                estatus: false,
                us: "Ya existe el numero de empleado registrado"
            });
            return;
        }
    }

    await userFind.updateOne({
        nombre: nombre,
        no_empleado: no_empleado,
        ROL: rol
    });
    res.json({
        estatus: true,
        us: id
    });
}


/**
 * @name login
 * @author IIB
 * @version 0.0.1
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
        const igual = validarClave(clave, passUser);
        if (passUser != null && igual == true) {
            const isAdmin = userFind.tipo_usuario;
            if (isAdmin) {
                const US = {
                    no_empleado: no_empleado,
                    id: userFind._id
                }
                const token = jwt.sign(US, tk, { expiresIn: '2h' });
                res.json({
                    estatus: true,
                    us: userFind._id,
                    token: token
                });
            } else {
                res.json({
                    estatus: false,
                    mensaje: "Sin permisos"
                });
            }
        } else {
            res.json({
                estatus: false,
                mensaje: "Contraseña incorrecta"
            });
        }
    }
}

/**
 * @name obtenerEmpleados
 * @author IIB
 * @version 0.0.2
 * @description Regresa todos los empleados registrados
 * @returns { estatus: true, empleados: [{'...'}]} | 
 */
usuarioCtrl.obtenerEmpleados = async (req, res) => {
    const empleados = await usuarioModel.find({ tipo_usuario: false });

    res.json({
        estatus: true,
        empleados: empleados
    })
}

/**
 * @name login
 * @author IIB
 * @version 0.0.2
 * @description Busca el usuario indicado y crea el token de autenticacion en caso de existir
 * @param no_empleado Numero de identificacion del usuario.
 * @param clave Contraseña para ingreso al sistema.
 * @returns { estatus: true, us: '...', token: '....'} | 
 */
usuarioCtrl.buscarUsuario = async (req, res) => {
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
        const igual = validarClave(clave, passUser);
        if (passUser != null && igual) {
            const isAdmin = userFind.tipo_usuario;
            if (!isAdmin) {
                res.json({
                    estatus: true,
                    us: userFind
                });
            } else {
                res.json({
                    estatus: false,
                    us: "Usuario no valido"
                });
            }
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
 * @version 0.0.1
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
 * @name retornarROL
 * @author IIB
 * @version 0.0.2
 * @description Recupera todos los registros de ROL
 * @returns { estatus: true, rols: [{'...'}] 
 */
usuarioCtrl.obtenerROL = async (req, res) => {
    const rols = await rolModel.find();

    res.json({
        estatus: true,
        rols: rols
    })
}

/**
 * @name eliminarUser
 * @author IIB
 * @version 0.0.2
 * @description Elimina todos los registros de usuarios pertenecientes a un id
 * @returns { estatus: true, rols: [{'...'}] 
 */
usuarioCtrl.eliminarUsuario = async (req, res) => {
    const no_empleado = req.params.empleado;

    const userFind = await usuarioModel.findOne({ 'no_empleado': no_empleado });
    if (!userFind) {
        res.json({
            estatus: false,
            us: "No existe el usuario indicado"
        });
        return;
    }

    const userId = userFind._id;
    await coModel.deleteMany({ 'US': userId });
    await enModel.deleteMany({ 'US': userId });
    await usuarioModel.deleteMany({ 'no_empleado': no_empleado });

    res.json({
        estatus: true,
        us: userId
    })
}

/**
 * @name validarClave
 * @author IIB
 * @version 0.0.1
 * @description Compara dos contraseñas, una encriptada y la otra sin encriptar para indicar si son iguales
 * @param passComparar Clave que indica el usuario sin encriptar.
 * @param PassUser Clave encriptada que se va a comparar con la clave sin encriptar.
 * @returns true | false
 */
validarClave = (passComparar, passUser) => {
    try {
        const igual = bcrypt.compareSync(passComparar, passUser);
        return igual;
    } catch (error) {
        return false;
    }
}

/**
 * @name generarHash
 * @author IIB
 * @version 0.0.1
 * @description Encripta la clave indicada por un usuario
 * @param clave Clave que indica el usuario sin encriptar
 * @returns '...'
 */
generHash = (clave) => {
    return bcrypt.hashSync(clave, bcrypt.genSaltSync(8), null);
}

module.exports = usuarioCtrl;