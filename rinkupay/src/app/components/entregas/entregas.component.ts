import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UserService } from '../../services/user.service';
import { NominaService } from '../../services/nomina.service';
import { User } from '../../models/user.Model';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gracias',
  templateUrl: './entregas.component.html',
  styleUrls: ['./entregas.component.css']
})
export class EntregasComponent implements OnInit {

  public usuarioSeleccionado = {
    user: "",
    password: ""
  };

  public events: string[] = [];
  public entregas = 0;
  public horas = 0;
  public fecha;

  public dateMinLimit: Date;
  public dateMaxLimit: Date;
  public fechaEntrega;
  public userExiste = true;

  public usuarioResultado = "";
  public rolUsuario = "";

  private config: MatSnackBarConfig;
  private duracion = 4;

  private coId = "";
  private usId = "";

  constructor(

    private userver: UserService,
    private nserver: NominaService,
    private _snackBar: MatSnackBar,

  ) {
    const currentYear = new Date().getFullYear();
    this.dateMinLimit = new Date(currentYear, 0, 1);
    this.dateMaxLimit = new Date(currentYear, 11, 30);
    this.config = new MatSnackBarConfig();
    this.config.duration = 1000 * this.duracion;
  }

  ngOnInit(): void {
  }

  public addEvent(event: MatDatepickerInputEvent<Date>) {
    this.events.push(`${event.value}`);
  }

  public buscarUsuario(form: NgForm) {
    const noempleado = form.value.user;
    const clave = form.value.password;
    this.userver.buscarUsuario({ no_empleado: noempleado, clave: clave }).subscribe(respuesta => {
      if (respuesta.estatus) {
        this.userver.obtenerRoles().subscribe(resRol => {
          if (resRol.estatus) {
            const rols = resRol.rols;

            this.userExiste = false
            const usuario = respuesta.us as User;
            const coId = usuario.CO[usuario.CO.length - 1];
            this.coId = coId;
            this.usId = usuario._id;
            this.usuarioResultado = usuario.nombre;
            const rol = rols.find(rol => rol._id == usuario.ROL).tipo;
            this.rolUsuario = rol;
            this.usuarioSeleccionado.password = "";
            this.mostarMensaje("Indicar horas y entregas realizadas por dia");
          }
        })
      } else {
        this.mostarMensaje("El usuario no existe");
      }
    })
  }

  public registrarEntrega(form: NgForm) {
    let entregas = form.value.entregas;
    let horas = form.value.horas;
    const fecha = new Date(form.value.registro);

    if (horas >= 8) {
      horas = 8;
    }

    if (horas <= 0) {
      horas = 0;
    }

    if (entregas <= 0) {
      entregas = 0;
    }

    this.nserver.registrarEntrega({ us: this.usId, co: this.coId, entregas: entregas, horas: horas, fecha: fecha }).subscribe(respuesta => {
      if (respuesta.estatus) {
        this.mostarMensaje("Se registraron los datos");
        form.reset();
        this.userExiste = true
      } else {
        this.mostarMensaje(respuesta.en);
      }
    });
  }

  private mostarMensaje(message) {
    this._snackBar.open(message, 'close', this.config);
  }

}
