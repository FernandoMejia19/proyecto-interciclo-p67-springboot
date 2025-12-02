import { Injectable } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: Firestore) {}

  getUserRole(uid: string) {
    const userRef = doc(this.firestore, `users/${uid}`);

    return docData(userRef).pipe(
      map((data: any) => data?.role || null)
    );
  }
}
