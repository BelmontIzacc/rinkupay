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
import { ISR } from '../models/isr.Model';
import { CO } from '../models/co.Model';

@Injectable({
  providedIn: 'root'
})

export class NominaService {

  /** Declaración de url de direccion de peticiones de nomina al servidor  */
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

  /**
   * @description Recupera el registro ISR perteneciente a los usuarios
   * @returns { estatus: boolean, isr: {...}}
   */
  public obtenerIsr(): Observable<{ estatus: boolean, isr: ISR }> {
    let res = new Subject<{ estatus: boolean, isr: ISR }>();
    this.http.get(this.URL_API + '/isr').subscribe((respuesta: any) => {
      if (respuesta.estatus) {
        res.next({ estatus: true, isr: respuesta.isr })
      } else {
        res.next({ estatus: false, isr: respuesta.mensaje });
      }
    },
      err => {
        res.error(err);
      });
    return res.asObservable();
  }

  /**
   * @description Recupera el registro mas actual del usuario
   * @returns { estatus: boolean, cos: [{...}]}
   */
    public obtenerCos(): Observable<{ estatus: boolean, cos: Array<CO> }> {
      let res = new Subject<{ estatus: boolean, cos: Array<CO> }>();
      this.http.get(this.URL_API + '/corte').subscribe((respuesta: any) => {
        if (respuesta.estatus) {
          res.next({ estatus: true, cos: respuesta.cos })
        } else {
          res.next({ estatus: false, cos: respuesta.cos });
        }
      },
        err => {
          res.error(err);
        });
      return res.asObservable();
    }

}