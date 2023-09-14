/**
 * @autor IIB
 * @date 13/09/2023
 */

/**
  * @description clase que funcionara como puente para realizar
  * peticiones al servidor por medio de HTTP para el usuario
  * 
*/

/** Importes requeridos para el funcionamiento de las clases y el servicio */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { isNullOrUndefined } from 'util';
import { User } from '../models/userModel';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  /** Declaración de url de direccion de peticiones de usuario al servidor  */
  readonly URL_API = 'http://localhost:3000/rinkupayapi/usuario';

  /** constructor del sistema inicializando el objeto para peticiones http */
  constructor(
    private http: HttpClient
  ) { }

  /**
   * @param User Objeto que contiene el no_empleado y la clave para buscar un usuario dentro del sistema 
   * @returns { estatus: boolean, us: {...}} | { estatus: boolean, mensaje: "..."} 
   */
  public buscarUsuario(User: { no_empleado: string, clave: string }): Observable<{ estatus: boolean, us: {} | string }> {
    let res = new Subject<{ estatus: boolean, us: {} | string }>();
    this.http.post(this.URL_API + '/buscar', User).subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, us: respuesta.us })
      } else {
        res.next({ estatus: false, us: respuesta.mensaje });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
  }

  /**
   * @param no_empleado numero de empleado
   * @param clave clave para inicio de sesion
   * @returns { estatus: boolean, us: "...", token: "..."} | { estatus: boolean, mensaje: "..."} 
   */
  public logeoUsuario(no_empleado: string, clave: string): Observable<{ estatus: boolean, us: string, token: string }> {
    let res = new Subject<{ estatus: boolean, us: string, token: string }>();
    this.http.post(this.URL_API + '/login', { no_empleado: no_empleado, clave: clave }).subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, us: respuesta.us, token: respuesta.token })
      } else {
        res.next({ estatus: false, us: respuesta.mensaje, token: null });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
  }

  /**
   * @description Recupera todos los empleados registrados
   * @returns { estatus: boolean, empleados: [{"..."}]} | { estatus: boolean, mensaje: "..."} 
   */
  public obtenerEmpleados(): Observable<{ estatus: boolean, empleados: Array<User> }> {
    let res = new Subject<{ estatus: boolean, empleados: Array<User> }>();
    this.http.get(this.URL_API + '/empleados').subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, empleados: respuesta.empleados });
      } else {
        res.next({ estatus: false, empleados: respuesta.mensaje });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
  }

  /** obtiene a todos los usuarios registrados dentro del sistema*/
  getAllUser() {
    return this.http.get(this.URL_API + '/GET');
  }

  /** registra a un usuario dentro del sistema*/
  createUser(User: User) {
    return this.http.post(this.URL_API + '/POST', User);
  }

  /** elimina un usuario registrado dentro del sistema*/
  eliminarUsuario(_id: String) {
    return this.http.delete(this.URL_API + '/DELETE/' + _id);
  }

  /**
   * @description coloca la informacion del usuario dentro de currentUser en el navegador
   * @param user, contiene los datos del usuario (token de acceso) y us (identificador de usuario) 
   * @returns '...' 
   */
  public setUser(user: { token: string, US: string }) {
    let user_string = JSON.stringify(user);
    localStorage.setItem("currentUser", user_string);
  }

  /** obtiene la información del usuario registrada en el navegador en currentUser*/
  public getCurrentUser(): User {
    let user_string = localStorage.getItem("currentUser");
    if (!isNullOrUndefined(user_string)) {
      let user: User = JSON.parse(user_string);
      return user;
    } else {
      return null;
    }
  }

  /** Borra la informacion del usuario del navegador junto con la llave*/
  public logoutUser() {
    localStorage.removeItem("currentUser");
  }

}

/// iso29110 -> precio/3 = 2300  -> lo paga ella [6874]
/// 