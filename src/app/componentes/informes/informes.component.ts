import { Component } from '@angular/core';
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
  usuarioSeleccionado: string = "";
  dias: any[] = [];

  constructor(private firestore: AngularFirestore, private servicio: SacardatosService) { }
  ngOnInit() {
    // Consultar los usuarios
    this.servicio.obtenerNombres().then((nombres) => {
      this.usuarioSeleccionado = "-- Seleccione un pastor --";
      this.nombres = nombres;

    });
    const fechaActual = moment();
    const diasEnMes = moment(fechaActual).daysInMonth();

    for (let i = 1; i <= diasEnMes; i++) {
      this.dias.push(moment({ year: fechaActual.year(), month: fechaActual.month(), day: i }).format("D"));
    }
  }
  onSelectUsuario(usuario: string) {
    // Aquí puedes hacer lo que necesites con el valor seleccionado
    this.servicio.obtenerEventosAgrupadosPorItem(usuario).then((array) => {
      this.eventosPorUsuario = array
      console.log(this.eventosPorUsuario);
    });
  }
}