
/**
 * @autor Belmont
 * @date 14/09/2023
 */

/**
  * @description componente que permite realizar la edicion del usuario
  * 
*/

// import de angular component
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgForm } from '@angular/forms';

// import de angular material
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// import de servicios
import { UserService } from "../../../services/user.service";

@Component({
  selector: 'app-dialog-info',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

  /** control de tiempo para menssajes emergentes */
  private config: MatSnackBarConfig;
  private duracion = 6;

  public empleado: Empleado;

  public rolSelect: { tipo: string, addMore: boolean, id: string } = { tipo: "", addMore: false, id: "" };
  public tipoRols: Array<{ tipo: string, addMore: boolean, id: string }> = [];

  /** constructor que inicia los datos del formulario para los datos de consulta de cabezera */
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditarComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { usuario: Empleado }
  ) {
    this.empleado = data.usuario;
    this.config = new MatSnackBarConfig();
    this.config.duration = 1000 * this.duracion;
    this.obtenerRols()
  }

  /**
   * @description Actualiza la informacion del sistema
   * @param form Formulrio que contiene los datos a actualizar del usuario
   */
  public editarInformacion(form: NgForm) {
    const nombre = form.value.nombre;
    const rol = form.value.rols.id;
    const no_empleado = form.value.noEmpleado;
    this.userService.actualizarUsuario(nombre, no_empleado, rol, this.empleado.id).subscribe(respuesta => {
      if (respuesta.estatus) {
        this.openSnackBar("Usuario actualizado");
        this.yesNoClick();
      } else {
        this.openSnackBar(respuesta.us);
      }
    })

  }

  /** funcion que al iniciar la pagina carga la información o inicia funciones espesificadas */
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
   * @description Recupera los rols registrados dentro de la base de datos para mostrar dentro del modal
   */
  private obtenerRols() {
    this.userService.obtenerRoles().subscribe(respuesta => {
      if (respuesta.estatus) {
        const rols = respuesta.rols;
        for (let r of rols) {
          this.tipoRols.push({
            tipo: r.tipo,
            addMore: true,
            id: r._id
          });
        }
        this.rolSelect = this.tipoRols.find(rol => rol.tipo == this.empleado.rol)
      }
    });
  }

}

export interface Empleado {
  id: string;
  nombre: string;
  no_empleado: string;
  rol: string;
  corte: string;
  acciones: string;
}