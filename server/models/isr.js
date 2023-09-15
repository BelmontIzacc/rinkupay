/**
 * @autor IIB
 * @date 12/09/2023
 */

/**
  * @description Model de la coleccion isr
  * 
*/

/** Dependencias o modulos requeridos */
const mongoose = require('mongoose');
const { Schema } = mongoose;

/** Declaración de variables para el modelo datos de consulta */
const isrShema = new Schema({
    'tasa_base': { type: Number, required: true },
    'limite': { type: Number, required: true },
    'tasa_ad': { type: Number, required: true },
    'dia_corte': { type: Number, required: true },
    'creacion': { type: Date },
    'actualizado': { type: Date }
});

module.exports = mongoose.model('isr', isrShema); // coleccion , esquema