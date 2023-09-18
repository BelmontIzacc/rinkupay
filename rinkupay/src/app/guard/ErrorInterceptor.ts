/**
 * @autor IIB
 * @date 17/09/2023
 */

/**
  * @description Interceptor que da lectura a los errores de API, si se detecta un 404 sale de la sesion y redirecciona a home
  * 
*/

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // configuracion de los mensajes emergentes
  private config: MatSnackBarConfig;
  private duracion = 4;

  constructor(private router: Router, private _snackBar: MatSnackBar,) { 
    this.config = new MatSnackBarConfig();
    this.config.duration = 1000 * this.duracion;
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Redirigir al usuario a la ruta de inicio ("home")
          this.openSnackBar("Tu sesión ha expirado");
          this.router.navigate(['/']);
        }
        return throwError(error);
      })
    );
  }

  /**
   * @description Muestra mensajes emergentes
   * @param message Mensaje a mostrar
   */
  private openSnackBar(message) {
    this._snackBar.open(message, 'close', this.config);
  }

}
