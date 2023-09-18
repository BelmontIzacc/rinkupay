/**
 * @description Configuracion para la conexion a base de datos
 * @author IIB
 * @version 0.0.0
 */

// import de modulo mongoose
const mongoose = require('mongoose');

// Uri de conexion a base de datos.
// establece el usuario: isaulbelmont y pass:rzTXgZIOI6J0YHQ4 | EY3h431otPWwbF9R

// const URI = "mongodb+srv://isaulbelmont:EY3h431otPWwbF9R@cluster0.0se2k4z.mongodb.net/rinkupay" // dev
const URI = "mongodb+srv://isaulbelmont:EY3h431otPWwbF9R@cluster0.0se2k4z.mongodb.net/rinkupay_prod" // prod

// realiza la conexion segun la uri indicada
// si conecta, indica mensaje de  "Mongo conectado", caso contrario indica el error
mongoose.connect(URI)
    .then(db => console.log('Mongo conectado'))
    .catch(err => console.error(err));

// exporta el modulo para su uso
module.exports = mongoose;