import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionAsesorias } from '../../../../services/gestion-asesorias';
import { AuthService } from '../../../../core/services/auth';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import Swal from 'sweetalert2';
import { ReservaAsesoria } from '../../../../../models/entitys';
import { forkJoin } from 'rxjs';

// Interfaz para mantener compatibilidad con tu HTML
interface SolicitudUI {
  id: number;
  nombreDev?: string;
  nombreSolicitante?: string;
  mensaje: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: string;
}

interface CitaAgenda {
  id: number;
  nombreSolicitante: string;
  mensaje: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  linkReunion?: string;
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agendar-acesoria.html',
  styleUrl: './agendar-acesoria.scss',
})
export class MisCitasComponent implements OnInit {

  @Input() esSolicitante: boolean = false;
  esCliente: boolean = false;

  idUsuario: number = 0;
  solicitudes: SolicitudUI[] = [];
  misSolicitudes: SolicitudUI[] = [];
  agenda: CitaAgenda[] = [];

  fechaSeleccionada = '';
  horaInicio = '';
  horaFin = '';
  guardandoHorario = false;

  constructor(
    private gestionAsesorias: GestionAsesorias,
    private gestionUsuarios: GestionUsuarios,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.esCliente = this.esSolicitante;

    const usuarioActual = this.authService.getUsuarioLogeado();
    
    if (!usuarioActual) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes iniciar sesión'
      });
      return;
    }

    this.idUsuario = usuarioActual.id;
    this.cargarDatosSegunRol();
  }

  cargarDatosSegunRol() {
    if (this.esCliente) {
      this.cargarMisSolicitudes();
    } else {
      this.cargarSolicitudesPendientes();
      this.cargarAgendaConfirmada();
    }
  }

  cargarMisSolicitudes() {
  this.gestionAsesorias.obtenerPorSolicitante(this.idUsuario).subscribe({
    next: (reservas: any[]) => {

      if (reservas.length === 0) {
        this.misSolicitudes = [];
        this.cdr.detectChanges();
        return;
      }

      const observables = reservas.map(r =>
        this.gestionUsuarios.getUsuario(r.programador_id)
      );

      forkJoin(observables).subscribe(programadores => {
        this.misSolicitudes = reservas.map((r, i) => ({
          id: r.id,
          nombreDev: programadores[i]?.nombre || 'Desarrollador',
          mensaje: r.motivo,
          fecha: 'Pendiente',
          horaInicio: 'Pendiente',
          horaFin: 'Pendiente',
          estado: r.estado
        }));
        this.cdr.detectChanges();
      });
    }
  });
}
cargarSolicitudesPendientes() {
  this.gestionAsesorias.obtenerPorProgramador(this.idUsuario).subscribe({
    next: (reservas: any[]) => {

      const pendientes = reservas.filter(r => r.estado === 'PENDIENTE');

      if (pendientes.length === 0) {
        this.solicitudes = [];
        this.cdr.detectChanges();
        return;
      }

      const observables = pendientes.map(r =>
        this.gestionUsuarios.getUsuario(r.solicitante_id)
      );

      forkJoin(observables).subscribe(solicitantes => {
        this.solicitudes = pendientes.map((r, i) => ({
          id: r.id,
          nombreSolicitante: solicitantes[i]?.nombre || 'Cliente',
          mensaje: r.motivo,
          fecha: 'Pendiente',
          horaInicio: 'Pendiente',
          horaFin: 'Pendiente',
          estado: r.estado
        }));
        this.cdr.detectChanges();
      });
    }
  });
}
cargarAgendaConfirmada() {
  this.gestionAsesorias.obtenerPorProgramador(this.idUsuario).subscribe({
    next: (reservas: any[]) => {
      const confirmadas = reservas.filter(r => r.estado === 'CONFIRMADA');

      if (confirmadas.length === 0) {
        this.agenda = [];
        this.cdr.detectChanges();
        return;
      }

      // Usamos el endpoint de detalle para traer fecha y hora reales
      const observables = confirmadas.map(r => 
        this.gestionAsesorias.obtenerDetalle(r.id)
      );

      forkJoin(observables).subscribe((detalles: any[]) => {
        this.agenda = detalles.map(d => ({
          id: d.id,
          nombreSolicitante: d.solicitante?.nombre || 'Cliente',
          mensaje: d.motivo,
          fecha: d.fecha,      // Dato real del backend
          horaInicio: d.hora,  // Dato real del backend
          horaFin: this.calcularHoraFin(d.hora) // Función auxiliar
        }));
        this.cdr.detectChanges();
      });
    }
  });
}
responder(idCita: number, decision: 'aceptada' | 'rechazada') {

  const estado =
    decision === 'aceptada' ? 'CONFIRMADA' : 'CANCELADA';

  this.gestionAsesorias.cambiarEstado(idCita, estado).subscribe({
    next: () => {
      Swal.fire(
        estado === 'CONFIRMADA'
          ? 'Cita confirmada'
          : 'Solicitud rechazada'
      );
      this.cargarDatosSegunRol();
    },
    error: () => {
      Swal.fire('Error al procesar la solicitud');
    }
  });
}


  agregarDisponibilidad() {
    if (!this.fechaSeleccionada || !this.horaInicio || !this.horaFin) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor completa todos los campos'
      });
      return;
    }

    if (this.horaInicio >= this.horaFin) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La hora de fin debe ser mayor a la hora de inicio'
      });
      return;
    }

    this.guardandoHorario = true;

    const disponibilidad = {
      idProgramador: this.idUsuario,
      fecha: this.fechaSeleccionada,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin
    };

    this.gestionAsesorias.crearDisponibilidad(disponibilidad).subscribe({
      next: () => {
        Swal.fire('Horario agregado');
        
        this.fechaSeleccionada = '';
        this.horaInicio = '';
        this.horaFin = '';
        
        this.guardandoHorario = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al agregar horario:', err);
        Swal.fire('Error al agregar horario');
        this.guardandoHorario = false;
      }
    });
  }
  calcularHoraFin(hora: string): string {
  if (!hora) return '';
  const h = parseInt(hora.split(':')[0]);
  return `${(h + 1).toString().padStart(2, '0')}:00`;
}
}