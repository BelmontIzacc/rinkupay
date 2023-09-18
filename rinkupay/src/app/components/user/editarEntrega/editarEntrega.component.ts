/**
 * @autor Belmont
 * @date 17/09/2023
 */

/**
  * @description componente que permite realizar la edicion de una entrega
  * 
*/

// import de angular component
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

// import de angular material
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// import de service
import { InformeService } from '../../../services/informe.service';

@Component({
    selector: 'app-editar-en',
    templateUrl: './editarEntrega.component.html',
    styleUrls: ['./editarEntrega.component.css']
})
export class EditarEntregaComponent implements OnInit {

    /** control de tiempo para menssajes emergentes */
    private config: MatSnackBarConfig;
    private duracion = 6;
    public entrega: Entrega = {
        enId: "",
        entregas: "",
        horas: "",
        rol: "",
        fecha: ""
    }

    constructor(
        private infService: InformeService,
        @Inject(MAT_DIALOG_DATA) public data: { entrega: Entrega },
        public dialogRef: MatDialogRef<EditarEntregaComponent>,
        private _snackBar: MatSnackBar,
    ) {
        this.entrega = data.entrega;
        this.config = new MatSnackBarConfig();
        this.config.duration = 1000 * this.duracion;
    }

    ngOnInit(): void { }

    /** para cerrar el modal */
    public onNoClick(): void {
        this.dialogRef.close(false);
    }

    /** para cerrar el modal */
    public yesNoClick(): void {
        this.dialogRef.close(true);
    }

    /** Muestra mensajes emergentes */
    public openSnackBar(message) {
        this._snackBar.open(message, 'close', this.config);
    }

    /**
     * @description Actualiza la informacion del sistema
     * @param form Formulrio que contiene los datos a actualizar del usuario
     */
    public editarEntregas(form: NgForm) {
        let horas = form.value.horas;
        let entregas = form.value.entregas;
        if (horas > 8) {
            horas = 8;
        }
        if (horas < 0) {
            horas = 0;
        }
        if (entregas < 0) {
            entregas = 0;
        }
        this.infService.editarEntrega(this.entrega.enId, this.entrega.rol, horas, entregas).subscribe(respuesta => {
            if (respuesta.estatus) {
                this.yesNoClick();
            } else {
                this.openSnackBar(respuesta.en);
            }
        })
    }
}

export interface Entrega {
    enId: string;
    entregas: string;
    horas: string;
    rol: string;
    fecha: string;
}