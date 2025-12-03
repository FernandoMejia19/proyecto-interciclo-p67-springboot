import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, collection, getDocs, doc, updateDoc, deleteDoc, setDoc } from '@angular/fire/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-usuarios.html',
  styleUrl: './admin-usuarios.scss'
})
export class AdminUsuarios implements OnInit {

  usuarios: any[] = [];
  loading: boolean = true;
  errorMsg: string = '';

  // Modal crear usuario
  modalCrearAbierto = false;
  nuevoUsuario: any = {
    nombre: '',
    email: '',
    password: '',
    photoURL: '',
    role: 'user',
    tecnologias: '',
    cargo: '',
    pais: '',
    ciudad: ''
  };
  fotoArchivo: File | null = null;

  private auth = getAuth();
  private storage = getStorage();

  constructor(
    private firestore: Firestore,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    await this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.loading = true;
    try {
      const colRef = collection(this.firestore, 'users');
      const snap = await getDocs(colRef);

      this.usuarios = snap.docs.map(d => ({
        id: d.id,
        ...d.data(),
        editando: false,
        nombreOriginal: d.data()['nombre'] || '',
        nuevoNombre: d.data()['nombre'] || '',
        nuevoRol: d.data()['role'] || 'user'
      }));
    } catch (error: any) {
      console.error("Error cargando usuarios:", error);
      this.errorMsg = 'Error al cargar usuarios: ' + error.message;
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  activarEdicion(usuario: any) {
    usuario.editando = true;
    usuario.nuevoNombre = usuario.nombre || usuario.nuevoNombre || 'Sin nombre';
    usuario.nuevoRol = usuario.role || usuario.rol || 'user';
  }

  async guardarCambios(usuario: any) {
    if (!usuario.nuevoRol || !usuario.nuevoNombre) return;

    try {
      const docRef = doc(this.firestore, 'users', usuario.id);
      await updateDoc(docRef, {
        nombre: usuario.nuevoNombre.trim(),
        role: usuario.nuevoRol
      });

      usuario.nombre = usuario.nuevoNombre.trim();
      usuario.role = usuario.nuevoRol;
      usuario.editando = false;

      alert('Usuario actualizado correctamente');
      this.cdr.detectChanges();
    } catch (error: any) {
      console.error("Error actualizando usuario:", error);
      alert('Error: ' + error.message);
    }
  }

  cancelarEdicion(usuario: any) {
    usuario.editando = false;
    usuario.nuevoNombre = usuario.nombre || '';
    usuario.nuevoRol = usuario.role || 'user';
  }

  async eliminarUsuario(id: string) {
    if (!confirm('¿Seguro que quieres eliminar este usuario?')) return;

    try {
      await deleteDoc(doc(this.firestore, 'users', id));
      this.usuarios = this.usuarios.filter(u => u.id !== id);
      alert('Usuario eliminado');
    } catch (error: any) {
      alert('Error al eliminar: ' + error.message);
    }
  }

  abrirCrearUsuario() {
    this.modalCrearAbierto = true;
    this.nuevoUsuario = {
      nombre: '', email: '', password: '', photoURL: '', role: 'user',
      tecnologias: '', cargo: '', pais: '', ciudad: ''
    };
    this.fotoArchivo = null;
  }

  cerrarCrearUsuario() {
    this.modalCrearAbierto = false;
  }

  subirFoto(event: any) {
    const file = event.target.files[0];
    if (file) this.fotoArchivo = file;
  }

  async crearUsuario() {
  if (!this.nuevoUsuario.nombre?.trim()) return alert('El nombre es obligatorio');
  if (!this.nuevoUsuario.email?.trim()) return alert('El email es obligatorio');
  if (!this.nuevoUsuario.password || this.nuevoUsuario.password.length < 6)
    return alert('Contraseña mínima 6 caracteres');

  const auth = getAuth();
  let uid = '';
  let photoURL = this.nuevoUsuario.photoURL?.trim() || '';

  try {
    const cred = await createUserWithEmailAndPassword(
      auth,
      this.nuevoUsuario.email.trim(),
      this.nuevoUsuario.password
    );
    uid = cred.user.uid;

    if (this.fotoArchivo) {
      const storageRef = ref(this.storage, `users/${uid}/avatar.jpg`);
      await uploadBytes(storageRef, this.fotoArchivo);
      photoURL = await getDownloadURL(storageRef); 
    }

    await setDoc(doc(this.firestore, 'users', uid), {
      uid: uid,
      nombre: this.nuevoUsuario.nombre.trim(),
      email: this.nuevoUsuario.email.trim().toLowerCase(),
      photoURL: photoURL,
      role: this.nuevoUsuario.role || 'user',
      tecnologias: this.nuevoUsuario.tecnologias || '',
      cargo: this.nuevoUsuario.cargo || '',
      pais: this.nuevoUsuario.pais || '',
      ciudad: this.nuevoUsuario.ciudad || '',
      createdAt: new Date(),
      createdByAdmin: true
    });

    await auth.signOut();


    alert('¡Usuario creado correctamente!');
    this.cerrarCrearUsuario();
    await this.cargarUsuarios();

  } catch (error: any) {
    console.error('Error creando usuario:', error);

    if (uid && auth.currentUser?.uid === uid) {
      await auth.currentUser.delete();
      await auth.signOut();
    }

    alert('Error: ' + (error.message || 'No se pudo crear el usuario'));
  }
}
}