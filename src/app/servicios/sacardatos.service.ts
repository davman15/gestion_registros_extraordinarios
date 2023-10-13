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
  arrayColumnas: any;

  cargarItems(): { clave: string, valor: string }[] {
    const arrayItems: { clave: string, valor: string }[] = [
      { clave: 'Cultos', valor: 'Cultos' },
      { clave: 'Espiritual', valor: 'Espiritual' },
      { clave: 'Varias', valor: 'Varias' },
      { clave: 'Ceremonia', valor: 'Ceremonia' },
      { clave: 'Formación', valor: 'Formación' },
      { clave: 'Visitas', valor: 'Visitas' },
      { clave: 'Consejos', valor: 'Consejos' },
      { clave: 'Administración', valor: 'Administración' },
      { clave: 'Reuniones', valor: 'Reuniones' },
      { clave: 'Campaña', valor: 'Campaña' },
      { clave: 'Conferencia', valor: 'Conferencia' },
      { clave: 'Grupo Pequeño', valor: 'Grupo Pequeño' },
      { clave: 'Estudios Biblicos', valor: 'Estudios Biblicos' },
      { clave: 'Misioneras', valor: 'Misioneras' },
      { clave: 'Secretario', valor: 'Secretario' },
      { clave: 'Ancianos', valor: 'Ancianos' },
      { clave: 'Tesorero', valor: 'Tesorero' },
      { clave: 'Redes Sociales', valor: 'Redes Sociales' },
      { clave: 'Gestiones', valor: 'Gestiones' },
      { clave: 'Entrevistas', valor: 'Entrevistas' },
      { clave: 'Sociales', valor: 'Sociales' },
      { clave: 'Regional', valor: 'Regional' },
      { clave: 'Nacional', valor: 'Nacional' },
      { clave: 'Interesados EB', valor: 'Interesados EB' },
      { clave: 'Profesiones', valor: 'Profesiones' },
      { clave: 'Personas Visitadas', valor: 'Personas Visitadas' },
      { clave: 'Visitas Misioneras', valor: 'Visitas Misioneras' }
    ];

    this.arrayColumnas = arrayItems;
    return arrayItems;
  }


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

  async obtenerBautismosAgrupadosPorMes(uid: string, mesElegido: number, anioElegido: number): Promise<any> {
    const querySnapshot = await this.firestore
      .collection(`usuarios/${uid}/bautismos`)
      .ref.where('fechaBautismo', '>=', `${anioElegido}-${mesElegido.toString().padStart(2, '0')}-01`)
      .where('fechaBautismo', '<=', `${anioElegido}-${mesElegido.toString().padStart(2, '0')}-31`)
      .get();

    return querySnapshot.size;
  }

  async obtenerNombrePastor(uid: string, nombrePastor: string): Promise<string> {
    const querySnapshot = await this.firestore
      .collection("usuarios").doc(uid)
      .get().toPromise();

    const datosPastor: any = querySnapshot?.data();
    if (datosPastor == null)
      return nombrePastor;
    else
      return datosPastor.displayName;
  }

  async obtenerEventosDetalladosAgrupadosPorMes(uid: string, mesElegido: number, anioElegido: number): Promise<any[]> {
    //Consulta de eventos que están dentro del rango del mes actual
    const querySnapshot = await this.firestore
      .collection(`usuarios/${uid}/eventos`)
      .ref.where('fechaInicio', '>=', `${anioElegido}-${mesElegido.toString().padStart(2, '0')}-01T00:00:00Z`)
      .where('fechaInicio', '<=', `${anioElegido}-${mesElegido.toString().padStart(2, '0')}-31T23:59:59Z`)
      .get();
    const eventos: any[] = [];
    querySnapshot.docs.forEach(doc => {
      const evento: any = doc.data();
      eventos.push(evento);
    });

    return eventos;
  }

  async obtenerEventosAgrupadosPorMes(uid: string, mesElegido: number, anioElegido: number): Promise<any[]> {
    //Consulta de eventos que están dentro del rango del mes actual
    const querySnapshot = await this.firestore
      .collection(`usuarios/${uid}/eventos`)
      .ref.where('fechaInicio', '>=', `${anioElegido}-${mesElegido.toString().padStart(2, '0')}-01T00:00:00Z`)
      .where('fechaInicio', '<=', `${anioElegido}-${mesElegido.toString().padStart(2, '0')}-31T23:59:59Z`)
      .get();

    const eventos: any[] = []; // Array para almacenar todos los eventos

    // Almacena todos los eventos en el array 'eventos'
    querySnapshot.docs.forEach(doc => {
      const evento: any = doc.data();
      eventos.push(evento);
    });

    const tabla: any = {};
    tabla.acumuladoMes = {}; // Objeto para acumular los valores

    // Itera a través de las columnas y calcula la acumulación
    this.arrayColumnas.forEach((columna: any) => {
      const valorColumna = columna.valor;

      // Calcula la acumulación para la columna actual
      const acumulado = eventos.reduce((total, evento) => {
        if (evento.item === valorColumna) {
          return total + 1;
        }
        return total;
      }, 0);

      // Almacena el valor de acumulación en el objeto 'acumulado'
      tabla.acumuladoMes[valorColumna] = acumulado;
    });

    return tabla;
  }
}