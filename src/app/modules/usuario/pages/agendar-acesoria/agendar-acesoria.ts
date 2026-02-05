import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionAsesorias } from '../../../../services/gestion-asesorias';
import { AuthService } from '../../../../core/services/auth';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import Swal from 'sweetalert2';
import { ReservaAsesoria } from '../../../../../models/entitys';
import { forkJoin } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { ChartData, ChartType } from 'chart.js';
import { GestionNotificacion } from '../../../../services/gestion-notificacion';


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
  estado: 'aceptada' | 'rechazada' | 'pendiente';
  linkReunion?: string;
}

@Component({
  selector: 'app-mis-citas',
  standalone: true,
  imports: [CommonModule, FormsModule,BaseChartDirective],
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
  // ===== DASHBOARD DEV =====
chartTipo: ChartType = 'pie';

chartData: ChartData<'pie', number[], string> = {
  labels: ['Confirmadas', 'Canceladas', 'Pendientes'],
  datasets: [
    {
      data: [0, 0, 0],
    }
  ]
};
public pieChartType: ChartType = 'pie';

public pieChartData: ChartData<'pie', number[], string> = {
  labels: ['Aceptadas', 'Rechazadas'],
  datasets: [
    {
      data: [0, 0]
    }
  ]
};

totalCount = 0;
aceptadasCount = 0;
rechazadasCount = 0;
pendientesCount = 0;

  fechaSeleccionada = '';
  horaInicio = '';
  horaFin = '';
  guardandoHorario = false;

  constructor(
    private gestionAsesorias: GestionAsesorias,
    private gestionUsuarios: GestionUsuarios,
    private authService: AuthService,
    private notificacionService:GestionNotificacion,
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

  private construirDashboardDev(reservas: any[]) {

  this.aceptadasCount = reservas.filter(r => r.estado === 'CONFIRMADA').length;
  this.rechazadasCount = reservas.filter(r => r.estado === 'CANCELADA').length;
  this.pendientesCount = reservas.filter(r => r.estado === 'PENDIENTE').length;
  this.totalCount = reservas.length;

  this.chartData = {
    labels: ['Confirmadas', 'Canceladas', 'Pendientes'],
    datasets: [
      {
        data: [
          this.aceptadasCount,
          this.rechazadasCount,
          this.pendientesCount
        ]
      }
    ]
  };
}

exportarPDF() {
  const doc = new jsPDF();

  doc.text('Reporte de Asesorías', 14, 15);

  autoTable(doc, {
    startY: 20,
    head: [['Cliente', 'Tema', 'Fecha', 'Hora', 'Estado']],
    body: this.agenda.map(a => [
      a.nombreSolicitante,
      a.mensaje,
      a.fecha,
      `${a.horaInicio} - ${a.horaFin}`,
      a.estado
    ])
  });

  doc.save('reporte-asesorias.pdf');
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
          estado: r.estado?.toUpperCase()
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

      this.construirDashboardDev(reservas);
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
          horaFin: this.calcularHoraFin(d.hora), // Función auxiliar
          estado: 'aceptada' 
        }));
        this.cdr.detectChanges();
      });
    }
  });
}
/*
responder(idCita: number, decision: 'aceptar' | 'rechazar') {
  this.gestionAsesorias.cambiarEstado(idCita, decision).subscribe({
    next: () => {
      // 1. Buscamos el detalle de la cita para saber a quién notificar
      this.gestionAsesorias.obtenerDetalle(idCita).subscribe({
        next: (detalle) => {
          const emailUsuario = detalle.solicitante?.email;
          const nombreProgramador = this.authService.getUsuarioLogeado()?.nombre;

          if (emailUsuario) {
            const estadoTexto = decision === 'aceptar' ? 'ACEPTADA ✅' : 'RECHAZADA ❌';
            const mensaje = `Hola ${detalle.solicitante.nombre}, tu solicitud de asesoría con ${nombreProgramador} ha sido ${estadoTexto}. 
                            Motivo original: ${detalle.motivo}`;

            // 2. Disparamos la notificación al backend de Jakarta (WildFly)
            this.notificacionService.enviarNotificacion(emailUsuario, mensaje).subscribe({
              next: () => console.log('Notificación al usuario enviada con éxito'),
              error: (err) => console.error('Error al enviar notificación', err)
            });
          }
        }
      });

      Swal.fire(
        decision === 'aceptar'
          ? 'Cita confirmada y usuario notificado'
          : 'Solicitud rechazada y usuario notificado'
      );
      this.cargarDatosSegunRol(); 
    },
    error: () => {
      Swal.fire('Error al procesar la solicitud');
    }
  });
}

*/

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

responder(idCita: number, decision: 'aceptar' | 'rechazar') {
  this.gestionAsesorias.cambiarEstado(idCita, decision).subscribe({
    next: () => {
      // --- PRUEBA COMPLETA DE NOTIFICACIÓN DE RESPUESTA ---
      
      // 1. REEMPLAZO: Pon tu correo real aquí para recibir la confirmación
      const miCorreoPrueba = 'fecholkm19@gmail.com'; 
      
      // 2. Definimos el mensaje según la decisión tomada
      const estadoFinal = decision === 'aceptar' ? 'ACEPTADA ✅' : 'RECHAZADA ❌';
      const mensajePrueba = `PRUEBA DE SISTEMA: Tu solicitud de asesoría ha sido ${estadoFinal}. 
      Se ha procesado a través de WildFly en el puerto 8090.`;
      
      // 3. Disparamos la petición al backend de Jakarta
      // Usamos la URL relativa que definimos para el proxy
      this.notificacionService.enviarNotificacion(miCorreoPrueba, mensajePrueba).subscribe({
        next: () => console.log('Notificación de respuesta enviada con éxito'),
        error: (err) => console.error('Error al enviar la notificación desde el Panel', err)
      });
      
      // --- FIN PRUEBA ---
      
      Swal.fire(
        decision === 'aceptar'
        ? 'Cita confirmada (Correo de prueba enviado)'
        : 'Solicitud rechazada (Correo de prueba enviado)'
      );
      
      this.cargarDatosSegunRol(); // Refresca las listas y el dashboard
    },
    error: (err) => {
      console.error('Error al cambiar estado:', err);
      Swal.fire('Error al procesar la solicitud');
    }
  });
}
}