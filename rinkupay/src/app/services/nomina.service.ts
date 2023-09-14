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
import { Key } from '../models/keyModel';

@Injectable({
  providedIn: 'root'
})

export class NominaService {

  /** Declaración de url de direccion de peticiones de usuario al servidor  */
  readonly URL_API = 'http://localhost:3000/rinkupayapi/nomina';

  /** constructor del sistema inicializando el objeto para peticiones http */
  constructor(
    private http: HttpClient
  ) { }

  /**
   * @param entrega Objeto que contiene el us, co, entregas, horas y fecha a registrar en la coleccion entrega(EN) 
   * @returns { estatus: boolean, us: {...}} | { estatus: boolean, mensaje: "..."} 
   */
  public registrarEntrega(entrega: { us: string, co: string, entregas: number, horas: number, fecha: Date }): Observable<{ estatus: boolean, en: string }> {
    let res = new Subject<{ estatus: boolean, en: string }>();
    this.http.post(this.URL_API + '/reg_entrega', entrega).subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, en: respuesta.en })
      } else {
        res.next({ estatus: false, en: respuesta.mensaje });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
  }

}

/// iso29110 -> precio/3 = 2300  -> lo paga ella [6874]
/// 