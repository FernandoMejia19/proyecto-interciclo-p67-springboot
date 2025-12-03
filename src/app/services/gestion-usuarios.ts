import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GestionUsuarios {
  private firestore = inject(Firestore);
  private injector = inject(Injector); 

  getUsuarios(): Observable<any[]> {   
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'users');
      return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
    });
  }
  async getUsuarioPorId(uid: string): Promise<any> {
    try {
      const docRef = doc(this.firestore, 'users', uid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      } else {
        console.warn('Usuario no encontrado con UID:', uid);
        return { nombre: 'Usuario eliminado', photoURL: null };
      }
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      return { nombre: 'Error', photoURL: null };
    }
  }
}