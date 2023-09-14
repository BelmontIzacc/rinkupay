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
  
    public canActivate(){  
      
      if( this.userService.getCurrentUser() ){
        return true;
      }else{
         this.router.navigate(['']);
         return false;
      }
      
    }
    
  }