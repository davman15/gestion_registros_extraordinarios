import { query } from '@angular/animations';
import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { grep } from 'jquery';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SacardatosService {

  constructor(private firestore: AngularFirestore) { }

  getTotalGastos(): Observable<number> {
    const eventosCollection: AngularFirestoreCollectionGroup<any> = this.firestore.collectionGroup('eventos');
    return eventosCollection.valueChanges().pipe(
      map((eventos: any[]) => {
        const totalGastos: number = eventos.reduce((total, evento) => total + Number(evento.total.substring(0, evento.total.length - 1)), 0);
        return totalGastos;
      })
    );
  }

  async obtenerNombres(): Promise<{ [key: string]: string }> {
    const nombres: { [key: string]: string } = {};
    await this.firestore.collection('usuarios').get().forEach((query) => {
      query.forEach((doc) => {
        const dato: any = doc.data();
        nombres[dato.uid] = dato.displayName;
      });
    });
    return nombres;
  }

  async obtenerEventosAgrupadosPorItem(uid: string): Promise<any[]> {
    const querySnapshot = await this.firestore
      .collection(`usuarios/${uid}/eventos`)
      .ref.orderBy('item') // Ordena los documentos por el campo "item"
      .get();

    const grupos: any[] = []; // Array para almacenar los grupos

    // Agrupa los documentos por el campo "item"
    querySnapshot.docs.forEach(doc => {
      const objeto: any = doc.data()
      const item = objeto.item;
      const grupo = grupos.find(g => g.item === item);
      if (grupo) {
        grupo.eventos.push(doc.data());
      } else {
        grupos.push({
          item: item,
          eventos: [doc.data()]
        });
      }
    });
    return grupos;
  }
}