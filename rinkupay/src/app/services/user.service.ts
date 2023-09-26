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
import { User } from '../models/user.Model';
import { ROL } from '../models/rol.Model';
import { ISR } from '../models/isr.Model';

// environment
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  // Al buscar detalles de un usuario, se mostrara el usuario que se encuentre guardado
  public userSeleccionado: { id: string, no_empleado: string, nombre: string, rol: string, isr: ISR };
  public rolUsers: Array<ROL> = [];

  /** Declaración de url de direccion de peticiones de usuario al servidor  */
  readonly URL_API = environment.apiUrl + '/usuario';

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

  /**
   * @description Recupera los roles de los empleados
   * @returns { estatus: boolean, rols: [{"..."}]} | { estatus: boolean, mensaje: "..."} 
   */
  public obtenerRoles(): Observable<{ estatus: boolean, rols: Array<ROL> }> {
    let res = new Subject<{ estatus: boolean, rols: Array<ROL> }>();
    this.http.get(this.URL_API + '/rols').subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, rols: respuesta.rols });
      } else {
        res.next({ estatus: false, rols: respuesta.rols });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
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


  /**
   * @description Registrar un usuario
   * @param user, conriene los datos del usuario a registrar : nombre, no_empleado, clave, tipo_usuario, rol, isr 
   * @returns { estatus: boolean, us: "..."} | { estatus: boolean, us: "..."}
   */
  public guardarUsuario(user: { nombre: string, no_empleado: string, clave: string, tipo_usuario: boolean, rol: string, isr: string }): Observable<{ estatus: boolean, us: string }> {
    let res = new Subject<{ estatus: boolean, us: string }>();
    this.http.post(this.URL_API + '/', {
      nombre: user.nombre,
      no_empleado: user.no_empleado,
      clave: user.clave,
      tipo_usuario: user.tipo_usuario,
      rol: user.rol,
      isr: user.isr
    }).subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, us: respuesta.us });
      } else {
        res.next({ estatus: false, us: respuesta.us });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
  }

  /**
   * @description Eliminar un usuario
   * @param no_empleado numero de empleado a eliminar
   * @returns { estatus: boolean, us: "..."} 
   */
  public eliminarUsuario(no_empleado: string): Observable<{ estatus: boolean, us: string }> {
    let res = new Subject<{ estatus: boolean, us: string }>();
    this.http.delete(this.URL_API + '/eliminar/' + no_empleado).subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, us: respuesta.us });
      } else {
        res.next({ estatus: false, us: respuesta.us });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
  }

  /**
   * @description Actualizar usuario
   * @param id identificador de usuario
   * @param no_empleado numero de empleado
   * @param nombre nombre de usuario
   * @param rol rol del usuario
   * @returns { estatus: boolean, us: "..."} 
   */
  public actualizarUsuario(nombre: string, no_empleado: string, rol: string, id: string): Observable<{ estatus: boolean, us: string }> {
    let res = new Subject<{ estatus: boolean, us: string }>();
    this.http.put(this.URL_API + '/actualizar', {
      id: id,
      nombre: nombre,
      no_empleado: no_empleado,
      rol: rol
    }).subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, us: respuesta.us });
      } else {
        res.next({ estatus: false, us: respuesta.us });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
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