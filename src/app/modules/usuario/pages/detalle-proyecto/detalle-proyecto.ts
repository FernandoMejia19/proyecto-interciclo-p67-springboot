import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import { Proyecto, Usuario } from '../../../../../models/entitys';

@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-proyecto.html',
  styleUrl: './detalle-proyecto.scss'
})
export class DetalleProyectoComponent implements OnInit {
  proyecto?: Proyecto;
  autor?: Usuario;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuariosService: GestionUsuarios,
    private gestionProyectos: GestionProyectos,
    private cdr: ChangeDetectorRef,
    private location: Location
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Proyecto no encontrado'
      });
      this.router.navigate(['/proyectos']);
      return;
    }

    this.cargarProyecto(id);
  }

  cargarProyecto(id: string) {
    const idNum = Number(id);
    
    if (isNaN(idNum)) {
      Swal.fire({
        icon: 'error',
        title: 'ID inválido',
        text: 'El identificador del proyecto no es válido'
      });
      this.router.navigate(['/proyectos']);
      return;
    }

    this.gestionProyectos.obtenerPorId(idNum).subscribe({
      next: (proyecto: Proyecto) => {
        this.proyecto = proyecto;
        
        if (proyecto.programador) {
          this.autor = proyecto.programador;
        }
        
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando proyecto:', error);
        this.loading = false;
        
        Swal.fire({
          icon: 'error',
          title: 'Proyecto no encontrado',
          text: 'Este proyecto no existe o fue eliminado.',
          confirmButtonText: 'Volver a proyectos'
        }).then(() => {
          this.router.navigate(['/proyectos']);
        });
      }
    });
  }

  irAlLink() {
    if (this.proyecto?.linkRepo) {
      window.open(this.proyecto.linkRepo, '_blank');
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Sin repositorio',
        text: 'Este proyecto no tiene un repositorio asociado'
      });
    }
  }

  verPerfilProgramador() {
    if (this.autor?.id || this.proyecto?.programador?.id) {
      const idProgramador = this.autor?.id || this.proyecto?.programador?.id;
      this.router.navigate(['/perfil-publico', idProgramador]);
    }
  }

  volver() {
    this.location.back();
  }
}