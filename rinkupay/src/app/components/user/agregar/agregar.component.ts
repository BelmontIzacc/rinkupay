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
import { NgForm } from '@angular/forms';
import { UserService } from "../../../services/user.service";
import { NominaService } from "../../../services/nomina.service";

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({

  selector: 'app-dialog',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']

})
export class AgregarComponent implements OnInit {

  /** control de tiempo para menssajes emergentes */
  private config: MatSnackBarConfig;
  private duracion = 6;

  public usuarioGuardar = {
    user: "",
    password: "",
    userName: ""
  }

  public rolSelect: { tipo: string, addMore: boolean, id: string } = { tipo: "", addMore: false, id: "" };
  public tipoRols: Array<{ tipo: string, addMore: boolean, id: string }> = [];

  private isr = "";

  /** Contructor de la clase para el manejo de configuraciones en el sisstema */
  constructor(

    private _snackBar: MatSnackBar,
    private userService: UserService,
    private nominaService: NominaService,
    public dialogRef: MatDialogRef<AgregarComponent>,
    public dialog: MatDialog,

  ) {

    this.config = new MatSnackBarConfig();
    this.config.duration = 1000 * this.duracion;
    this.obtenerRols();
    this.obtenerRegIsr();
  }

  ngOnInit(): void {

  }

  public agregarUsuario(form: NgForm) {
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
        this.openSnackBar("Usuario registrado");
        form.reset()
      } else {
        this.openSnackBar(respuesta.us);
      }
      
    })
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  /** Muestra mensajes emergentes */
  private openSnackBar(message) {
    this._snackBar.open(message, 'close', this.config);
  }

  private obtenerRols() {
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

  private obtenerRegIsr() {
    this.nominaService.obtenerIsr().subscribe(respuesta => {
      if (respuesta.estatus) {
        this.isr = respuesta.isr._id;
      }
    });
  }

}
