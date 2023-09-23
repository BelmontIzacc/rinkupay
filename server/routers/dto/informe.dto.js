/**
 * @name middleware Data Transfer Objects
 * @description Valida que dentro del body de las peticiones post y put, tengan los campos requeridos.
 * @author IIB
 */

const express = require('express');
const app = express();

const informe_dto = {};

informe_dto.editarEntrega = (req, res, next) => {
    // Define los campos requeridos en un arreglo
    const camposRequeridos = ['entregas', 'horas', 'en', 'rol'];

    // Verifica que los campos requeridos estén presentes
    if (!camposRequeridos.every(campo => campo in req.body)) {
        return res.status(400).json({ estatus: false, informe: 'Faltan campos requeridos' });
    }

    // Si todo está bien, pasa al siguiente middleware o ruta
    next();
}

informe_dto.eliminarEntrega = (req, res, next) => {
    // Define los campos requeridos en un arreglo
    const camposRequeridos = ['en', 'rol'];

    // Verifica que los campos requeridos estén presentes
    if (!camposRequeridos.every(campo => campo in req.body)) {
        return res.status(400).json({ estatus: false, informe: 'Faltan campos requeridos' });
    }

    // Si todo está bien, pasa al siguiente middleware o ruta
    next();
}

module.exports = informe_dto;