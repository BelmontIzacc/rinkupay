/**
 * @autor IIB
 * @date 12/09/2023
 */

/**
  * @description Model de la coleccion rol
  * 
*/

/** Dependencias o modulos requeridos */
const mongoose = require('mongoose');
const { Schema } = mongoose;

/** Declaración de variables para el modelo datos de consulta */
const rolShema = new Schema({
    'tipo': { type: String, required: true },
    'sueldo_base': { type: Number, required: true },
    'dias_semana': { type: Number, required: true },
    'jornada': { type: Number, required: true },
    'compensacion': { type: Array, required: true },
    'creacion': { type: Date },
    'actualizado': { type: Date }
});

module.exports = mongoose.model('rols', rolShema); // coleccion , esquema