import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from "@angular/router";
import { AuthService, LoginResponse } from '../../core/services/auth';
import { GestionUsuarios } from '../../services/gestion-usuarios';

@Component({
  selector: 'app-navbar',
  standalone: true, 
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {

  usuario: LoginResponse | null = null;
  usuarioCompleto: any = null; // Para foto y otros datos
  menuAbierto = false;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private gestionUsuarios: GestionUsuarios
  ) {}

  ngOnInit() {
    // Cargar usuario del localStorage
    this.usuario = this.authService.getUsuarioLogeado();

    // Si hay usuario, cargar sus datos completos (con foto)
    if (this.usuario) {
      this.cargarDatosCompletos(this.usuario.id);
    }

    // Suscribirse a cambios de autenticación
    this.authService.currentUser$.subscribe(user => {
      this.usuario = user;
      if (user) {
        this.cargarDatosCompletos(user.id);
      } else {
        this.usuarioCompleto = null;
      }
    });
  }

  cargarDatosCompletos(userId: number) {
    this.gestionUsuarios.getUsuario(userId).subscribe({
      next: (datos) => {
        this.usuarioCompleto = datos;
      },
      error: (err) => {
        console.error('Error al cargar datos completos del usuario:', err);
      }
    });
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  // Cerrar menú al hacer click fuera
  @HostListener('document:click', ['$event'])
  clickFuera(event: Event) {
    const target = event.target as HTMLElement;
    const clickDentroNav = target.closest('.usuario-container');
    
    if (!clickDentroNav && this.menuAbierto) {
      this.menuAbierto = false;
    }
  }

  logout() {
    this.authService.logout();
    this.menuAbierto = false;
    this.router.navigate(['/login']);
  }

  ingresar() {
    this.router.navigate(['/login']);
  }

  // Getters para el template
  get estaLogueado(): boolean {
    return this.authService.estaLogeado();
  }

  get nombreUsuario(): string {
    return this.usuario?.nombre || 'Usuario';
  }

  get rolUsuario(): string {
    return this.usuario?.rol || '';
  }

  get esAdmin(): boolean {
    return this.usuario?.rol === 'admin';
  }

  get esDev(): boolean {
    return this.usuario?.rol === 'dev';
  }

  get esUser(): boolean {
    return this.usuario?.rol === 'user';
  }

  get fotoUsuario(): string {
    return this.usuarioCompleto?.foto || 
            'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }
}