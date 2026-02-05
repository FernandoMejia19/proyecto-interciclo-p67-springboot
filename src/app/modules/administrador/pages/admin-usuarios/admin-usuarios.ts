import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../../../../models/entitys';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { forkJoin } from 'rxjs';
import { GestionAsesorias } from '../../../../services/gestion-asesorias';
import { GestionProyectos } from '../../../../services/gestion-proyectos';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.scss'
})
export class AdminUsuarios implements OnInit {

  usuarios: any[] = [];
  loading = false;
  errorMsg = '';
  reporte = {
  proyectosTotales: 0,
  asesorias: {
    totales: 0,
    aceptadas: 0,
    pendientes: 0,
    rechazadas: 0
  }
};

loadingReporte = false;


  // Modal crear usuario
  modalCrearAbierto = false;

  nuevoUsuario: Partial<Usuario> & { password?: string } = {
    nombre: '',
    email: '',
    rol: 'user',
    ciudad: '',
    pais: '',
    descripcion: '',
    github: '',
    linkedin: '',
    celular: ''
  };

  constructor(private gestionUsuarios: GestionUsuarios,
    private gestionProyectos: GestionProyectos, 
    private gestionAsesorias: GestionAsesorias,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarReporteGeneral();
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    this.gestionUsuarios.getUsuarios().subscribe({
      next: data => {
        this.usuarios = data.map(u => ({
          ...u,
          editando: false,
          nuevoNombre: u.nombre,
          nuevoRol: u.rol
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.errorMsg = 'Error al cargar usuarios';
        this.loading = false;
      }
      
    });
  }
cargarReporteGeneral() {
  this.loadingReporte = true;
  this.gestionAsesorias.obtenerEstadisticasReporte().subscribe({
    next: (stats) => {
      console.log('ASESORIAS STATS:', stats);

      this.reporte.asesorias.totales = stats.totales;
      this.reporte.asesorias.aceptadas = stats.aceptadas;
      this.reporte.asesorias.pendientes = stats.pendientes;
      this.reporte.asesorias.rechazadas = stats.rechazadas;

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error asesorías stats:', err);
    }
  });
  this.gestionProyectos.obtenerConteoTotal().subscribe({
    next: (total) => {
      console.log('TOTAL PROYECTOS:', total); // 👈 clave
      this.reporte.proyectosTotales = total;
      this.loadingReporte = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al obtener conteo de proyectos:', err);
      this.loadingReporte = false;
    }
  });
}


  activarEdicion(u: any) {
    u.editando = true;
    u.nuevoNombre = u.nombre;
    u.nuevoRol = u.rol;
  }

  cancelarEdicion(u: any) {
    u.editando = false;
    u.nuevoNombre = u.nombre;
    u.nuevoRol = u.rol;
  }
exportarPDF() {
  const element = document.getElementById('reportePDF');

  if (!element) return;

  html2canvas(element, {
    scale: 2, // mejor calidad
    useCORS: true
  }).then(canvas => {
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.setFontSize(14);
    pdf.text('Reporte General del Sistema', 14, 15);

    pdf.addImage(imgData, 'PNG', 10, 25, pdfWidth - 20, pdfHeight);

    pdf.save('reporte-general.pdf');
  });
}

  guardarCambios(u: any) {
    this.gestionUsuarios.actualizarParcial(u.id, {
      nombre: u.nuevoNombre,
      rol: u.nuevoRol
    }).subscribe({
      next: () => {
        u.editando = false;
        this.cargarUsuarios();
      },
      error: () => alert('Error al actualizar usuario')
    });
  }

  eliminarUsuario(id: number) {
    if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    this.gestionUsuarios.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: () => alert('Error al eliminar usuario')
    });
  }

  abrirCrearUsuario() {
    this.modalCrearAbierto = true;
    this.nuevoUsuario = {
      nombre: '',
      email: '',
      rol: 'user'
    };
  }

  cerrarCrearUsuario() {
    this.modalCrearAbierto = false;
  }

  crearUsuario() {
    if (!this.nuevoUsuario.nombre || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    this.gestionUsuarios.crearUsuario(this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario creado correctamente');
        this.modalCrearAbierto = false;
        this.cargarUsuarios();
      },
      error: err => {
        console.error(err);
        alert('Error al crear usuario');
      }
    });
  }
  
}
