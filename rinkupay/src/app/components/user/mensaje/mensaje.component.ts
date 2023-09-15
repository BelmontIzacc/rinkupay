/**
 * @autor Belmont
 * @date 14/09/2023
 */

/**
  * @description componente que permite mostrar un mensaje emergente
  * 
*/

import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-dialog-mensaje',
    templateUrl: './mensaje.component.html',
    styleUrls: ['./mensaje.component.css']
})
export class MensajeDialog {

    public titulo = "";
    public mensaje1 = "";
    public mensaje2 = "";

    constructor(
        public dialogRef: MatDialogRef<MensajeDialog>,
        @Inject(MAT_DIALOG_DATA) public data: {titulo: string, mensaje1: string, mensaje2: string}) { 
            this.titulo = this.data.titulo;
            this.mensaje1 = this.data.mensaje1;
            this.mensaje2 = this.data.mensaje2;
        }

    public onNoClick(): void {
        this.dialogRef.close(false);
    }

    public onYesClick(): void{
        this.dialogRef.close(true);
    }

}