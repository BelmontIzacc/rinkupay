/**
 * @name middleware Data Transfer Objects
 * @description Valida que dentro del body de las peticiones post y put, tengan los campos requeridos.
 * @author IIB
 */

const express = require('express');
const app = express();

const user_dto = {};

user_dto.registroDto = (req, res, next) => {
    // Define los campos requeridos en un arreglo
    const camposRequeridos = ['nombre', 'no_empleado', 'clave', 'tipo_usuario'];

    // Verifica que los campos requeridos estén presentes
    if (!camposRequeridos.every(campo => campo in req.body)) {
        return res.status(400).json({ estatus: false, us: 'Faltan campos requeridos para el usuario' });
    }

    const tipo_usuario = req.body.tipo_usuario;
    if (tipo_usuario == false) {
        const camposRequeridosEmpleado = ['rol', 'isr'];
        if (!camposRequeridosEmpleado.every(campo => campo in req.body)) {
            return res.status(400).json({ estatus: false, us: 'Faltan campos requeridos para el empleado' });
        }
    }

    // Si todo está bien, pasa al siguiente middleware o ruta
    next();
}

user_dto.buscarDto = (req, res, next) => {
    // Define los campos requeridos en un arreglo
    const camposRequeridos = ['no_empleado', 'clave'];

    // Verifica que los campos requeridos estén presentes
    if (!camposRequeridos.every(campo => campo in req.body)) {
        return res.status(400).json({ estatus: false, mensaje: 'Faltan campos requeridos' });
    }

    // Si todo está bien, pasa al siguiente middleware o ruta
    next();
}


user_dto.actualizarUserDto = (req, res, next) => {
    // Define los campos requeridos en un arreglo
    const camposRequeridos = ['no_empleado', 'nombre', 'id', 'rol'];

    // Verifica que los campos requeridos estén presentes
    if (!camposRequeridos.every(campo => campo in req.body)) {
        return res.status(400).json({ estatus: false, us: 'Faltan campos requeridos' });
    }

    // Si todo está bien, pasa al siguiente middleware o ruta
    next();
}

user_dto.agregarRolDto = (req, res, next) => {
    // Define los campos requeridos en un arreglo
    const camposRequeridos = ['tipo', 'sueldo', 'semana', 'jornada', 'compensacion'];

    // Verifica que los campos requeridos estén presentes
    if (!camposRequeridos.every(campo => campo in req.body)) {
        return res.status(400).json({ estatus: false, rol: 'Faltan campos requeridos' });
    }

    // Si todo está bien, pasa al siguiente middleware o ruta
    next();
}

module.exports = user_dto;