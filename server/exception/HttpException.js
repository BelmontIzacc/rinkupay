/**
 * https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 */
class HttpException extends Error {
    estatus;
    mensaje;
    codigo;
    extra;

    constructor(estatus, mensaje, codigo, extra) {
        super(mensaje);
        this.estatus = estatus;
        this.mensaje = mensaje;
        this.codigo = codigo;
        this.extra = null;
        if (extra !== undefined && extra !== null) {
            this.extra = extra
        }
    }
}

module.exports = HttpException;