/**
 * @autor Belmont
 * @date 13/09/2023
 */

/**
  * @description Componente que funcionara como enrutador dentro del sistema
  * 
*/

/** declaracion de modulos a los cuales seran dirigidos dentro del sistema por medio de rutas*/
import { GraciasComponent } from './components/gracias/gracias.component';
import { LoginComponent } from './components/login/login.component';
import { Error404Component } from './components/error404/error404.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { auth } from './guard/auth';
import { MainUserComponent } from './components/user/main-user/main-user.component';

/** Arreglo para declaracion y enrutacion dentro del sistema */
const routes: Routes = [
  { path: '', component: GraciasComponent},
  { path: 'login', component: LoginComponent},
  { path: 'RINKUPAY/User', component: MainUserComponent, canActivate: [auth]}, // solo usuario auth
  { path: '**', component: Error404Component} // en caso de no encontrar alguna ruta ** es el default
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
