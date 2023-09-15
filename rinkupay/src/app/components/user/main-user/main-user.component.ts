/**
 * @autor Belmont
 * @date 13/09/2023
 */

/**
  * @description componente que permite mostrar los registros del sistema
  * 
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AgregarComponent } from '../agregar/agregar.component';
import { EditarComponent } from '../editar/editar.component';
import { MensajeDialog } from '../mensaje/mensaje.component';

import { UserService } from './../../../services/user.service';
import { NominaService } from './../../../services/nomina.service';

import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.css']
})
export class MainUserComponent implements OnInit {

  /** Control de cabezera de las tablas */
  public displayedColumns: string[] = ['nombre', 'no_empleado', 'rol', 'corte', 'acciones'];
  public dataSource = new MatTableDataSource<Empleado>([]);

  public isLoading: boolean = true;
  public isRegistros: boolean = false;
  public totalRegistros: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public color: ThemePalette = 'accent';
  public mode: ProgressSpinnerMode = 'indeterminate';
  private config: MatSnackBarConfig;
  private duracion = 4;
  /* contructor para inicializar servicios */
  constructor(

    public dialog: MatDialog,
    private userService: UserService,
    private nominaService: NominaService,
    private router: Router,
    private _snackBar: MatSnackBar,

  ) {
    this.config = new MatSnackBarConfig();
    this.config.duration = 1000 * this.duracion;
    this.cargarDatosEmpleados();
  }

  /* Al iniciar la vista carga toda esta funcion */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /* inicializa los arreglos correspondientes por departamento de todos los folios pertenecientes */
  private cargarDatosEmpleados() {
    this.userService.obtenerRoles().subscribe(resRoles => {
      if (resRoles.estatus) {
        this.nominaService.obtenerCos().subscribe(resCo => {
          if (resCo.estatus) {
            this.userService.obtenerEmpleados().subscribe(respuesta => {
              if (respuesta.estatus) {
                const rols = resRoles.rols;
                const cos = resCo.cos;
                const empleados: Array<Empleado> = [];

                for (let empleado of respuesta.empleados) {
                  const id = empleado._id;
                  const nombre = empleado.nombre;
                  const no_empleado = empleado.no_empleado;

                  const buscarRol = rols.find(data => data._id == empleado.ROL)
                  const rol = buscarRol.tipo;

                  const buscarCo = cos.find(data => data.US == empleado._id)
                  const corte = buscarCo.periodo;

                  empleados.push({
                    id: id,
                    nombre: nombre,
                    no_empleado: no_empleado,
                    rol: rol,
                    corte: corte,
                    acciones: ""
                  })
                }

                this.totalRegistros = empleados.length;
                this.dataSource = new MatTableDataSource(empleados);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
                this.isLoading = false;
                if(empleados.length === 0){
                  this.isRegistros = true; 
                }else {
                  this.isRegistros = false;
                }
              }
            })
          }
        });
      }
    })
  }

  public eliminarUsuario(usuario: Empleado) {

    const dialogRef = this.dialog.open(MensajeDialog, {
      width: 'auto',
      height: 'auto',
      data: { titulo: "Eliminar usuario", mensaje1: "Quieres borrar al usuario: " + usuario.nombre, mensaje2: "Con el numero de empleado: " + usuario.no_empleado }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.userService.eliminarUsuario(usuario.no_empleado).subscribe(respuesta => {
          if (respuesta.estatus) {
            this.mostarMensaje("Se elimino el usuario: " + usuario.nombre + "")
            this.cargarDatosEmpleados();
          }
        })
      }
    });

  }

  public editarUser(seleccionado: Empleado) {
    const usuario: Empleado = {
      acciones: seleccionado.acciones,
      corte: seleccionado.corte,
      id: seleccionado.id,
      no_empleado: seleccionado.no_empleado,
      nombre: seleccionado.nombre,
      rol: seleccionado.rol
    }
    const dialogRef = this.dialog.open(EditarComponent, {
      width: 'auto',
      height: 'auto',
      data: { usuario: usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.cargarDatosEmpleados();
      }
    });
  }

  /** Funcion para habrir un modal */
  public openDialog(): void {
    const dialogRef = this.dialog.open(AgregarComponent, {
      width: 'auto',
      height: 'auto',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.cargarDatosEmpleados();
    });
  }

  /** funcion para login out */
  public onLogout() {
    this.userService.logoutUser();
    this.router.navigate(['/']);
  }

  // filtrado de contenido dentro de la tabla
  public applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private mostarMensaje(message) {
    this._snackBar.open(message, 'close', this.config);
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