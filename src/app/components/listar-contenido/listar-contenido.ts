import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GestionProyectos } from '../../services/gestion-proyectos';
import { GestionUsuarios } from '../../services/gestion-usuarios';
import { Proyecto, Usuario } from '../../../models/entitys';
import { combineLatest } from 'rxjs';

// Interfaz extendida para proyectos con info del usuario
interface ProyectoConUsuario extends Proyecto {
  usuarioNombre: string;
  usuarioFoto?: string;
}

@Component({
  selector: 'app-listar-contenido',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listar-contenido.html',
  styleUrl: './listar-contenido.scss',
})
export class ListarContenido implements OnInit {

  proyectos: ProyectoConUsuario[] = [];
  usuarios: Usuario[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(
    private proyectosService: GestionProyectos,
    private usuariosService: GestionUsuarios,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    combineLatest([
      this.proyectosService.getProyectos(),
      this.usuariosService.getUsuarios()
    ]).subscribe({
      next: ([proyectos, usuarios]) => {
        this.usuarios = usuarios;

        this.proyectos = proyectos.map(p => {
          let usuarioNombre = 'Desconocido';
          let usuarioFoto = undefined;

          // Si programador es un objeto (viene completo del backend)
          if (p.programador && typeof p.programador === 'object') {
            usuarioNombre = p.programador.nombre || 'Desconocido';
            usuarioFoto = p.programador.foto;
          }
          // Si programador es un ID (número)
          else if (typeof p.programador === 'number') {
            const usuarioEncontrado = usuarios.find(u => u.id === p.programador.id);
            if (usuarioEncontrado) {
              usuarioNombre = usuarioEncontrado.nombre;
              usuarioFoto = usuarioEncontrado.foto;
            }
          }

          return {
            ...p,
            usuarioNombre,
            usuarioFoto
          };
        });

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
        this.error = 'No se pudieron cargar los proyectos';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  verProyecto(id: number): void {
    this.router.navigate(['/proyecto', id]);
  }

  verPerfilProgramador(idProgramador: number | Usuario): void {
    const id = typeof idProgramador === 'number' 
      ? idProgramador 
      : idProgramador.id;
    
    this.router.navigate(['/ver-programador', id]);
  }

  obtenerIdProgramador(programador: any): number {
    return typeof programador === 'number' ? programador : programador?.id;
  }
}