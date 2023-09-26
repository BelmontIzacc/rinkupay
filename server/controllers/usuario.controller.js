/**
 * @name Controlador de empledo
 * @description Contiene la logica y funciones relacionadas al registro, editar, eliminar, buscar empleados.
 * @author IIB
 */

const usuarioCtrl = {};

// modulos
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');

// import de models
const usuarioModel = require("../models/usuario");
const rolModel = require("../models/rol");
const coModel = require("../models/corte");
const enModel = require("../models/entrega");
const isrModel = require("../models/isr")

// import de exceptions
const StandarException = require('../exception/StandarException');
const codigos = require('../exception/codigos');

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
 * @returns '...' | StandarException
 */
usuarioCtrl.registro = async (nombre, no_empleado, clave, tipo_usuario, rol, isr) => {
    const userFind = await usuarioModel.findOne({ 'no_empleado': no_empleado });
    if (userFind) {
        return new StandarException('Ya existe el numero de empleado registrado', codigos.validacionIncorrecta);
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

    return id;
}

/**
 * @name actualizarUser
 * @author IIB
 * @version 0.0.2
 * @description Actualiza la informacion basica del usuario
 * @param nombre Nombre completo del usuario.
 * @param no_empleado Numero de identificacion del usuario.
 * @param rol Identificador de la coleccion ROL para determinar a que tipo de rol pertenece el usuario.
 * @returns '...' | StandarException
 */
usuarioCtrl.actualizarUser = async (id, nombre, no_empleado, rol) => {
    const userFind = await usuarioModel.findOne({ '_id': id });
    if (!userFind) {
        return new StandarException('No existe el usuario indicado', codigos.noEncontradoUsuario);
    }
    if (userFind.no_empleado !== no_empleado) {
        const buscarOtroUsuario = await usuarioModel.findOne({ 'no_empleado': no_empleado });
        if (buscarOtroUsuario) {
            return new StandarException('Ya existe el numero de empleado registrado', codigos.validacionIncorrecta);
        }
    }

    await userFind.updateOne({
        nombre: nombre,
        no_empleado: no_empleado,
        ROL: rol
    });
    return id;
}


/**
 * @name login
 * @author IIB
 * @version 0.0.1
 * @description Busca el usuario indicado y crea el token de autenticacion en caso de existir
 * @param no_empleado Numero de identificacion del usuario.
 * @param clave Contraseña para ingreso al sistema.
 * @returns { us: '...', token: '...'} | StandarException
 */
usuarioCtrl.login = async (no_empleado, clave) => {
    const userFind = await usuarioModel.findOne({ 'no_empleado': no_empleado });
    if (!userFind) {
        return new StandarException('No existe el usuario con el numero de empleado', codigos.noEncontradoUsuario);
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
                return {
                    us: userFind._id,
                    token: token
                }
            } else {
                return new StandarException('Sin permisos', codigos.sinPermisos);
            }
        } else {
            return new StandarException('Constraseña incorrecta', codigos.validacionIncorrecta);
        }
    }
}

/**
 * @name obtenerEmpleados
 * @author IIB
 * @version 0.0.2
 * @description Regresa todos los empleados registrados
 * @returns [{'...'}]} | StandarException
 */
usuarioCtrl.obtenerEmpleados = async () => {
    const empleados = await usuarioModel.find({ tipo_usuario: false });
    if (empleados.length == 0) {
        return new StandarException('No existen empleados', codigos.datosNoEncontrados);
    }
    return empleados;
}

/**
 * @name login
 * @author IIB
 * @version 0.0.2
 * @description Busca el usuario indicado y crea el token de autenticacion en caso de existir
 * @param no_empleado Numero de identificacion del usuario.
 * @param clave Contraseña para ingreso al sistema.
 * @returns user | StandarException
 */
usuarioCtrl.buscarUsuario = async (no_empleado, clave) => {
    const userFind = await usuarioModel.findOne({ 'no_empleado': no_empleado });
    if (!userFind) {
        return new StandarException('No existe el numero de empleado', codigos.noEncontradoUsuario);
    } else {
        const passUser = userFind.clave === undefined ? null : userFind.clave;
        const igual = validarClave(clave, passUser);
        if (passUser != null && igual) {
            const isAdmin = userFind.tipo_usuario;
            if (!isAdmin) {
                return userFind;
            } else {
                return new StandarException('Usuario no valido', codigos.sinPermisos);
            }
        } else {
            return new StandarException('Contraseña incorrecta', codigos.validacionIncorrecta);
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
 * @returns '...' | StandarException
 */
usuarioCtrl.agregrRol = async (tipo, sueldo, semana, jornada, compensacion) => {
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
    return id;
}

/**
 * @name retornarROL
 * @author IIB
 * @version 0.0.2
 * @description Recupera todos los registros de ROL
 * @returns  [{'...'}] | StandarException
 */
usuarioCtrl.obtenerROL = async () => {
    const rols = await rolModel.find();
    if (rols.length == 0) {
        return new StandarException('No existen registros de rol', codigos.datosNoEncontrados);
    }

    return rols;
}

/**
 * @name eliminarUser
 * @author IIB
 * @version 0.0.2
 * @description Elimina todos los registros de usuarios pertenecientes a un id
 * @param no_empleado numero de empleado a eliminar
 * @returns '...' | StandarException
 */
usuarioCtrl.eliminarUsuario = async (no_empleado) => {
    const userFind = await usuarioModel.findOne({ 'no_empleado': no_empleado });
    if (!userFind) {
        return new StandarException('No existe el usuario indicado', codigos.noEncontradoUsuario);
    }

    const userId = userFind._id;
    await coModel.deleteMany({ 'US': userId });
    await enModel.deleteMany({ 'US': userId });
    await usuarioModel.deleteMany({ 'no_empleado': no_empleado });

    return userId;
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