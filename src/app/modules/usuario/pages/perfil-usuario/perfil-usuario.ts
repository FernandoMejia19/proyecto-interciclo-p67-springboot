import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../../../core/services/auth'; 

import { Router } from '@angular/router'; 
import { MisCitasComponent } from '../agendar-acesoria/agendar-acesoria';
import { AdminUsuarios } from '../../../administrador/pages/admin-usuarios/admin-usuarios';
import { Proyecto, Usuario } from '../../../../../models/entitys';
import { GestionProyectos } from '../../../../services/gestion-proyectos';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, MisCitasComponent, AdminUsuarios], 
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.scss',
})
export class PerfilUsuario implements OnInit {

  perfil: Usuario | null = null;
  proyectos: Proyecto[] = []; 
  loading: boolean = true;
  seccionActiva: string = 'proyectos';
  isAdmin: boolean = false;

  toast = {
    mostrar: false,
    mensaje: '',
    tipo: '' as 'success' | 'error'
  };

  confirmData = {
    mostrar: false,
    mensaje: '',
    idProyecto: null as number | null
  };

  toastPendiente: any = null;

  constructor(
    private authService: AuthService,
    private proyectoService: GestionProyectos,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    const state = history.state;

    if (state.toast) {
      this.toastPendiente = state.toast;
      history.replaceState({}, '');
    }
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        // Obtener perfil completo desde el backend
        this.authService.getUserProfile(user.id).subscribe({
          next: (perfil) => {
            this.perfil = perfil;
            this.isAdmin = perfil.rol === 'admin';
            
            // Obtener proyectos del usuario
            this.obtenerMisProyectos(user.id);
          },
          error: (error) => {
            console.error('Error al obtener perfil:', error);
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      } else {
        this.loading = false;
        this.cdr.detectChanges();
      }

      if (this.toastPendiente) {
        this.mostrarToast(
          this.toastPendiente.mensaje,
          this.toastPendiente.tipo
        );
        this.toastPendiente = null;
      }
    });
  }

  crearNuevoProyecto() {
    this.router.navigate(['/crear-proyecto']);
  }
  
  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }

  obtenerMisProyectos(userId: number) {
    this.proyectoService.obtenerTodos().subscribe({
      next: (proyectos) => {
        // Filtrar proyectos del usuario actual
        this.proyectos = proyectos.filter(p => 
          p.programador?.id === userId
        );
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error al obtener proyectos", error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  eliminarProyecto(idProyecto: number) {
    this.pedirConfirmacion("¿Seguro deseas eliminar este proyecto?", idProyecto);
  }

  editarProyecto(idProyecto: number) {
    this.router.navigate(['/editar-proyecto', idProyecto]);
  }

  tieneContactos(): boolean {
    return !!(
      this.perfil?.celular ||
      this.perfil?.facebook ||
      this.perfil?.linkedin
    );
  }

  pedirConfirmacion(mensaje: string, id: number) {
    this.confirmData = {
      mostrar: true,
      mensaje,
      idProyecto: id
    };
  }

  eliminarProyectoFinal(idProyecto: number) {
    this.proyectoService.eliminar(idProyecto).subscribe({
      next: () => {
        this.proyectos = this.proyectos.filter(p => p.id !== idProyecto);
        this.mostrarToast('Proyecto eliminado correctamente', 'success');
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al eliminar:', error);
        this.mostrarToast('Hubo un error al eliminar', 'error');
        this.cdr.detectChanges();
      }
    });
  }

  confirmarAccion() {
    const id = this.confirmData.idProyecto;
    this.confirmData.mostrar = false;

    if (id) this.eliminarProyectoFinal(id);
  }

  cancelarAccion() {
    this.confirmData.mostrar = false;
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.toast.mostrar = true;
    this.toast.mensaje = mensaje;
    this.toast.tipo = tipo;

    setTimeout(() => {
      this.toast.mostrar = false;
      this.cdr.detectChanges();
    }, 2500);
  }

  irAEditarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }
}