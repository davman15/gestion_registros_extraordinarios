import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';
import { FormBuilder, FormGroup, Validators, NgForm, FormArray } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { map } from 'rxjs';
import { IBautismo } from 'src/app/models/IBautismo';
import { FullCalendarComponent } from '@fullcalendar/angular';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-bautismos',
  templateUrl: './bautismos.component.html',
  styleUrls: ['./bautismos.component.css']
})

export class BautismosComponent implements OnInit {
  @ViewChild('formularioBautismo') form!: NgForm;
  @ViewChild('calendarioBautismo') calendarioBautismo!: FullCalendarComponent;

  calendarOptions!: CalendarOptions
  tablaOpciones: any = {};
  modoEdicion: boolean = false;
  idBautismo!: string;
  formGroup!: FormGroup;
  idUsuario!: any;
  bautismosCalendario: EventInput[] = [];
  bautismosListaTabla: any;
  coleccionBautismos!: AngularFirestoreCollection<any>;
  fechaBautismo!: any;
  personas: any;
  constructor(private db: AngularFirestore, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.idUsuario = JSON.parse(localStorage.getItem('user') ?? "").uid;
    this.coleccionBautismos = this.db.collection("usuarios").doc(this.idUsuario).collection("bautismos");
    this.cargarBautismosCalendario();

    this.calendarOptions = {
      plugins: [dayGridPlugin, listPlugin],
      locale: esLocale,
      showNonCurrentDates: false,
      fixedWeekCount: false,
      navLinks: true,
      headerToolbar: {
        start: 'title',
        center: '',
        end: 'prev,next today,listMonth'
      },
      initialView: 'dayGridMonth',
      themeSystem: 'bootstrap5'
    };
    this.formulario();
    this.obtenerBautismos();
  }

  ngAfterViewInit(): void {
    this.calendarioBautismo.getApi().on('eventClick', (info) => {
      /*let id = info.event.id;
      localStorage.setItem('idBautismo', id);
      this.idBautismo = localStorage.getItem('idBautismo')!.toString();*/
      let fecha = info.event.start;
      let fechaFormateada = moment(fecha).format('YYYY-MM-DD');

      this.fechaBautismo = fechaFormateada;
      this.obtenerBautismos();
      /*const sub = this.coleccionBautismos.doc(id).valueChanges().subscribe(data => {
        this.modoEdicion = true;
        $('#modalBautismo').modal('show');
        //this.rellenarDatosFormulario(data, id);
        sub.unsubscribe();
      });*/
    });
  }

  obtenerBautismos(): void {
    this.coleccionBautismos.valueChanges()
      .subscribe((bautismos) => {
        this.bautismosListaTabla = this.bautismosListaTabla = bautismos.filter(bautismo => bautismo.fechaBautismo === this.fechaBautismo);
      });
  }

  /*rellenarDatosFormulario(evento: any, id: string) {
    for (let propiedad in evento) {
      if (propiedad == 'fechaBautismo') {
        let fecha = moment(evento[propiedad]).format('YYYY-MM-DD');
        const control = this.formGroup.get(propiedad);
        if (control) {
          control.setValue(fecha);
        }
      }
      else {
        const control = this.formGroup.get(propiedad);
        if (control) {
          control.setValue(evento[propiedad]);
        }
      }
    }
  }*/

  cargarBautismosCalendario() {
    this.coleccionBautismos.valueChanges().pipe(
      map((bautismos: any[]) => {
        // Agrupar los bautismos por fecha
        const bautismosPorFecha = bautismos.reduce((acumulador, bautismo) => {
          const fecha = new Date(bautismo.fechaBautismo).toISOString().slice(0, 10);
          if (!acumulador[fecha]) {
            acumulador[fecha] = [];
          }
          acumulador[fecha].push(bautismo);
          return acumulador;
        }, {});
  
        // Crear los eventos de calendario, uno por fecha
        const eventos = Object.keys(bautismosPorFecha).map(fecha => {
          const bautismosEnFecha = bautismosPorFecha[fecha];
          const bautismo = bautismosEnFecha[0]; // Tomar el primer bautismo de la fecha
          return {
            id: bautismo.id,
            title: "Bautismos",
            start: new Date(bautismo.fechaBautismo),
            allDay: true
          };
        });
  
        return eventos;
      })
    ).subscribe(eventos => {
      this.bautismosCalendario = eventos;
    });
  }

  abrirModalBautismo() {
    $('#modalBautismo').modal('show');
  }

  formulario() {
    this.formGroup = this.formBuilder.group({
      id: [localStorage.getItem('idBautismo')],
      fechaBautismo: ['', Validators.required],
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      oficiante: ['', Validators.required],
      iglesia: ['', Validators.required]
    }, {
      validator: this.validarFechas.bind(this)
    });
  }

  validarFechas() {
    if (!this.formGroup) {
      return null;
    }
    const fechaIntroducida = new Date(this.formGroup.get('fechaBautismo')!.value);
    const fechaHoy = new Date();
    if (fechaHoy.getTime() > fechaIntroducida.getTime()) {
      return { fechaInvalida: true };
    }
    return null;
  }
  get f() {
    return this.formGroup.controls;
  }

  registrarBautismo(modoEdicion: boolean) {
    let bautismo: IBautismo = Object.assign({}, this.formGroup.value);
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    if (!modoEdicion) {
      localStorage.setItem('idBautismo', this.db.createId().toString());
      bautismo.id = localStorage.getItem('idBautismo')!.toString();
    }

    this.aniadirBautismo(bautismo);
  }

  aniadirBautismo(bautismo: IBautismo) {
    this.coleccionBautismos.doc(bautismo.id).set(bautismo);
    this.cerrarModalBautismo(this.modoEdicion, '');
  }

  cerrarModalBautismo(modoEdicion: boolean, idEvento: string) {
    $('#modalBautismo').modal('hide');
    localStorage.setItem('idBautismo', '');
    if (this.form)
      this.form.reset();

  }
}
