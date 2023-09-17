/**
 * @autor Belmont
 * @date 15/09/2023
 */

/**
  * @description componente para mostrar el reporte
  * 
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../../../services/user.service';
import { InformeService } from './../../../services/informe.service';

// import de componentes
import { MensajeDialog } from '../mensaje/mensaje.component';
import { EditarEntregaComponent } from '../editarEntrega/editarEntrega.component';

// import de rutas
import { Router } from '@angular/router';

// imports de angular material
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

// import de models
import { CO } from '../../../models/co.Model';
import { EN } from '../../../models/en.model';
import { ROL } from '../../../models/rol.Model';
import { ISR } from '../../../models/isr.Model';

@Component({
    selector: 'app-reporte',
    templateUrl: './reporte.component.html',
    styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

    // variables de periodo
    public periodos: Array<Periodo> = [];
    public itemSeleccionado: Periodo;

    // id del usuario seleccionado
    private id: string = "";
    public userSelected: { id: string, no_empleado: string, nombre: string, rol: string, isr: ISR };

    // control de spiners (loadings) de la vistas
    public isLoading: boolean = true;

    // color del spiner
    public color: ThemePalette = 'accent';
    public mode: ProgressSpinnerMode = 'indeterminate';

    // declaracion de tabla de reporte
    public dataDetalleSource = new MatTableDataSource<Entrega>([]);

    // nombre de columnas
    public displayedColumns: string[] = ['elemento', 'entregas', 'horas', 'fecha', 'acciones'];

    // datos del usuario
    private informeUsuario: [{
        CO: CO;
        EN: EN[];
    }];
    // datos del corte
    public reporte: Detalle = {
        corte: "",
        despensa: "",
        entregas: "",
        inicio: "",
        periodo: "",
        pago_neto: "",
        pago_bruto: "",
        hrs_total: "",
        detalles: {
            pago_bonos: "",
            pago_entregas: "",
            retenciones: "",
            pago_horas: ""
        }
    };

    // actualizar tabla por eliminar o actualizar
    private actualizar = false;

    // configuracion de duracion de mensaje emergente
    private config: MatSnackBarConfig;
    private duracion = 4;

    private rols: Array<ROL> = [];
    private rolRef: ROL;

    constructor(
        public dialog: MatDialog,
        private userService: UserService,
        private infoService: InformeService,
        private router: Router,
        private _snackBar: MatSnackBar,
    ) {
        this.userSelected = this.userService.userSeleccionado;
        this.rols = this.userService.rolUsers;
        if (this.userSelected === undefined || this.userSelected.id === '') {
            this.router.navigate(['/RinkyPay']);
        }

        const refRol = this.rols.find(rol => rol.tipo == this.userSelected.rol);
        this.rolRef = refRol;

        this.id = this.userSelected.id;
        this.recuperarInforme();
    }

    ngOnInit(): void { }

    /** funcion para login out */
    public onLogout() {
        this.userService.logoutUser();
        this.router.navigate(['/']);
    }

    /** funcion para regresar */
    public regresar() {
        this.router.navigate(['/RinkyPay']);
    }

    /**
     * @description Indica que periodo fue seleccionado en la lista
     * @param event lectura del evento del boton seleccionado
     */
    public onSelectionChange(event): void {
        const selectedOptions = event.source.selectedOptions.selected;
        if (selectedOptions.length > 0) {
            this.itemSeleccionado = selectedOptions[0].value;
            this.cargarTabla();
        } else {
            this.itemSeleccionado = null;
        }
    }

    /**
     * @description Carga la informacion de la tabla
     */
    private cargarTabla(): void {
        const corte = this.itemSeleccionado.id;
        const informe = this.informeUsuario.find(data => data.CO._id == corte);

        // Reporte
        const inicio = new Date(informe.CO.creacion);
        const dia = inicio.getDate() + 1;
        const mes = inicio.getMonth();
        const year = inicio.getFullYear();
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        const corteDate = new Date(informe.CO.corte);
        const dcorte = corteDate.getDate() + 1;
        const mcorte = corteDate.getMonth();
        const ycorte = corteDate.getFullYear();

        const pago_horas = informe.CO.hrs_total * this.rolRef.sueldo_base;
        this.reporte = {
            periodo: informe.CO.periodo,
            despensa: "" + informe.CO.despensa.toFixed(2),
            entregas: "" + informe.CO.entregas,
            hrs_total: "" + informe.CO.hrs_total.toFixed(2),
            pago_bruto: "" + informe.CO.pago_bruto.toFixed(2),
            pago_neto: "" + informe.CO.pago_neto.toFixed(2),
            inicio: dia + " " + meses[mes] + " " + year,
            corte: dcorte + " " + meses[mcorte] + " " + ycorte,
            detalles: {
                pago_bonos: "" + informe.CO.detalles.pago_bonos.toFixed(2),
                pago_entregas: "" + informe.CO.detalles.pago_entregas.toFixed(2),
                retenciones: "" + informe.CO.detalles.retenciones.toFixed(2),
                pago_horas: "" + pago_horas.toFixed(2)
            }
        }

        // Entregas
        const entregas: Array<Entrega> = [];
        let i = 1;
        for (let en of informe.EN) {
            const fechEntrega = new Date(en.fecha);
            const dia = fechEntrega.getDate() + 1;
            const mes = fechEntrega.getMonth();
            const year = fechEntrega.getFullYear();
            entregas.push({
                entregas: "" + en.entregas,
                horas: "" + en.horas,
                fecha: dia + " " + meses[mes] + " " + year,
                acciones: "",
                coId: en.CO,
                enId: en._id,
                elemento: "" + i
            });
            i += 1;
        }
        this.dataDetalleSource = new MatTableDataSource(entregas);
        this.isLoading = false;
    }

    /**
     * @description Da lectura a los cortes del usuario
     */
    public recuperarInforme(): void {
        this.infoService.obtenerInforme(this.id).subscribe(respuesta => {
            if (respuesta.estatus) {
                this.periodos = [];
                for (let informe of respuesta.informe) {
                    const corte = informe.CO;
                    this.periodos.push({
                        id: corte._id,
                        periodo: corte.periodo
                    });
                }
                this.informeUsuario = respuesta.informe;
                if (this.actualizar) {
                    this.cargarTabla();
                    this.isLoading = false;
                }{
                    this.isLoading = false;
                }
            }
        });
    }

    /**
     * @description Edita un registro de reporte
     * @param entrega: objeto de entrega que se editara
     */
    public editarReporte(entrega: Entrega): void {
        const horas = entrega.horas;
        const entregas = entrega.entregas;
        const editarEntrega = {
            horas: horas,
            entregas: entregas,
            rol: this.rolRef._id,
            enId: entrega.enId
        }
        const dialogRef = this.dialog.open(EditarEntregaComponent, {
            width: 'auto',
            height: 'auto',
            data: { entrega: editarEntrega }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.isLoading = true;
                this.actualizar = true;
                this.recuperarInforme();
            }
        })
    }

    /**
     * @description elimina un registro de reporte
     * @param entrega: objeto de entrega que se eliminara
     */
    public eliminarReporte(entrega: Entrega): void {
        const dialogRef = this.dialog.open(MensajeDialog, {
            width: 'auto',
            height: 'auto',
            data: { titulo: "Eliminar registro", mensaje1: "Quieres eliminar el registro: " + entrega.fecha, mensaje2: "Entregas: " + entrega.entregas + " y horas: " + entrega.horas }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == true) {
                this.isLoading = true;
                this.infoService.eliminarEntrega(entrega.enId, this.rolRef._id).subscribe(respuesta => {
                    if (respuesta.estatus) {
                        this.actualizar = true;
                        this.recuperarInforme();
                        this.mostarMensaje("Se elimino el registro: " + entrega.fecha)
                    }
                })
            }
        });
    }

    /**
     * @description Muestra un mensaje emergente en la pantalla
     * @param message mensaje a mostrar dentro del snackBar
     */
    private mostarMensaje(message) {
        this._snackBar.open(message, 'close', this.config);
    }
}

export interface Periodo {
    periodo: string;
    id: string;
}

export interface Entrega {
    enId: string;
    coId: string;
    entregas: string;
    horas: string;
    fecha: string;
    acciones: string;
    elemento: string
}

export interface Detalle {
    corte: string;
    inicio: string;
    despensa: string;
    entregas: string;
    hrs_total: string;
    pago_bruto: string;
    pago_neto: string;
    periodo: string;
    detalles: {
        pago_bonos: string;
        pago_entregas: string;
        retenciones: string;
        pago_horas: string;
    }
}