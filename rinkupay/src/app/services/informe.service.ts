/**
 * @autor IIB
 * @date 16/09/2023
 */

/**
  * @description clase que funcionara como puente para realizar
  * peticiones al servidor por medio de HTTP para el informe
  * 
*/

/** Importes requeridos para el funcionamiento de las clases y el servicio */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// import de models
import { CO } from '../models/co.Model';
import { EN } from '../models/en.model';

// environment
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class InformeService {
    /** Declaración de url de direccion de peticiones de nomina al servidor  */
    readonly URL_API = environment.apiUrl + '/informe';

    /** constructor del sistema inicializando el objeto para peticiones http */
    constructor(
        private http: HttpClient
    ) { }

    /**
     * @param us identificador del usuario a buscar sus registros de entregas y corte
     * @returns { estatus: boolean, informe: [{...}]} 
     */
    public obtenerInforme(us: string): Observable<{ estatus: boolean, informe: [{ CO: CO, EN: Array<EN> }] }> {
        let res = new Subject<{ estatus: boolean, informe: [{ CO: CO, EN: Array<EN> }] }>();
        this.http.get(this.URL_API + '/info/' + us).subscribe((respuesta: any) => {
            if (respuesta.estatus) {
                res.next({ estatus: true, informe: respuesta.informe })
            } else {
                res.next({ estatus: false, informe: respuesta.informe });
            }
        },
            err => {
                res.error(err);
            });
        return res.asObservable();
    }

    /**
     * @description Edita un registro de entrega
     * @param entregas Numero de entregas realizadas en el dia
     * @param horas Numero de horas realizadas en el dia
     * @param en Identificador de entregas
     * @param rol Identificador del rol
     * @returns { estatus: boolean, en: "..."} 
     */
    public editarEntrega(en: string, rol: string, horas: number, entregas: number): Observable<{ estatus: boolean, en: string }> {
        let res = new Subject<{ estatus: boolean, en: string }>();
        this.http.put(this.URL_API + '/info', {
            entregas: entregas,
            horas: horas,
            en: en,
            rol: rol
        }).subscribe((respuesta: any) => {
            if (respuesta.estatus) {
                res.next({ estatus: true, en: respuesta.informe })
            } else {
                res.next({ estatus: false, en: respuesta.informe });
            }
        },
            err => {
                res.error(err);
            });
        return res.asObservable();
    }


    /**
     * @description Elimina un registro de entrega
     * @param en Identificador de entregas
     * @param rol Identificador del rol
     * @returns { estatus: boolean, en: "..."]} 
     */
    public eliminarEntrega(en: string, rol: string): Observable<{ estatus: boolean, en: string }> {
        let res = new Subject<{ estatus: boolean, en: string }>();
        this.http.post(this.URL_API + '/info', {
            en: en,
            rol: rol
        }).subscribe((respuesta: any) => {
            if (respuesta.estatus) {
                res.next({ estatus: true, en: respuesta.informe })
            } else {
                res.next({ estatus: false, en: respuesta.informe });
            }
        },
            err => {
                res.error(err);
            });
        return res.asObservable();
    }
}