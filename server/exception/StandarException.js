/**
 * @name standarException
 * @description Retorna una respuesta de error 400, con un mensaje y codigo
 * @author IIB
 */

const HttpException = require('./HttpException');

// Definición del error personalizado
class StandarException extends HttpException {
    constructor(mensaje, codigo, extra) {
      super(400, mensaje, codigo, extra);
    }
}

module.exports = StandarException;