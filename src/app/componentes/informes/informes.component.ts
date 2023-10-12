import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';
import 'moment/locale/es';
import { SacardatosService } from 'src/app/servicios/sacardatos.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

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
  arrayEventosMes: any;
  @ViewChild("tablaResumen", { static: false }) tabla!: ElementRef


  constructor(private firestore: AngularFirestore, private servicio: SacardatosService, private cd: ChangeDetectorRef) { }
  ngOnInit() {
    // Consultar los usuarios
    this.servicio.obtenerNombres().then((nombres) => {
      this.usuarioSeleccionado = "-- Seleccione un pastor --";
      this.nombres = nombres;
    });;

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
      const eventosMesPdf = await this.servicio.obtenerEventosDetalladosAgrupadosPorMes(usuario);
      this.eventosPorUsuario = eventos;
      this.bautismosPorUsuario = bautismos;
      this.pastorNombre = nombrePastor;
      this.arrayEventosMes = eventosMesPdf;
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }

  generarPDF() {
    moment.locale('es');
    let fecha = moment().format('MMMM') + " " + moment().format('YYYY')
    //Aqui filtro de lo que genera la consulta por los valores que han hecho en el mes los pastores (los valores que son distintos de 0)
    const contenidoInforme = this.filtrarInformacion(fecha);

    const pdf: any = {
      content: [
        contenidoInforme
      ],
      styles: {
        titulo: {
          fontSize: 20,
          bold: true,
          alignment: 'center'
        },
        mes: {
          bold: true,
          alignment: 'right'
        }
      }
    }
    const generar = pdfMake.createPdf(pdf)
    const nombrePersonalizado = "Informe_Mensual_" + this.pastorNombre + "_" + fecha
    //generar.open();
    generar.download(nombrePersonalizado);
  }

  private formatearFecha(fecha: string): any {
    // Analizar la fecha original
    const fechaMoment = moment(fecha);

    // Formatear en el formato de fecha española
    const fechaFormateada = fechaMoment.format("DD-MM-YYYY");

    return fechaFormateada
  }

  private filtrarInformacion(fecha: string) {
    //Sacar los registros que quiero
    const eventosPorItem = this.arrayEventosMes.reduce((result: any, item: any) => {
      const newItem = {
        concepto: item.concepto,
        alojamiento: item.alojamiento,
        fechaInicio: item.fechaInicio,
        fechaInicioHora: item.fechaInicioHora,
        fechaFinHora: item.fechaFinHora,
        fechaFin: item.fechaFin,
        transporte: item.transporte,
        trayecto: item.trayecto,
        viajes: item.viajes,
        gastos: item.gastos,
        dietas: item.dietas,
        total: item.total,
        kilometros: item.km
      };

      if (!result[item.item]) {
        result[item.item] = [];
      }

      result[item.item].push(newItem);
      return result;
    }, {});

    // Crear el informe en la estructura deseada para el pdf
    const informe = Object.entries(eventosPorItem).map(([item, eventos]: any) => [
      {
        ul: [`${item}: ${eventos.length}`,
        {
          ol: eventos.map((evento: any) => [
            `Evento`,
            `Concepto: ${evento.concepto || ""}`,
            `Fecha Inicio: ${this.formatearFecha(evento.fechaInicio)} a las ${evento.fechaInicioHora}`,
            `Fecha Final: ${this.formatearFecha(evento.fechaFin)} a las ${evento.fechaFinHora}`,
            `Alojamiento Hotel: ${evento.alojamiento || 0}`,
            `Trayecto: ${evento.trayecto || ""}`,
            `Gasto Transporte Bus-Metro: ${evento.transporte || 0}€`,
            `Gasto Viajes Avion/Tren: ${evento.viajes || 0}€`,
            `Gastos Varios: ${evento.gastos || 0}€`,
            `Dietas: ${evento.dietas || 0}`,
            `Total Kilometros: ${evento.kilometros || 0} km`,
            `Total Gasto: ${evento.total}`,
          ],),
          margin: [0, 0, 0, 16]
        }
        ]
      }
    ]);

    const contenidoInforme = [
      { text: fecha, style: 'mes', margin: [0, 0, 0, 10] },
      { text: `Informe Mensual de ${this.pastorNombre}`, style: 'titulo', margin: [0, 0, 0, 30] },
      ...informe,
    ];

    return contenidoInforme;
  }
}