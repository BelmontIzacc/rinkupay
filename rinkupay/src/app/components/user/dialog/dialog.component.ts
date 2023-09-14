import { DialogInfoComponent } from './../dialog-info/dialog-info.component';


/**
 * @autor Belmont
 * @date 14/09/2023
 */

/**
  * @description componente que permite agregar un empleado al sistema
  * 
*/

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainUserComponent } from '../main-user/main-user.component';
import { NgForm } from '@angular/forms';
import { UserService } from "./../../../services/user.service";
import { NominaService } from "./../../../services/nomina.service";

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { Router } from '@angular/router';

@Component({

  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']

})
export class DialogComponent implements OnInit {

  /** control de tiempo para menssajes emergentes */
  private config: MatSnackBarConfig;
  private duracion = 6;

  public usuarioGuardar = {
    user: "",
    password: "",
    userName: ""
  }

  rolSelect: { tipo: string, addMore: boolean, id: string } = { tipo: "", addMore: false, id: "" };
  tipoRols: Array<{ tipo: string, addMore: boolean, id: string }> = [];

  private isr = "";

  /** Contructor de la clase para el manejo de configuraciones en el sisstema */
  constructor(

    private _snackBar: MatSnackBar,
    private userService: UserService,
    private nominaService: NominaService,
    public dialogRef: MatDialogRef<MainUserComponent>,
    public dialog: MatDialog,

  ) {

    this.config = new MatSnackBarConfig();
    this.config.duration = 1000 * this.duracion;
    this.obtenerRols();
    this.obtenerRegIsr();
  }

  ngOnInit(): void {

  }

  agregarUsuario(form: NgForm) {
    const password = form.value.password;
    const user = form.value.user;
    const rol = form.value.rols;
    const userName = form.value.userName;

    if (rol.tipo === '') {
      this.openSnackBar("Indica el tipo de usuario");
      return;
    }

    let addUser = {
      nombre: userName,
      no_empleado: user,
      clave: password,
      tipo_usuario: false,
      rol: "",
      isr: "",
    }
    if (rol.addMore) {
      // usuario normal
      addUser.rol = rol.id
      addUser.isr = this.isr
      addUser.tipo_usuario = false;
    } else {
      // administrador
      addUser.tipo_usuario = true;
    }

    // guardar usuario
    this.userService.guardarUsuario(addUser).subscribe(respuesta => {
      if (respuesta.estatus) {
        console.log(respuesta);
        this.openSnackBar("Usuario registrado");
      } else {
        this.openSnackBar(respuesta.us);
      }
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  /** Muestra mensajes emergentes */
  openSnackBar(message) {
    this._snackBar.open(message, 'close', this.config);
  }

  obtenerRols() {
    this.userService.obtenerRoles().subscribe(respuesta => {
      if (respuesta.estatus) {
        this.tipoRols.push({
          tipo: "Administrador",
          addMore: false,
          id: null
        });
        const rols = respuesta.rols;
        for (let r of rols) {
          this.tipoRols.push({
            tipo: r.tipo,
            addMore: true,
            id: r._id
          });
        }
      }
    });
  }

  obtenerRegIsr() {
    this.nominaService.obtenerIsr().subscribe(respuesta => {
      if (respuesta.estatus) {
        this.isr = respuesta.isr._id;
      }
    });
  }

}
