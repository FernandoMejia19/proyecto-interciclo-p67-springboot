import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {

    // Si está logueado → deja pasar
    if (this.authService.estaLogeado()) {
      return true;
    }

    // Si NO está logueado → redirige al login
    return this.router.createUrlTree(['/login']);
  }
}
