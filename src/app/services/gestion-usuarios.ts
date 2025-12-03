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
  
}