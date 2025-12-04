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
  imports: [CommonModule, MisCitasComponent,AdminUsuarios], 
  templateUrl: './perfil-usuario.html',
  styleUrl: './perfil-usuario.scss',
})
export class PerfilUsuario implements OnInit {

  perfil: any = null;
  proyectos: any[] = []; 
  loading = true;
  seccionActiva: string = 'proyectos';
  isAdmin: boolean = false; 

  constructor(
    private authService: AuthService,
    private firestore: Firestore, 
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(async (user) => {
      if (user) {
        this.perfil = await this.authService.getUserProfile(user.uid);
        
        if (this.perfil) {
          this.perfil.email = user.email;
          this.perfil.photoURL = user.photoURL || this.perfil.photoURL;
          this.isAdmin = this.perfil.role === 'admin' || this.perfil.rol === 'admin';
        }

        await this.obtenerMisProyectos(user.uid);
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
      
      this.proyectos = querySnapshot.docs.map(doc => {
        return {
          id: doc.id, 
          ...doc.data()
        }
      });
    } catch (error) {
      console.error("Error al obtener proyectos", error);
    }
  }

  async eliminarProyecto(idProyecto: string) {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este proyecto?');
    if (!confirmar) return;

    try {
      const docRef = doc(this.firestore, 'proyectos', idProyecto);
      await deleteDoc(docRef);
      this.proyectos = this.proyectos.filter(p => p.id !== idProyecto);
      alert('Proyecto eliminado correctamente');
    } catch (error) {
      console.error("Error al eliminar", error);
      alert('Hubo un error al eliminar');
    }
  }

  editarProyecto(idProyecto: string) {
    this.router.navigate(['/editar-proyecto', idProyecto]);
  }
  tieneContactos(): boolean {
  return this.perfil?.contactos && 
        (this.perfil.contactos.facebook || 
          this.perfil.contactos.whatsapp || 
          this.perfil.contactos.instagram || 
          this.perfil.contactos.linkedin);
}

irAEditarPerfil() {
  this.router.navigate(['/editar-perfil']);
}
}