import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, authState, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth'; // 👈 TODO DESDE AQUÍ
import { Observable, take } from 'rxjs';
import { Firestore, doc, getDoc, setDoc,docData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) {
    this.currentUser$ = authState(this.auth);
  }

  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      
      const credential = await signInWithPopup(this.auth, provider);
      
      const userRef = doc(this.firestore, 'users', credential.user.uid);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: credential.user.email,
          nombre: credential.user.displayName,
          photoURL: credential.user.photoURL,
          role: 'user', 
          uid: credential.user.uid
        });
      }
      
      return credential;
    } catch (error) {
      console.error("Error en loginWithGoogle:", error);
      throw error;
    }
  }

  register(email: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, email, pass);
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
      return docSnap.data()['role']; 
    } else {
      return 'user';
    }
  }

  async getUserProfile(uid: string) {
    const docRef = doc(this.firestore, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
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
  async getUserFirestoreData(uid: string) {
  const refUser = doc(this.firestore, 'users', uid);
  const snap = await getDoc(refUser);

  if (snap.exists()) {
    return snap.data();
  }
  return null;
}
getUserFirestoreData$(uid: string) {
  const refUser = doc(this.firestore, 'users', uid);
  return docData(refUser, { idField: 'uid' });
}
  async getCurrentUser() {
    return await this.currentUser$.pipe(take(1)).toPromise();
  }
}