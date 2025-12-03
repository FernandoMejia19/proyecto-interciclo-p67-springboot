import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { authState } from '@angular/fire/auth';
import { Observable, take } from 'rxjs';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { createStorageRef } from '@angular/fire/compat/storage';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<User | null>;

  constructor(private auth: Auth,private firestore:Firestore,
    private storage: Storage = inject(Storage)
    
  ) {
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
async subirFotoPerfil(file: File, uid: string): Promise<string> {
    const filePath = `users/${uid}/avatar.jpg`;
    const storageRef = ref(this.storage, filePath);

    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.error('Error al subir foto:', error);
      throw error;
    }
  }
  async getCurrentUser() {
  return await this.currentUser$.pipe(take(1)).toPromise();
}
}
