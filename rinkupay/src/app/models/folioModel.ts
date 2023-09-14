/**
 * @autor Belmont
 * @date 07/03/2020
 */

/**
  * @description modelo para la instanciacion de información del folio registrado en el sistema
  * 
*/

/**
 * declaracion de la clase como sus variables correspondientes
 */

export class Folio {
    _id : string; // id del folio dentro de la base de datos
    departamento : string; // departamento en el cuan se contabilizan los folios
    tramite : string; // tramite a realizar dentro del sistema segun el departamento
    folio : number; //conteo de folios hasta el momento
    identificacion: string; //identificacion para su busqueda y edicion por si el id es diferente
    conteoInsatisfactorio: number; //cuenta el total de respuestas seleccionadas como Insatisfactorio para el tramite en espesifico
    conteoMalo: number; //cuenta el total de respuestas seleccionadas como Maloo para el tramite en espesifico
    conteoRegular: number; //cuenta el total de respuestas seleccionadas como Regular para el tramite en espesifico
    conteoBueno: number; //cuenta el total de respuestas seleccionadas como Bueno para el tramite en espesifico
    conteoSatisfactorio: number; //cuenta el total de respuestas seleccionadas como Satisfatorio para el tramite en espesifico
    comentarios: {}; // arreglo de comentarios de las encuestas contestadas
}