import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';


@Component({
  selector: 'app-detalle-proyecto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalle-proyecto.html',
  styleUrl: './detalle-proyecto.scss'
})
export class DetalleProyectoComponent implements OnInit {
  proyecto: any = null;
  autor: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private usuariosService: GestionUsuarios,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('Proyecto no encontrado');
      this.router.navigate(['/proyectos']);
      return;
    }

    await this.cargarProyecto(id);
    this.loading = false;
    this.cdr.detectChanges();
  }

  async cargarProyecto(id: string) {
  try {
    const docRef = doc(this.firestore, 'proyectos', id);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      alert('Este proyecto no existe o fue eliminado.');
      this.router.navigate(['/proyectos']);
      return;
    }

    this.proyecto = { id: snap.id, ...snap.data() };

    // Cargar autor con async/await
    if (this.proyecto.creador) {
      this.autor = await this.usuariosService.getUsuarioPorId(this.proyecto.creador);
    }
  } catch (error) {
    console.error('Error cargando proyecto:', error);
    alert('Error al cargar el proyecto');
  }
}

  irAlLink() {
    if (this.proyecto.link) {
      window.open(this.proyecto.link, '_blank');
    }
  }

  volver() {
    this.router.navigate(['/proyectos']);
  }
}