import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const usuario = this.authService.getUsuarioLogeado();

    // No logueado
    if (!usuario) {
      this.router.navigate(['/login']);
      return false;
    }

    const rolesPermitidos = route.data['roles'] as string[];

    // Si no se definen roles, dejar pasar
    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }

    // Validar rol
    if (rolesPermitidos.includes(usuario.rol)) {
      return true;
    }

    console.warn(
      `Acceso denegado → Rol requerido: ${rolesPermitidos.join(', ')} | Rol actual: ${usuario.rol}`
    );

    this.router.navigate(['/forbidden']);
    return false;
  }
}
