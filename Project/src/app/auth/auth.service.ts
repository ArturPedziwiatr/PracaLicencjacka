import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import { User } from '../model/user';
import { Constants } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate{

  constructor(private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
     const user = JSON.parse(localStorage.getItem(Constants.USER_KEY)) as User;
    if(user && user.email) return true
    else {
      this.router.navigate(["noPermission"]);
      return false;
    }
  }
}
