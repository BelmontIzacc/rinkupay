/**
 * @autor IIB
 * @date 12/09/2023
 */

/**
  * @description Model de la coleccion en
  * 
*/

/** Dependencias o modulos requeridos */
const mongoose = require('mongoose');
const { Schema } = mongoose;

/** Declaración de variables para el modelo datos de consulta */
const ensShema = new Schema({
  'US': { type: String, required: true },
  'CO': { type: String, required: true },
  'entregas': { type: Number, required: true },
  'horas': { type: Number, required: true },
  'fecha': { type: Date },
  'creacion': { type: Date },
  'actualizado': { type: Date }
});

module.exports = mongoose.model('ens', ensShema); // coleccion , esquema