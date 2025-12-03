import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, getDocs, doc, updateDoc, orderBy } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AsesoriasService { 

  constructor(private firestore: Firestore) {}

  async crearDisponibilidad(datos: any) {
    const colRef = collection(this.firestore, 'disponibilidad');
    return await addDoc(colRef, datos);
  }

  async obtenerSolicitudesPendientes(uidDev: string) {
    const colRef = collection(this.firestore, 'asesorias');
    const q = query(
      colRef, 
      where('uidDev', '==', uidDev),
      where('estado', '==', 'pendiente')
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }
  async obtenerAgenda(uidDev: string) {
    const colRef = collection(this.firestore, 'asesorias');
    const q = query(
      colRef, 
      where('uidDev', '==', uidDev),
      where('estado', '==', 'aceptada')

    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  async responderSolicitud(idCita: string, estado: 'aceptada' | 'rechazada') {
    const docRef = doc(this.firestore, 'asesorias', idCita);
    return await updateDoc(docRef, { estado: estado });
  }
}