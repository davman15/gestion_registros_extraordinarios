import { ChangeDetectorRef, Component } from '@angular/core';
import { AngularFirestore, QuerySnapshot, AngularFirestoreCollectionGroup, DocumentData, QueryDocumentSnapshot } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import { SacardatosService } from 'src/app/servicios/sacardatos.service';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css']
})
export class InformesComponent {
  nombres: any;
  eventosPorUsuario: any;
  bautismosPorUsuario: any;
  usuarioSeleccionado: string = "";
  pastorNombre: string = "";
  arrayColumnas: any;

  constructor(private firestore: AngularFirestore, private servicio: SacardatosService, private cd: ChangeDetectorRef) { }
  ngOnInit() {
    // Consultar los usuarios
    this.servicio.obtenerNombres().then((nombres) => {
      this.usuarioSeleccionado = "-- Seleccione un pastor --";
      this.nombres = nombres;
    });

    this.cargarArray()
  }

  cargarArray() {
    this.arrayColumnas = this.servicio.cargarItems();
  }

  async onSelectUsuario(usuario: string) {
    try {
      const eventos = await this.servicio.obtenerEventosAgrupadosPorMes(usuario);
      const bautismos = await this.servicio.obtenerBautismosAgrupadosPorMes(usuario);
      const nombrePastor = await this.servicio.obtenerNombrePastor(usuario);
      this.eventosPorUsuario = eventos;
      this.bautismosPorUsuario = bautismos;
      this.pastorNombre = nombrePastor;

    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }
}