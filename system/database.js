/**
 * @description Configuracion para la conexion a base de datos
 * @author IIB
 * @version 1.0
 */

// import de modulo mongoose
const mongoose = require('mongoose');

// Uri de conexion a base de datos.
// establece el usuario: isaulbelmont y pass:rzTXgZIOI6J0YHQ4 
const URI = "mongodb+srv://isaulbelmont:rzTXgZIOI6J0YHQ4@cluster0.0se2k4z.mongodb.net/rinkupay"

// realiza la conexion segun la uri indicada
// si conecta, indica mensaje de  "Mongo conectado", caso contrario indica el error
mongoose.connect(URI)
    .then(db => console.log('Mongo conectado'))
    .catch(err => console.error(err));

// exporta el modulo para su uso
module.exports = mongoose;