import { Injectable } from '@angular/core';
import { AngularFirestore, QuerySnapshot, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
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

}
