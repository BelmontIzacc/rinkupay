import { Component, OnInit } from '@angular/core';

import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { User } from 'src/app/models/userModel';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

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

  buscarUsuario(form: NgForm) {
    if (!form.value.user || !form.value.password) {
      form.reset();
      this.openSnackBar('Ingresa todos los datos');
    } else {
      const user = form.value.user;
      const clave = form.value.password;
      console.log(form.value);
      this.usuarioServicio.logeoUsuario(user, clave).subscribe(respuesta => {
        console.log(respuesta);
        if (respuesta.estatus) {
          const user = {
            token: respuesta.token,
            US: respuesta.us
          }
          this.usuarioServicio.setUser(user);
          form.reset();
          this.router.navigate(['RINKUPAY/User']);
          this.openSnackBar('Bienvenido');
        } else {
          this.openSnackBar("Usuario o clave incorrecta");
        }
      });
    }
  }

  private openSnackBar(message) {
    this._snackBar.open(message, 'close', this.config);
  }
}
