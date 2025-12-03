import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
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

  @Input() esSolicitante: boolean = false;  // Viene del perfil: true = cliente
  esCliente: boolean = false;

  uidUsuario: string = '';
  solicitudes: any[] = [];      // Solo para dev: solicitudes que le hicieron
  misSolicitudes: any[] = [];   // Solo para cliente: solicitudes que él hizo
  agenda: any[] = [];

  fechaSeleccionada = '';
  horaInicio = '';
  horaFin = '';
  guardandoHorario = false;

  constructor(
    private asesoriasService: AsesoriasService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.esCliente = this.esSolicitante;

    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.uidUsuario = user.uid;
        await this.cargarDatosSegunRol();
        this.cdr.detectChanges();
      }
    });
  }

  async cargarDatosSegunRol() {
    if (this.esCliente) {
      // CLIENTE: ve solo las solicitudes que él hizo
      this.misSolicitudes = await this.asesoriasService.obtenerMisSolicitudes(this.uidUsuario);
    } else {
      // DEV: ve solicitudes pendientes + agenda
      this.solicitudes = await this.asesoriasService.obtenerSolicitudesPendientes(this.uidUsuario);
      this.agenda = await this.asesoriasService.obtenerAgenda(this.uidUsuario);
    }
  }

  async agregarDisponibilidad() {
    if (!this.fechaSeleccionada || !this.horaInicio || !this.horaFin) return;

    this.guardandoHorario = true;
    const slot = {
      uidDev: this.uidUsuario,
      fecha: this.fechaSeleccionada,
      horaInicio: this.horaInicio,
      horaFin: this.horaFin,
      estado: 'libre'
    };

    try {
      await this.asesoriasService.crearDisponibilidad(slot);
      alert('Horario agregado');
      this.horaInicio = '';
      this.horaFin = '';
    } catch (err) {
      alert('Error al agregar horario');
    }
    this.guardandoHorario = false;
  }

  async responder(idCita: string, decision: 'aceptada' | 'rechazada') {
    await this.asesoriasService.responderSolicitud(idCita, decision);
    this.cargarDatosSegunRol();
    alert(decision === 'aceptada' ? 'Cita aceptada' : 'Solicitud rechazada');
  }
}