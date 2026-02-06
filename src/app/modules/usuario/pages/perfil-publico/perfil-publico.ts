import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { FormsModule } from '@angular/forms'; 
import Swal from 'sweetalert2';
import { Proyecto, Usuario } from '../../../../../models/entitys';
import { GestionProyectos } from '../../../../services/gestion-proyectos';
import { GestionAsesorias } from '../../../../services/gestion-asesorias';
import { GestionUsuarios } from '../../../../services/gestion-usuarios';
import { GestionNotificacion } from '../../../../services/gestion-notificacion';

@Component({
  selector: 'app-ver-perfil-publico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-publico.html',
  styleUrls: ['./perfil-publico.scss']
})
export class PerfilPublico implements OnInit {

  idProgramador: number = 0;
  programador: Usuario | null = null;
  horariosDisponibles: any[] = [];
  idUsuarioActual: number = 0;
  loading = true;
  proyectos: Proyecto[] = [];
  fechasExpandidas: { [key: string]: boolean } = {};
  
  modalVisible: boolean = false;
  slotSeleccionado: any = null;
  motivoAsesoria: string = '';
  enviando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private proyectoService: GestionProyectos,
    private gestionAsesorias: GestionAsesorias,
    private gestionUsuarios: GestionUsuarios,
    private notificacionService:GestionNotificacion,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.idProgramador = id ? parseInt(id, 10) : 0;
    
    const usuarioActual = this.authService.getUsuarioLogeado();
    if (usuarioActual) {
      this.idUsuarioActual = usuarioActual.id;
    }

    if (this.idProgramador) {
      this.cargarDatosProgramador();
      this.cargarHorariosDisponibles();
      this.cargarProyectos();
    }
  }

  cargarDatosProgramador() {
    this.gestionUsuarios.getUsuario(this.idProgramador).subscribe({
      next: (usuario) => {
        this.programador = usuario;
        console.log('Usuario completo:', usuario);
        console.log("url foto"+usuario.foto)
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar programador:', err);
        Swal.fire('Error', 'No se pudo cargar el perfil del programador', 'error');
        this.loading = false;
      }
    });
  }

  cargarHorariosDisponibles() {
  this.loading = true;
  this.gestionAsesorias.obtenerAsesoriasPorProgramador(this.idProgramador).subscribe({
    next: (asesorias) => {
      this.horariosDisponibles = []; // Limpiamos
      
      if (asesorias.length === 0) {
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }

      // Por cada "Asesoria" (fecha), buscamos sus horas
      asesorias.forEach(asesoria => {
        this.gestionAsesorias.obtenerHorasDisponibles(asesoria.id).subscribe({
          next: (horas) => {
            const horasMapeadas = horas.map(h => ({
              id: h.id, // id de la hora
              fecha: asesoria.fecha,
              horaInicio: h.hora,
              // Calculamos fin asumiendo 1 hora de duración (puedes ajustarlo)
              horaFin: this.convertirAFormato(this.convertirAHoras(h.hora) + 1),
              idProgramador: this.idProgramador,
              idAsesoria: asesoria.id,
              idHora: h.id
            }));

            this.horariosDisponibles = [...this.horariosDisponibles, ...horasMapeadas];
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      });
    },
    error: (err) => {
      console.error('Error al cargar asesorias:', err);
      this.loading = false;
    }
  });
}

  desglosarHorarios(horarios: any[]) {
    const resultado: any[] = [];
    horarios.forEach(h => {
      let inicio = this.convertirAHoras(h.horaInicio);
      let fin = this.convertirAHoras(h.horaFin);

      while (inicio < fin) {
        const siguiente = inicio + 1;
        resultado.push({
          id: h.id,
          fecha: h.fecha,
          horaInicio: this.convertirAFormato(inicio),
          horaFin: this.convertirAFormato(siguiente),
          idProgramador: h.idProgramador,
          idAsesoria: h.idAsesoria,
          idHora: h.idHora
        });
        inicio = siguiente;
      }
    });

    return resultado;
  }

  convertirAHoras(hora: string): number {
    return parseInt(hora.split(':')[0], 10);
  }

  convertirAFormato(hora: number): string {
    return hora.toString().padStart(2, '0')+":00";
  }

  agruparPorFecha(horarios: any[]): any[] {
    const grupos: any = {};
    
    horarios.forEach(slot => {
      if (!grupos[slot.fecha]) {
        grupos[slot.fecha] = {
          fecha: slot.fecha,
          horarios: []
        };
      }
      grupos[slot.fecha].horarios.push(slot);
    });
    
    return Object.values(grupos).sort((a: any, b: any) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
  }

  formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const opciones: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  formatearFechaCorta(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  getDiaSemana(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return dias[fecha.getDay()];
  }

  alternarFecha(fecha: string) {
    this.fechasExpandidas[fecha] = !this.fechasExpandidas[fecha];
  }

  estaExpandida(fecha: string): boolean {
    return this.fechasExpandidas[fecha] || false;
  }

  abrirModalReserva(slot: any) {
    if (!this.idUsuarioActual) {
      Swal.fire("Debes iniciar sesión para reservar.");
      this.router.navigate(['/login']);
      return;
    }
    
    this.slotSeleccionado = slot;
    this.motivoAsesoria = '';
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
    this.slotSeleccionado = null;
    this.motivoAsesoria = '';
    this.enviando = false;
  }

  confirmarReserva() {
    console.log(this.programador?.email)
    console.log(this.idProgramador)
    console.log(this.idUsuarioActual)
  if (!this.motivoAsesoria.trim()) {
    Swal.fire("Por favor, ingresa el motivo de la asesoría.");
    return;
  }

  this.enviando = true;
  const usuarioActual = this.authService.getUsuarioLogeado(); // Obtenemos datos del solicitante

  const reserva = {
    motivo: this.motivoAsesoria.trim(),
    estado: 'PENDIENTE',
    asesoria_id: this.slotSeleccionado.idAsesoria,
    hora_asesoria_id: this.slotSeleccionado.idHora,
    solicitante_id: this.idUsuarioActual,
    programador_id: this.idProgramador
  };

  this.gestionAsesorias.crearReserva(reserva).subscribe({
    next: () => {
      // --- LÓGICA DE NOTIFICACIONES ---
      
      // 1. Notificar al Programador
      if (this.programador?.email) {
        const descProg = 'Hola '+this.programador.nombre+', tienes una nueva solicitud de asesoría de '+usuarioActual?.nombre+'. Motivo: '+this.motivoAsesoria;
        this.notificacionService.enviarNotificacion(this.programador.email, descProg).subscribe();
      }

      // 2. Notificar al Usuario (Solicitante)
      if (usuarioActual?.email) {
        const descUser = `Tu solicitud de asesoría para el día ${this.formatearFecha(this.slotSeleccionado.fecha)} a las ${this.slotSeleccionado.horaInicio} ha sido enviada correctamente.`;
        this.notificacionService.enviarNotificacion(usuarioActual.email, descUser).subscribe();
      }

      // --- FIN LÓGICA NOTIFICACIONES ---

      Swal.fire('✅ ¡Solicitud enviada! El programador será notificado.');
      this.cerrarModal();
      this.cargarHorariosDisponibles();
    },
    error: (err) => {
      console.error('Error al crear reserva:', err);
      Swal.fire('❌ Error al enviar la solicitud');
      this.enviando = false;
      this.cdr.detectChanges();
    }
  });
}


  verProyecto(id: number) {
    this.router.navigate(['/proyecto', id]);
  }

  cargarProyectos() {
    this.proyectoService.obtenerTodos().subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos.filter(p => 
          p.programador?.id === this.idProgramador
        );
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar proyectos:', err);
      }
    });
  }

  volverAtras() {
    window.history.back();
  }

/*
  confirmarReserva() {
  if (!this.motivoAsesoria.trim()) {
    Swal.fire("Por favor, ingresa el motivo de la asesoría.");
    return;
  }

  this.enviando = true;
  const usuarioActual = this.authService.getUsuarioLogeado();

  const reserva = {
    motivo: this.motivoAsesoria.trim(),
    estado: 'PENDIENTE',
    asesoria_id: this.slotSeleccionado.idAsesoria,
    hora_asesoria_id: this.slotSeleccionado.idHora,
    solicitante_id: this.idUsuarioActual,
    programador_id: this.idProgramador
  };

  this.gestionAsesorias.crearReserva(reserva).subscribe({
    next: () => {
      // --- PRUEBA DE NOTIFICACIONES ---
      
      // 1. REEMPLAZO: Cambiamos "this.programador.email" por tu correo real
      const miCorreoPrueba = 'fecholkm19@gmail.com'; 

      const descProg = 'Hola '+this.programador?.nombre+', tienes una nueva solicitud de asesoría. Motivo: '+this.motivoAsesoria;
      
      // Enviamos al correo de prueba
      this.notificacionService.enviarNotificacion(miCorreoPrueba, descProg).subscribe({
        next: () => console.log('Correo al programador enviado correctamente'),
        error: (e) => console.error('Error enviando al programador', e)
      });

      // 2. REEMPLAZO: También puedes enviarte la copia del usuario al mismo correo
      const descUser = `Tu solicitud para el día ${this.formatearFecha(this.slotSeleccionado.fecha)} ha sido enviada.`;
      
      this.notificacionService.enviarNotificacion(miCorreoPrueba, descUser).subscribe({
        next: () => console.log('Correo al usuario enviado correctamente'),
        error: (e) => console.error('Error enviando al usuario', e)
      });

      // --- FIN PRUEBA ---

      Swal.fire('✅ ¡Solicitud enviada! Revisa el correo de prueba.');
      this.cerrarModal();
      this.cargarHorariosDisponibles();
    },
    error: (err) => {
      console.error('Error al crear reserva:', err);
      Swal.fire('❌ Error al enviar la solicitud');
      this.enviando = false;
      this.cdr.detectChanges();
    }
  });
}*/
}