/**
 * @autor IIB
 * @date 14/09/2023
 */

/**
  * @description modelo de la coleccion ROL
  * 
*/

/**
 * declaracion de la clase como sus variables correspondientes
 */

export class ROL {
  _id: string;
  tipo: string;
  sueldo_base: number;
  dias_semana: number;
  jornada: number;
  compensacion: Array<{
    tipo: number,
    monto: number
  }>;
  creacion: Date;
  actualizado: Date;
}