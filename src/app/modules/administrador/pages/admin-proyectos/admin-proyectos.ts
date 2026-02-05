import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { combineLatest } from 'rxjs';
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Proyecto, Usuario } from '../../../../../models/entitys';

// Interfaz extendida para el admin
interface ProyectoConUsuario extends Proyecto {
  usuarioNombre: string;
  tecnologias?: string[]; // Cuando implementes tecnologías
}

@Component({
  selector: 'app-admin-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-proyectos.html',
  styleUrl: './admin-proyectos.scss',
})
export class AdminProyectos implements OnInit {
  
  proyectos: ProyectoConUsuario[] = [];
  usuarios: Usuario[] = [];
  loading: boolean = true;

  constructor(
    private proyectosService: GestionProyectos,
    private usuariosService: GestionUsuarios,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    combineLatest([
      this.proyectosService.getProyectos(),
      this.usuariosService.getUsuarios()
    ]).subscribe({
      next: ([proyectos, usuarios]) => {
        this.usuarios = usuarios;

        this.proyectos = proyectos.map(p => {
          let usuarioNombre = 'Desconocido';
          
          if (p.programador) {
            // Si programador es un objeto con nombre
            if (typeof p.programador === 'object' && 'nombre' in p.programador) {
              usuarioNombre = p.programador.nombre;
            } 
            // Si programador es un ID (número)
            else if (typeof p.programador === 'number') {
              const usuarioEncontrado = usuarios.find(u => u.id === p.programador.id);
              usuarioNombre = usuarioEncontrado?.nombre || 'Desconocido';
            }
          }

          return {
            ...p,
            usuarioNombre,
            tecnologias: [] // Temporal: cuando tengas tecnologías, cárgalas aquí
          };
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar datos:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  editarProyecto(id: number): void {
    this.router.navigate(['/editar-proyecto', id]);
  }

  eliminarProyecto(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.proyectosService.eliminarProyecto(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Eliminado!',
              text: 'El proyecto ha sido eliminado correctamente',
              timer: 2000,
              showConfirmButton: false
            });
            this.cargarDatos(); // Recargar datos
          },
          error: (err) => {
            console.error('Error al eliminar proyecto:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el proyecto'
            });
          }
        });
      }
    });
  }

  verProyecto(id: number): void {
    this.router.navigate(['/proyecto', id]);
  }
}