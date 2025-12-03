import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { AsesoriasService } from '../../../../core/services/asesorias';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './agendar-acesoria.html',
  styleUrl: './agendar-acesoria.scss',
})
export class MisCitasComponent implements OnInit {

  uidUsuario: string = '';
  
  solicitudes: any[] = [];
  agenda: any[] = [];


  fechaSeleccionada: string = '';
  horaInicio: string = '';
  horaFin: string = '';
  guardandoHorario = false;

  constructor(
    private asesoriasService: AsesoriasService,
    private authService: AuthService,
    private cdr:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.uidUsuario = user.uid;
        await this.cargarDatos();
      }
      this.cdr.detectChanges();
    });
  }

  async cargarDatos() {
    this.solicitudes = await this.asesoriasService.obtenerSolicitudesPendientes(this.uidUsuario);

    this.agenda = await this.asesoriasService.obtenerAgenda(this.uidUsuario);
  }

  async agregarDisponibilidad() {
    if (!this.fechaSeleccionada || !this.horaInicio || !this.horaFin) {
      alert('Por favor completa la fecha y las horas.');
      return;
    }

    this.guardandoHorario = true;
    
    const nuevoSlot = {
      uidDev: this.uidUsuario,
      fecha: this.fechaSeleccionada,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      estado: 'libre' 
    };

    try {
      await this.asesoriasService.crearDisponibilidad(nuevoSlot);
      alert('Horario disponible agregado correctamente.');
      this.horaInicio = '';
      this.horaFin = '';
    } catch (error) {
      console.error(error);
      alert('Error al guardar horario');
    }
    this.guardandoHorario = false;
  }

  async responder(idCita: string, decision: 'aceptada' | 'rechazada') {
    try {
      await this.asesoriasService.responderSolicitud(idCita, decision);
      this.cargarDatos(); 
      alert(decision === 'aceptada' ? 'Cita agendada con éxito' : 'Solicitud rechazada');
    } catch (error) {
      console.error(error);
    }
  }
}