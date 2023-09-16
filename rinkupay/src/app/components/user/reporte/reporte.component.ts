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

import { Router } from '@angular/router';

@Component({
    selector: 'app-reporte',
    templateUrl: './reporte.component.html',
    styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

    constructor(
        private userService: UserService,
        private router: Router,
    ) { 
        console.log(this.userService.userSeleccionado)
    }

    ngOnInit(): void { }

    /** funcion para login out */
    public onLogout() {
        this.userService.logoutUser();
        this.router.navigate(['/']);
    }
}