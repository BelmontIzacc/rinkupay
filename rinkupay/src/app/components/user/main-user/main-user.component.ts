/**
 * @autor Belmont
 * @date 13/09/2023
 */

/**
  * @description componente que permite mostrar los registros del sistema
  * 
*/

// import de angular component
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// import de componentes
import { AgregarComponent } from '../agregar/agregar.component';
import { EditarComponent } from '../editar/editar.component';
import { MensajeDialog } from '../mensaje/mensaje.component';

// import de servicios
import { UserService } from './../../../services/user.service';
import { NominaService } from './../../../services/nomina.service';

// otros imports
import { Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// import de componentes de angular material
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// import de moles
import { ROL } from '../../../models/rol.Model';
import { ISR } from '../../../models/isr.Model';

@Component({
  selector: 'app-main-user',
  templateUrl: './main-user.component.html',
  styleUrls: ['./main-user.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }
  }]
})
export class MainUserComponent implements OnInit {

  // Control de cabezera de las tablas primera tabla y segunda
  public displayedColumns: string[] = ['nombre', 'no_empleado', 'rol', 'corte', 'entregas', 'horas', 'acciones'];
  public displayedColumnsDetalles: string[] = ['no_empleado', 'hrs', 'noentregas', 'entregas', 'bonos', 'retenciones', 'totalB', 'totalN', 'vales'];

  // declaracion de tablas
  public dataSource = new MatTableDataSource<Empleado>([]);
  public dataDetalleSource = new MatTableDataSource<Detalle>([]);
  public dataDetalleSourceOrg = new MatTableDataSource<Detalle>([]);

  // control de spiners (loadings) de la vistas
  public isLoading: boolean = true;
  public isRegistros: boolean = false;

  // indicar numeto total de registros
  public totalRegistros: number = 0;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // configuracion de duracion de mensaje emergente
  private config: MatSnackBarConfig;
  private duracion = 4;

  // control de stepper <solo se declara  no se utiliza>
  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;

  // color del spiner
  public color: ThemePalette = 'accent';
  public mode: ProgressSpinnerMode = 'indeterminate';

  private rols: Array<ROL> = [];

  // guardar el id del isr, para ser indicar en el usuario a agregar
  private isr: ISR;

  /* contructor para inicializar servicios */
  constructor(

    public dialog: MatDialog,
    private userService: UserService,
    private nominaService: NominaService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder

  ) {
    this.config = new MatSnackBarConfig();
    this.config.duration = 1000 * this.duracion;
    this.obtenerRegIsr();
    this.cargarDatosEmpleados();
  }

  /* Al iniciar la vista carga toda esta funcion */
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  /**
   * @description Carga la informacion de las tablas.
   * Muestra en la tabla 1. Datos de usuario
   * Muestra en la tabla 2. Datos de nomina
   */
  private cargarDatosEmpleados() {
    this.userService.obtenerRoles().subscribe(resRoles => {
      if (resRoles.estatus) {
        this.nominaService.obtenerCos().subscribe(resCo => {
          if (resCo.estatus) {
            this.userService.obtenerEmpleados().subscribe(respuesta => {
              if (respuesta.estatus) {
                const rols = resRoles.rols;
                this.rols = rols;
                const cos = resCo.cos;
                let empleados: Array<Empleado> = [];
                const detalles: Array<Detalle> = [];

                for (let empleado of respuesta.empleados) {
                  const id = empleado._id;
                  const nombre = empleado.nombre;
                  const no_empleado = empleado.no_empleado;

                  const buscarRol = rols.find(data => data._id == empleado.ROL)
                  const rol = buscarRol.tipo;

                  const buscarCo = cos.find(data => data.US == empleado._id)
                  const corte = buscarCo.periodo;

                  const entregasVal = buscarCo.entregas === null ? 0 : buscarCo.entregas;
                  const horasVal = buscarCo.hrs_total === null ? 0 : buscarCo.hrs_total;
                  empleados.push({
                    id: id,
                    nombre: nombre,
                    no_empleado: no_empleado,
                    rol: rol,
                    corte: corte,
                    entregas: "" + entregasVal,
                    horas: "" + horasVal,
                    acciones: ""
                  });

                  let detallePago = { pago_bonos: 0, pago_entregas: 0, retenciones: 0 };
                  if (buscarCo.detalles !== undefined && buscarCo.detalles !== null) {
                    detallePago = buscarCo.detalles;
                  }

                  let despensa = "0";
                  if (buscarCo.despensa !== undefined && buscarCo.despensa !== null) {
                    despensa = buscarCo.despensa.toFixed(2);
                  }

                  let pagoNeto = "0";
                  if (buscarCo.pago_neto !== undefined && buscarCo.pago_neto !== null) {
                    pagoNeto = buscarCo.pago_neto.toFixed(2);
                  }

                  let pagoBruto = "0";
                  if (buscarCo.pago_bruto !== undefined && buscarCo.pago_bruto !== null) {
                    pagoBruto = buscarCo.pago_bruto.toFixed(2)
                  }

                  detalles.push({
                    id: id,
                    no_empleado: no_empleado,
                    bonos: "" + detallePago.pago_bonos.toFixed(2),
                    entregas: "" + detallePago.pago_entregas.toFixed(2),
                    noentregas: "" + entregasVal.toFixed(2),
                    hrs: "" + horasVal.toFixed(2),
                    retenciones: "" + detallePago.retenciones.toFixed(2),
                    vales: "" + despensa,
                    totalN: "" + pagoNeto,
                    totalB: "" + pagoBruto
                  });
                }

                this.totalRegistros = empleados.length;

                this.dataSource = new MatTableDataSource(empleados);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;

                this.dataDetalleSource = new MatTableDataSource(detalles);
                this.dataDetalleSource.paginator = this.paginator;
                this.dataDetalleSource.sort = this.sort;

                this.dataDetalleSourceOrg = new MatTableDataSource(detalles);

                this.isLoading = false;
                if (empleados.length === 0) {
                  this.isRegistros = true;
                } else {
                  this.isRegistros = false;
                }
              }
            })
          }
        });
      }
    })
  }

  /**
   * @description Modal o ventana emergente para confirmar la accion de eliminar un usuario
   * @param usuario Objeto de tipo Empleado el cual es el seleccionado dentro de la tabla para eliminar
   */
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

  /**
   * @description Modal o ventana emergente para editar un usuario
   * @param seleccionado Objeto de tipo Empleado el cual es el seleccionado dentro de la tabla para editar
   */
  public editarUser(seleccionado: Empleado) {
    const usuario: Empleado = {
      acciones: seleccionado.acciones,
      corte: seleccionado.corte,
      id: seleccionado.id,
      no_empleado: seleccionado.no_empleado,
      nombre: seleccionado.nombre,
      rol: seleccionado.rol,
      horas: seleccionado.horas,
      entregas: seleccionado.entregas
    }
    const dialogRef = this.dialog.open(EditarComponent, {
      width: 'auto',
      height: 'auto',
      data: { usuario: usuario }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == true) {
        this.mostarMensaje("Usuario actualizado");
        this.cargarDatosEmpleados();
      }
    });
  }

  /**
   * @description Cambia la vista a detalles de nomina de un usuario
   * @param seleccionado Objeto de tipo Empleado el cual es el seleccionado dentro de la tabla para mostrar sus detalles
   */
  public mostrarDetalles(seleccionado: Empleado) {
    this.userService.userSeleccionado = { ...seleccionado, isr: this.isr };
    this.userService.rolUsers = this.rols;
    this.router.navigate(['RinkyPay/corte']);
  }

  /**
   * @description Muestra modal pra agregar un usuario
   */
  public openDialog(): void {
    const dialogRef = this.dialog.open(AgregarComponent, {
      width: 'auto',
      height: 'auto',
      data: { isr: this.isr._id }
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
    this.dataDetalleSource = this.dataDetalleSourceOrg;

    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    // Accede al conjunto de datos filtrados
    const datosFiltrados = this.dataSource.filteredData;
    if (datosFiltrados.length > 0) {
      const idsFiltrados = datosFiltrados.map((objeto) => objeto.id);
      const datosFiltradosEnSource2 = this.dataDetalleSource.data.filter((objeto) => {
        return idsFiltrados.includes(objeto.id);
      });
      const nuevoDataDetalleSource2 = new MatTableDataSource(datosFiltradosEnSource2);
      this.dataDetalleSource = nuevoDataDetalleSource2;
    } else {
      this.dataDetalleSource = this.dataDetalleSourceOrg;
    }

  }

  // funcion para aplicar un filtrado a la 2da tabla
  public applyFilterDetails(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataDetalleSource.filter = filterValue.trim().toLowerCase();

    if (this.dataDetalleSource.paginator) {
      this.dataDetalleSource.paginator.firstPage();
    }
  }

  /**
   * @description Muestra un mensaje emergente en la pantalla
   * @param message mensaje a mostrar dentro del snackBar
   */
  private mostarMensaje(message) {
    this._snackBar.open(message, 'close', this.config);
  }

  /**
   * @description Recupera el registro mas actual de ISR para recuperar su id e indicarlo en el usuario a agregar
   */
  private obtenerRegIsr() {
    this.nominaService.obtenerIsr().subscribe(respuesta => {
      if (respuesta.estatus) {
        this.isr = respuesta.isr;
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
  entregas: string;
  horas: string;
}

export interface Detalle {
  id: string;
  no_empleado: string;
  hrs: string;
  bonos: string;
  retenciones: string;
  noentregas: string;
  entregas: string;
  vales: string;
  totalN: string;
  totalB: string;
}