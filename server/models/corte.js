/**
 * @autor IIB
 * @date 12/09/2023
 */

/**
  * @description Model de la coleccion co
  * 
*/

/** Dependencias o modulos requeridos */
const mongoose = require('mongoose');
const { Schema } = mongoose;

/** Declaración de variables para el modelo datos de consulta */
const coShema = new Schema({
    'US': { type: String, required: true },
    'periodo': { type: String, required: true },
    'entregas': { type: Number },
    'pago_bruto': { type: Number },
    'pago_neto': { type: Number },
    'hrs_total': { type: Number },
    'corte': { type: Date },
    'EN': { type: Array },
    'creacion': { type: Date },
    'actualizado': { type: Date }
});

module.exports = mongoose.model('cos', coShema); // coleccion , esquema