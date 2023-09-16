/**
 * @autor Belmont
 * @date 14/09/2023
 */

/**
  * @description componente que permite logear un administrador al sistema
  * 
*/

// import angular componentes
import { Component, OnInit } from '@angular/core';

// import de otros modulos
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

// import de servicios
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  // configuracion de los mensajes emergentes
  private config: MatSnackBarConfig;
  private duracion = 4;

  public usuarioSeleccionado = {
    user: "",
    password: ""
  };

  constructor(

    public usuarioServicio: UserService,
    private _snackBar: MatSnackBar,
    private router: Router

  ) {

    this.config = new MatSnackBarConfig();
    this.config.duration = 1000 * this.duracion;

  }

  ngOnInit(): void {
  }

/**
 * @description Busca un usuario para identificar si es del tipo administrador y logearlo dentro del sistema
 * @param form contiene los datos requeridos para logear un usuario dentro del sistema, user : numero de empleado, password: clave de ingreso
 */
  public buscarUsuario(form: NgForm) {
    if (!form.value.user || !form.value.password) {
      form.reset();
      this.openSnackBar('Ingresa todos los datos');
    } else {
      const user = form.value.user;
      const clave = form.value.password;
      this.usuarioServicio.logeoUsuario(user, clave).subscribe(respuesta => {
        if (respuesta.estatus) {
          const user = {
            token: respuesta.token,
            US: respuesta.us
          }
          this.usuarioServicio.setUser(user);
          form.reset();
          this.router.navigate(['RinkyPay']);
          this.openSnackBar('Bienvenido');
        } else {
          this.openSnackBar("Usuario o clave incorrecta");
        }
      });
    }
  }

  /**
   * @description Muestra mensajes emergentes
   * @param message Mensaje a mostrar
   */
  private openSnackBar(message) {
    this._snackBar.open(message, 'close', this.config);
  }
}
