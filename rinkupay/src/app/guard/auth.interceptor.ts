/**
 * @autor IIB
 * @date 17/09/2023
 */

/**
  * @description Interceptor que añade al header el campo de authorization con el token de sesion del usuario
  * 
*/

import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // Obtener el token del localStorage
        const currentUser = localStorage.getItem('currentUser');

        // Si se encuentra un token, agregarlo al encabezado "Authorization"
        if (currentUser) {
            const object: { token: string, US: string } = JSON.parse(currentUser);
            request = request.clone({
                setHeaders: {
                    Authorization: `${object.token}`,
                },
            });
        }

        return next.handle(request);
    }
}