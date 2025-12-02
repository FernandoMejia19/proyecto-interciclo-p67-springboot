import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GestionUsuarios {
  private firestore = inject(Firestore);
  private injector = inject(Injector); // 1. Inyectamos el Injector

  getUsuarios(): Observable<any[]> {   
    // 2. Envolvemos la llamada a Firebase en el contexto de inyección
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, 'users');
      return collectionData(ref, { idField: 'id' }) as Observable<any[]>;
    });
  }
}