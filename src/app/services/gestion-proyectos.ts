import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GestionProyectos {
  private firestore = inject(Firestore);
  private injector = inject(Injector); 


  getAllProyectos(): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const col = collection(this.firestore, 'proyectos');
      return collectionData(col, { idField: 'id' }) as Observable<any[]>;
    });
  }

  getProyectosByUser(uid: string): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const proyectosRef = collection(this.firestore, 'proyectos');
      const q = query(
        proyectosRef,
        where('creador', '==', uid)
      );
      return collectionData(q, { idField: 'id' }) as Observable<any[]>;
    });
  }

  getProyectos(): Observable<any[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'proyectos');
      return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
    });
  }
}