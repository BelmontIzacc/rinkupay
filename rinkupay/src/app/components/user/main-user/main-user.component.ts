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
import { DialogComponent } from '../dialog/dialog.component';
import { UserService } from './../../../services/user.service';
import { NominaService } from './../../../services/nomina.service';

import { Router } from '@angular/router';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.css']
})
export class MainUserComponent implements OnInit {

  /** Control de cabezera de las tablas */
  public displayedColumns: string[] = ['nombre', 'no_empleado', 'rol', 'corte', 'acciones'];
  public dataSource = new MatTableDataSource<Empleado>([]);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  /* contructor para inicializar servicios */
  constructor(

    public dialog: MatDialog,
    private userService: UserService,
    private nominaService: NominaService,
    private router: Router

  ) {
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
                console.log(rols)
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

                this.dataSource = new MatTableDataSource(empleados);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            })
          }
        });
      }
    })
  }

  public eliminarUsuario(id: string){
    console.log(id)
  }

  /** Funcion para habrir un modal */
  public openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      height: 'auto',
      data: { name: "belmont", animal: "Castlevania" }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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

}

export interface Empleado {
  id: string;
  nombre: string;
  no_empleado: string;
  rol: string;
  corte: string;
  acciones: string;
}