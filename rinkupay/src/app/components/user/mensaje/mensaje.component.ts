/**
 * @autor Belmont
 * @date 14/09/2023
 */

/**
  * @description componente que permite mostrar un mensaje emergente
  * 
*/

// imports de angular component
import { Component, Inject } from '@angular/core';
// import de angular material
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
        @Inject(MAT_DIALOG_DATA) public data: { titulo: string, mensaje1: string, mensaje2: string }) {
        this.titulo = this.data.titulo;
        this.mensaje1 = this.data.mensaje1;
        this.mensaje2 = this.data.mensaje2;
    }

    /**
      * @description Cerrar la ventana emergente y retornar un false,
      * retorna "false" si se preciono el boton "cancelar"
      */
    public onNoClick(): void {
        this.dialogRef.close(false);
    }

  /**
    * @description Cerrar la ventana emergente y retornar un true,
    * retorna "true" si se preciono el boton "aceptar"
   */
    public onYesClick(): void {
        this.dialogRef.close(true);
    }

}