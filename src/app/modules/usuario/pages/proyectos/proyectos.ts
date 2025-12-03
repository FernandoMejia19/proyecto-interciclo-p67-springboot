import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router'; // ← ¡AGREGA ESTO!
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { CommonModule } from '@angular/common';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-proyectos',
  imports: [CommonModule],
  templateUrl: './proyectos.html',
  styleUrl: './proyectos.scss',
})
export class Proyectos {
  proyectos: any[] = [];

  constructor(
    private proyectosService: GestionProyectos,
    private usuariosService: GestionUsuarios,
    private cdr: ChangeDetectorRef,
    private router: Router  // ← Inyecta Router
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.proyectosService.getProyectos(),
      this.usuariosService.getUsuarios()
    ]).subscribe(([proyectos, usuarios]) => {
      this.proyectos = proyectos.map(p => {
        const usuarioEncontrado = usuarios.find(u => u.id === p.creador);
        return {
          ...p,
          usuarioNombre: usuarioEncontrado ? usuarioEncontrado.nombre : 'Desconocido',
          usuarioPhoto: usuarioEncontrado?.photoURL || null
        };
      });
      this.cdr.detectChanges();
    });
  }

  // ← MÉTODO NUEVO: abre el detalle del proyecto
  verDetalleProyecto(proyectoId: string) {
    this.router.navigate(['/proyecto', proyectoId]);
  }

  // ← Para imágenes rotas
  onImgError(event: any) {
    event.target.src = 'assets/default-project.jpg';
  }
}