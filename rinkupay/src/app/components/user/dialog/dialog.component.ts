import { DialogInfoComponent } from './../dialog-info/dialog-info.component';


/**
 * @autor Belmont
 * @date 09/03/2020
 */

/**
  * @description componente que permite realizar configuraciones en el sistema
  * 
*/

import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MainUserComponent } from '../main-user/main-user.component';
import { NgForm } from '@angular/forms';
import { UserService } from "./../../../services/user.service";
import { User } from "./../../../models/userModel";
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';

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

  /** información para llenar la informacion en los inputs de usuario */
  private user : User;
  username = "-";
  password = "";
  iduser = "";

  /** opcion para dejar cerrada las tablas de los paneles */
  panelOpenState = true;


  /** Contructor de la clase para el manejo de configuraciones en el sisstema */
  constructor(

    private _snackBar: MatSnackBar,
    private userService:UserService,
    public dialogRef: MatDialogRef<MainUserComponent>,
    private router:Router,
    public dialog: MatDialog,
    
  ){

    this.config = new MatSnackBarConfig();
    this.config.duration = 1000*this.duracion;

  }

  ngOnInit(): void {

    this.getUser();

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getUser(){

    /*
    this.user = this.userService.getCurrentUser();
    this.username = this.user.user;
    this.iduser = this.user._id;
    */
  }

  buscarUsuario( form: NgForm){
    
    this.userService.eliminarUsuario(form.value.iduser).subscribe(res => {

      console.log(res);

      let user: any = {user: "", password: ""};
      user.user = form.value.username;
      user.password = form.value.password;

      this.userService.createUser(user).subscribe( res=> {

        let newUser = res as User;
        this.userService.logoutUser();
        //this.userService.setUser(newUser);
      
        this.openSnackBar("Se a actualizado el usuario correctamente.");

        this.onNoClick();

      });

    });

  }

  /** Muestra mensajes emergentes */
  openSnackBar(message) {
    this._snackBar.open(message, 'close',this.config);
  }

  /** Elimina el conteo de folios y lo restablece a 0 */
  deleteFolios(){

  }

  /** Elimina el conteo de folios y lo restablece a 0 */
  deleteEncuestas(){

  }

    /** Funcion para habrir un modal */
    openDialog(): void {
      const dialogRef = this.dialog.open(DialogInfoComponent, {
        width: 'auto',
        height: 'auto',
        data: {name: "belmont", animal: "Castlevania"}
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
      });
    }

}
