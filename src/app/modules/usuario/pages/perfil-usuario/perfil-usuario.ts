import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { AuthService } from '../../../../core/services/auth'; 
import { Router } from '@angular/router'; 
import { Firestore, collection, query, where, getDocs, doc, deleteDoc } from '@angular/fire/firestore';
import { MisCitasComponent } from '../agendar-acesoria/agendar-acesoria';
import { AdminUsuarios } from '../../../administrador/pages/admin-usuarios/admin-usuarios';

@Component({
  selector: 'app-perfil-usuario',
  standalone: true,
  imports: [CommonModule, MisCitasComponent, AdminUsuarios], 
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.scss',
})
export class PerfilUsuario implements OnInit {

  perfil: any = null;
  proyectos: any[] = []; 
  loading: boolean = true;
  seccionActiva: string = 'proyectos';
  isAdmin: boolean = false;

  toast = {
    mostrar: false,
    mensaje: '',
    tipo: '' as 'success' | 'error'
  };

  confirmData = {
    mostrar: false,
    mensaje: '',
    idProyecto: null as string | null
  };
  toastPendiente: any = null;
  toastVisible: boolean = false;
  constructor(
    private authService: AuthService,
    private firestore: Firestore,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    const state = history.state;

if (state.toast) {
  this.toastPendiente = state.toast;

  // Limpia para que NO se vuelva a mostrar al refrescar
  history.replaceState({}, '');
}

  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.perfil = await this.authService.getUserProfile(user.uid);

        if (this.perfil) {
          this.perfil.email = user.email;
          this.perfil.photoURL = user.photoURL || this.perfil.photoURL;
          this.isAdmin = this.perfil.role === 'admin';
        }

        await this.obtenerMisProyectos(user.uid);
      }
      if (this.toastPendiente) {
      this.mostrarToast(
        this.toastPendiente.mensaje,
        this.toastPendiente.tipo
      );
      this.toastPendiente = null;
    }

    this.loading = false;
    this.cdr.detectChanges();
  });
  }

  crearNuevoProyecto() {
    this.router.navigate(['/crear-proyecto']);
  }
  
  cambiarSeccion(seccion: string) {
    this.seccionActiva = seccion;
  }
  

  async obtenerMisProyectos(uid: string) {
    try {
      const proyectosRef = collection(this.firestore, 'proyectos');
      const q = query(proyectosRef, where('creador', '==', uid));
      const querySnapshot = await getDocs(q);

      this.proyectos = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error al obtener proyectos", error);
    }
  }

  eliminarProyecto(idProyecto: string) {
    this.pedirConfirmacion("¿Seguro deseas eliminar este proyecto?", idProyecto);
  }

  editarProyecto(idProyecto: string) {
    this.router.navigate(['/editar-proyecto', idProyecto]);
  }

  tieneContactos(): boolean {
    return !!(
      this.perfil?.contactos &&
      (this.perfil.contactos.facebook ||
        this.perfil.contactos.whatsapp ||
        this.perfil.contactos.instagram ||
        this.perfil.contactos.linkedin)
    );
  }

  pedirConfirmacion(mensaje: string, id: string) {
    this.confirmData = {
      mostrar: true,
      mensaje,
      idProyecto: id
    };
  }

  async eliminarProyectoFinal(idProyecto: string) {
    try {
      const docRef = doc(this.firestore, 'proyectos', idProyecto);
      await deleteDoc(docRef);

      this.proyectos = this.proyectos.filter(p => p.id !== idProyecto);
      this.mostrarToast('Proyecto eliminado correctamente', 'success');

    } catch (error) {
      this.mostrarToast('Hubo un error al eliminar', 'error');
    }

    this.cdr.detectChanges();
  }

  confirmarAccion() {
    const id = this.confirmData.idProyecto;
    this.confirmData.mostrar = false;

    if (id) this.eliminarProyectoFinal(id);
  }

  cancelarAccion() {
    this.confirmData.mostrar = false;
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
  this.toast.mostrar = true;
  this.toast.mensaje = mensaje;
  this.toast.tipo = tipo;

  setTimeout(() => {
    this.toast.mostrar = false;
    this.cdr.detectChanges();
  }, 2500);
}



  irAEditarPerfil() {
    this.router.navigate(['/editar-perfil']);
  }
}
