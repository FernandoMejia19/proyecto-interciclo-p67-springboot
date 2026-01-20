import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../../../core/services/auth';
import { FormsModule } from '@angular/forms'; 
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-perfil-publico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil-publico.html',
  styleUrls: ['./perfil-publico.scss']
})
export class PerfilPublico implements OnInit {

  idProgramador: string = '';
  programador: any = null;
  horariosDisponibles: any[] = [];
  uidUsuarioActual: string = '';
  loading = true;
  proyectos: any[] = [];
  fechasExpandidas: { [key: string]: boolean } = {};
  
  
  modalVisible: boolean = false;
  slotSeleccionado: any = null;
  motivoAsesoria: string = '';
  enviando: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.idProgramador = this.route.snapshot.paramMap.get('id') || '';
    
    this.authService.currentUser$.subscribe(user => {
      if (user) this.uidUsuarioActual = user.uid;
    });
    if (this.idProgramador) {
      await this.cargarDatosProgramador();
      await this.cargarHorariosDisponibles();
      await this.cargarProyectos();
      }
    this.loading = false;
    this.cdr.detectChanges();
  }

  async cargarDatosProgramador() {
    const docRef = doc(this.firestore, 'users', this.idProgramador);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      this.programador = snap.data();
    }
  }

  async cargarHorariosDisponibles() {
    const colRef = collection(this.firestore, 'disponibilidad');
    const q = query(
      colRef, 
      where('uidDev', '==', this.idProgramador),
      where('estado', '==', 'libre')
    );
    
    const snap = await getDocs(q);
    const horariosOriginales = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    this.horariosDisponibles = this.desglosarHorarios(horariosOriginales);
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
          uidDev: h.uidDev
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
    return `${hora.toString().padStart(2, '0')}:00`;
  }

  //agrupar por fecha
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
    
    //ordenar por fecha
    return Object.values(grupos).sort((a: any, b: any) => {
      return new Date(a.fecha).getTime() - new Date(b.fecha).getTime();
    });
  }

  //formatear fecha larga
  formatearFecha(fechaStr: string): string {
    const fecha = new Date(fechaStr);
    const opciones: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    };
    return fecha.toLocaleDateString('es-ES', opciones);
  }

  //fecha corta (para las tarjetas)
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
    if (!this.uidUsuarioActual) {
      Swal.fire("Debes iniciar sesión para reservar.");
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

  async confirmarReserva() {
    if (!this.motivoAsesoria.trim()) {
      Swal.fire("Por favor, ingresa el motivo de la asesoría.");
      return;
    }

    this.enviando = true;
    
    try {
      await addDoc(collection(this.firestore, 'asesorias'), {
        uidDev: this.idProgramador,
        uidSolicitante: this.uidUsuarioActual,
        nombreSolicitante: 'Cliente',
        tema: 'Asesoría General',
        fecha: this.slotSeleccionado.fecha,
        horaInicio: this.slotSeleccionado.horaInicio,
        horaFin: this.slotSeleccionado.horaFin,
        estado: 'pendiente',
        mensaje: this.motivoAsesoria.trim()
      });

      const slotRef = doc(this.firestore, 'disponibilidad', this.slotSeleccionado.id);
      await updateDoc(slotRef, { estado: 'reservado' });

      Swal.fire('✅ ¡Solicitud enviada! El programador será notificado.');
      
      this.cerrarModal();
      await this.cargarHorariosDisponibles();
      
    } catch (error) {
      console.error(error);
      Swal.fire('❌ Error al enviar la solicitud');
    } finally {
      this.enviando = false;
      this.cdr.detectChanges();
    }
  }

  verProyecto(id: string) {
    this.router.navigate(['/proyecto', id]);
  }

  async cargarProyectos() {
    const proyectosRef = collection(this.firestore, 'proyectos');
    const q = query(proyectosRef, where('creador', '==', this.idProgramador));

    const snap = await getDocs(q);
    this.proyectos = snap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  volverAtras() {
    window.history.back();
  }
}