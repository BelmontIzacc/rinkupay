/**
 * @autor IIB
 * @date 12/09/2023
 */

/**
  * @description Model de la coleccion usuario
  * 
*/

/** Dependencias o modulos requeridos */
const mongoose = require('mongoose');
const { Schema } = mongoose;

/** Declaración de variables para el modelo datos de consulta */
const userShema = new Schema({
  'nombre': { type: String, required: true },
  'no_empleado': { type: String, required: true },
  'clave': { type: String, required: true },
  'tipo_usuario': { type: Boolean, required: true },
  'ROL': { type: String },
  'ISR': { type: String },
  'CO': { type: Array },
  'creacion': { type: Date },
  'actualizado': { type: Date }
});

module.exports = mongoose.model('us', userShema); // coleccion , esquema