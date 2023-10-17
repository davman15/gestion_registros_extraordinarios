import { Component, ElementRef, ViewChild } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';
import { SacardatosService } from 'src/app/servicios/sacardatos.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { StorageService } from 'src/app/servicios/storage.service';
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
  anioSeleccionado!: number;
  mesSeleccionado!: number;
  anios: number[] = [];
  meses: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  nombresMes: string[] = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  constructor(private servicioStorage: StorageService, private servicioDatos: SacardatosService) { }

  ngOnInit() {
    // Consultar los usuarios
    this.usuarioSeleccionado = "-- Seleccione un pastor --";
    this.servicioDatos.obtenerNombres().then((nombres) => {
      this.nombres = nombres;
    });;

    const fechaHoy = new Date();
    this.mesSeleccionado = fechaHoy.getMonth() + 1;
    this.anioSeleccionado = fechaHoy.getFullYear();

    this.cargarArray();
    this.generarOpcionesAnios();
  }

  cargarArray() {
    this.arrayColumnas = this.servicioDatos.cargarItems();
  }

  generarOpcionesAnios() {
    const anioActual = new Date().getFullYear();
    for (let anio = anioActual - 20; anio <= anioActual + 20; anio++) {
      this.anios.push(anio);
    }
  }

  async actualizarDatos(usuario: string, mes: number, anio: number) {
    try {
      const eventos = await this.servicioDatos.obtenerEventosAgrupadosPorMes(usuario, mes, anio);
      const bautismos = await this.servicioDatos.obtenerBautismosAgrupadosPorMes(usuario, mes, anio);
      const nombrePastor = await this.servicioDatos.obtenerNombrePastor(usuario, this.pastorNombre);
      const eventosMesPdf = await this.servicioDatos.obtenerEventosDetalladosAgrupadosPorMes(usuario, mes, anio);

      this.eventosPorUsuario = eventos;
      this.bautismosPorUsuario = bautismos;
      this.pastorNombre = nombrePastor;
      this.arrayEventosMes = eventosMesPdf;
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  }

  async onSelectUsuario(usuario: string) {
    await this.actualizarDatos(usuario, this.mesSeleccionado, this.anioSeleccionado);
  }

  async onSelectMes(mes: number) {
    await this.actualizarDatos(this.usuarioSeleccionado, mes, this.anioSeleccionado);
  }

  async onSelectAnio(anio: number) {
    await this.actualizarDatos(this.usuarioSeleccionado, this.mesSeleccionado, anio);
  }

  descargarFacturasMes() {
    this.servicioStorage.descargarCarpetaUsuario(this.pastorNombre, this.mesSeleccionado, this.anioSeleccionado);
  }

  generarPDF() {
    let fecha = this.nombresMes[this.mesSeleccionado - 1] + " " + this.anioSeleccionado
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
            `Alojamiento Hotel: ${evento.alojamiento || 0}€`,
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