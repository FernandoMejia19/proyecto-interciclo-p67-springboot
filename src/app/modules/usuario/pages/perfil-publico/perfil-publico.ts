import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, collection, query, where, getDocs, addDoc, updateDoc } from '@angular/fire/firestore';
import { AuthService } from '../../../../core/services/auth';

@Component({
  selector: 'app-ver-perfil-publico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-publico.html',
  styleUrls: ['./perfil-publico.scss']
})
export class PerfilPublico implements OnInit {

  idProgramador: string = '';
  programador: any = null;
  horariosDisponibles: any[] = [];
  uidUsuarioActual: string = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private firestore: Firestore,
    private authService: AuthService,
    private cdr:ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.idProgramador = this.route.snapshot.paramMap.get('id') || '';
    
    this.authService.currentUser$.subscribe(user => {
      if (user) this.uidUsuarioActual = user.uid;
    });

    if (this.idProgramador) {
      await this.cargarDatosProgramador();
      await this.cargarHorariosDisponibles();
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
    this.horariosDisponibles = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async reservarCita(slot: any) {
    if (!this.uidUsuarioActual) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }

    const confirmar = confirm(`¿Confirmar reserva para el ${slot.fecha} a las ${slot.horaInicio}?`);
    if (!confirmar) return;

    try {
      await addDoc(collection(this.firestore, 'asesorias'), {
        uidDev: this.idProgramador,
        uidSolicitante: this.uidUsuarioActual,
        nombreSolicitante: 'Cliente', 
        tema: 'Asesoría General', 
        fecha: slot.fecha,
        horaInicio: slot.horaInicio,
        horaFin: slot.horaFin,
        estado: 'pendiente' 
      });

      const slotRef = doc(this.firestore, 'disponibilidad', slot.id);
      await updateDoc(slotRef, { estado: 'reservado' });

      alert('¡Solicitud enviada! El programador debe aceptarla.');
      
      this.cargarHorariosDisponibles();

    } catch (error) {
      console.error(error);
      alert('Error al reservar');
    }
  }
}