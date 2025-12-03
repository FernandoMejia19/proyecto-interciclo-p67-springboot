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
async obtenerMisSolicitudes(uidCliente: string): Promise<any[]> {
  try {
    const solicitudesRef = collection(this.firestore, 'asesorias');
    const q = query(
      solicitudesRef,
      where('uidSolicitante', '==', uidCliente)
    );

    const querySnapshot = await getDocs(q);

    const solicitudes = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        fecha: data['fecha'] || '',
        horaInicio: data['horaInicio'] || '',
        horaFin: data['horaFin'] || '',
        mensaje: data['mensaje'] || data['tema'] || 'Sin tema',
        estado: data['estado'] || 'pendiente',
        nombreDev: data['nombreDev'] || 'Desarrollador',
        linkReunion: data['linkReunion'] || null
      };
    });
    return solicitudes;

  } catch (error) {
    console.error('Error al obtener mis solicitudes:', error);
    return [];
  }
}

}