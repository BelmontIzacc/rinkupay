/**
 * @name middleware Data Transfer Objects
 * @description Valida que dentro del body de las peticiones post y put, tengan los campos requeridos.
 * @author IIB
 */

const express = require('express');
const app = express();

const nomina_dto = {};

nomina_dto.registrar_isr = (req, res, next) => {
    // Define los campos requeridos en un arreglo
    const camposRequeridos = ['base', 'limite', 'adicional', 'dia_corte'];

    // Verifica que los campos requeridos estén presentes
    if (!camposRequeridos.every(campo => campo in req.body)) {
        return res.status(400).json({ estatus: false, mensaje: 'Faltan campos requeridos' });
    }

    // Si todo está bien, pasa al siguiente middleware o ruta
    next();
}

nomina_dto.registrar_en = (req, res, next) => {
    // Define los campos requeridos en un arreglo
    const camposRequeridos = ['us', 'entregas', 'horas', 'fecha', 'co'];

    // Verifica que los campos requeridos estén presentes
    if (!camposRequeridos.every(campo => campo in req.body)) {
        return res.status(400).json({ estatus: false, mensaje: 'Faltan campos requeridos' });
    }

    // Si todo está bien, pasa al siguiente middleware o ruta
    next();
}

module.exports = nomina_dto;