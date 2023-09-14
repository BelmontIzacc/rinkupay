/**
 * @autor Belmont
 * @date 07/03/2020
 */

/**
  * @description modelo para la instanciacion de los datos a consultar para el mostrado de las encuestas
  * 
*/

/**
 * declaracion de la clase como sus variables correspondientes
 */

export class DatosConsulta {
    Documento : string; // identificacion del documento a consultar
    clave_documento : string; //clave de la encuesta a contestar
    fecha_emision : Date; //fecha de emision para la realizacion de las encuestas
    emision : string; //numero de emision que tiene
    periodo : string; //periodo en el que nos encontramos
    _id?: string; //id dentro de la base de datos

}

