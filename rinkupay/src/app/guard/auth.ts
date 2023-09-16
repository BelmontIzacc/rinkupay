/**
 * @autor Belmont
 * @date 15/09/2023
 */

/**
  * @description Componente para validar si un usuario se encuentra logeado dentro del sistema
  * 
*/

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './../services/user.service';

@Injectable({
    providedIn: 'root'
  })
  export class auth implements CanActivate {
  
    constructor(
      private userService: UserService,
      private router: Router
    ){}
  
  /**
   * @description Retorna un boolean para indicar si un usuario se encuentra logeado
   * @returns true | false
   */
    public canActivate(){  
      if( this.userService.getCurrentUser() ){
        return true;
      }else{
         this.router.navigate(['']);
         return false;
      }
    }
    
  }