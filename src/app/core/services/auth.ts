import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<User | null>;

  constructor(private auth: Auth,private firestore:Firestore) {
    this.currentUser$ = authState(this.auth);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  getUser() {
    return this.currentUser$; 
  }
  async getUserRole(uid: string): Promise<string> {
  const docRef = doc(this.firestore, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return data['role']; 
  } else {
    return 'user'; 
  }
}
async getUserProfile(uid: string) {
  const docRef = doc(this.firestore, 'users', uid); 
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data(); 
  } else {
    return null;
  }
}
}
