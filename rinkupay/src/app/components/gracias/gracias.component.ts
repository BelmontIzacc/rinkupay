import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { UserService } from './../../services/user.service';
import { NominaService } from './../../services/nomina.service';
import { User } from '../../models/user.Model';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-gracias',
  templateUrl: './gracias.component.html',
  styleUrls: ['./gracias.component.css']
})
export class GraciasComponent implements OnInit {

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
    this.dateMaxLimit = new Date();
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
        this.userExiste = false
        const usuario = respuesta.us as User;
        const coId = usuario.CO[usuario.CO.length - 1];
        this.coId = coId;
        this.usId = usuario._id;
        this.mostarMensaje("Indicar horas y entregas realizadas por dia");
      } else {
        this.mostarMensaje("El usuario no existe");
      }
    })
  }

  public registrarEntrega(form: NgForm) {
    const entregas = form.value.entregas;
    const horas = form.value.horas;
    const fecha = new Date(form.value.registro);

    this.nserver.registrarEntrega({ us: this.usId, co: this.coId, entregas: entregas, horas: horas, fecha: fecha }).subscribe(respuesta => {
      if (respuesta.estatus) {
        this.mostarMensaje("Se registraron los datos");
        form.reset();
      } else {
        this.mostarMensaje("A ocurrido un error, intenta de nuevo.");
      }
    });
  }

  private mostarMensaje(message) {
    this._snackBar.open(message, 'close', this.config);
  }

}
