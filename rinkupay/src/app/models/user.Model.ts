/**
 * @autor Belmont
 * @date 13/09/2023
 */

/**
  * @description modelo para la instanciacion de información del usuario registrado en el sistema
  * 
*/

/**
 * declaracion de la clase como sus variables correspondientes
 */
export class User {
	constructor(_id: string, no_empleado: string,
		clave: string, tipo_usuario: boolean, ROL: string,
		ISR: string, CO: Array<string>, creacion: Date, actualizado: Date, nombre: string) {
		this._id = _id;
		this.no_empleado = no_empleado;
		this.tipo_usuario = tipo_usuario;
		this.ROL = ROL;
		this.clave = clave;
		this.ISR = ISR;
		this.CO = CO;
		this.creacion = creacion;
		this.actualizado = actualizado;
		this.nombre = nombre;
	}

	_id: string; //id de la db
	nombre: string; // nombre del usuaario
	no_empleado: string; // numero de empleado
	clave: string; // password encriptado
	tipo_usuario: boolean; // true -> admin, false -> empleado
	ROL: string; // rol que pertenece el empleado
	ISR: string; // identificador del isr que fecta al usuario
	CO: Array<string>; // identificadores de los cortes realizados al empleado
	creacion: Date; // fecha de creacion de registro
	actualizado: Date; // fecha de actualizacion de registro
}