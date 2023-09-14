
/**
 * @autor Belmont
 * @date 09/03/2020
 */

/**
  * @description componente que permite realizar la edicion de informacion en el sistema
  * 
*/

import { Component, OnInit } from '@angular/core';
import { DialogComponent } from './../dialog/dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';
import { DatosConsulta } from 'src/app/models/datosConsultaModel';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-info',
  templateUrl: './dialog-info.component.html',
  styleUrls: ['./dialog-info.component.css']
})
export class DialogInfoComponent implements OnInit {

  /** control de tiempo para menssajes emergentes */
  private config: MatSnackBarConfig;
  private duracion = 6;

  id="";
  clave = "";
  fEmision = new Date();
  emision = "";
  periodo = "";

  /** constructor que inicia los datos del formulario para los datos de consulta de cabezera */
  constructor(

    public dialogRef: MatDialogRef<DialogComponent>,
    private _snackBar: MatSnackBar,
    

  ) {

    this.config = new MatSnackBarConfig();
    this.config.duration = 1000*this.duracion;

   }
  

  /** funcion que al iniciar la pagina carga la información o inicia funciones espesificadas */
  ngOnInit(): void {
    this.cargarDatosCabezera();
  }  
  
  /** para cerrar el modal */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /** inicia la carga de información de la cabezera consultandola desde db */
  cargarDatosCabezera(){

  }

  /** permite la edicion de información desde la db */
  editarInformacion( form : NgForm){

    let data = form.value as DatosConsulta;

    console.log(data);

  }

    /** Muestra mensajes emergentes */
    openSnackBar(message) {
      this._snackBar.open(message, 'close',this.config);
    }

}
