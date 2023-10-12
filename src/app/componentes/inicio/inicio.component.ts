import { Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es';
import { map } from 'rxjs';
import listPlugin from '@fullcalendar/list';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { IEvento } from 'src/app/models/IEvento';
import * as moment from 'moment';
import 'moment-timezone';
import Swal from 'sweetalert2';
import { AngularFireStorage } from '@angular/fire/compat/storage';
declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent {
  constructor(private db: AngularFirestore, private formBuilder1: FormBuilder, private dbStorage: AngularFireStorage) { }

  formGroup1!: FormGroup;
  campos = ['gastos', 'transporte', 'dietas', 'viajes', 'alojamiento', 'km'];
  modoEdicion: boolean = false;
  @ViewChild('calendario') calendario!: FullCalendarComponent;
  @ViewChild('formulario') form!: NgForm;
  idEvento!: string;
  idUsuario!: any;
  nombreUsuario!: any;
  eventos: EventInput[] = [];
  coleccionEventos!: AngularFirestoreCollection<any>;
  arrayItems: { [key: string]: string } = {};

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [timeGridPlugin, dayGridPlugin, interactionPlugin, listPlugin],
    locale: esLocale,
    showNonCurrentDates: false,
    fixedWeekCount: false,
    selectable: true,
    navLinks: true,
    dayMaxEvents: true,
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit'
    },
    eventDrop: (datos: any) => {
      this.actualizarFechas(datos);
    },
    eventResize: (datos: any) => {
      this.actualizarFechas(datos);
    },
    selectOverlap: false,
    droppable: true,
    themeSystem: 'bootstrap5',
    editable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
    }
  };

  private actualizarFechas(datos: any) {
    const fechaHoraInicio = `${datos.event.start.getHours().toString().padStart(2, '0')}:${datos.event.start.getMinutes().toString().padStart(2, '0')}`;
    const fechaHoraFin = `${datos.event.end.getHours().toString().padStart(2, '0')}:${datos.event.end.getMinutes().toString().padStart(2, '0')}`;
    this.coleccionEventos.doc(datos.event.id).update({
      fechaFin: datos.event.endStr,
      fechaInicio: datos.event.startStr,
      fechaInicioHora: fechaHoraInicio,
      fechaFinHora: fechaHoraFin
    });
  }

  ngOnInit(): void {
    //Sacamos el id del usuario del objeto del localStorage
    this.idUsuario = JSON.parse(localStorage.getItem('user') ?? "").uid;
    this.coleccionEventos = this.db.collection("usuarios").doc(this.idUsuario).collection("eventos");
    this.coleccionEventos.valueChanges().pipe(
      map((eventos: any[]) => {
        return eventos.map(evento => {
          return {
            id: evento.id,
            title: evento.item,
            start: new Date(evento.fechaInicio),
            end: new Date(evento.fechaFin),
            backgroundColor: evento.colorEvento
          }
        });
      })
    ).subscribe(eventos => {
      this.eventos = eventos;
    });

    this.cargarItems();
    this.formularios();
    this.captarActualizaciones();
    this.idEvento = this.formGroup1.get('id')!.value;
  }

  ngAfterViewInit(): void {
    this.calendario.getApi().on('dateClick', (info) => {
      this.modoEdicion = false;
      $('#modalCalendario1').modal('show');
      this.formGroup1.get('fechaInicio')!.setValue(info.dateStr);
      this.formGroup1.get('fechaFin')!.setValue(info.dateStr);
    });

    this.calendario.getApi().on('eventClick', (info) => {
      let id = info.event.id;
      localStorage.setItem('idEvento', id);
      this.idEvento = localStorage.getItem('idEvento')!.toString();

      const sub = this.coleccionEventos.doc(id).valueChanges().subscribe(data => {
        this.modoEdicion = true;
        $('#modalCalendario1').modal('show');
        this.rellenarDatosFormulario(data, id);
        sub.unsubscribe();
      });
    });
  }

  rellenarDatosFormulario(evento: any, id: string) {
    for (let propiedad in evento) {
      if (propiedad == 'fechaInicio' || propiedad == 'fechaFin') {
        let fecha = moment(evento[propiedad]).format('YYYY-MM-DD');
        const control = this.formGroup1.get(propiedad);
        if (control) {
          control.setValue(fecha);
        }
      }
      else {
        const control = this.formGroup1.get(propiedad);
        if (control) {
          control.setValue(evento[propiedad]);
        }
      }
    }
  }

  formularios() {
    this.formGroup1 = this.formBuilder1.group({
      id: [localStorage.getItem('idEvento')],
      item: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaInicioHora: ['', Validators.required],
      fechaFin: ['', Validators.required],
      fechaFinHora: ['', Validators.required],
      colorEvento: ['#000000'],
      concepto: [''],
      trayecto: [''],
      gastos: [null, Validators.pattern(/^\d+(?:[,.]\d{2})?$/)],
      transporte: [null, Validators.pattern(/^\d+(?:[,.]\d{2})?$/)],
      dietas: [null, Validators.pattern(/^[0-9]*$/)],
      viajes: [null, Validators.pattern(/^\d+(?:[,.]\d{2})?$/)],
      alojamiento: [null, Validators.pattern(/^\d+(?:[,.]\d{2})?$/)],
      km: [null, Validators.pattern(/^[0-9]*$/)],
      total: [0 + "€"]
    }, {
      validator: this.validarFechas.bind(this)
    });
  }

  validarFechas() {
    if (!this.formGroup1) {
      return null;
    }
    const fechaInicio = new Date(this.formGroup1.get('fechaInicio')!.value + 'T' + this.formGroup1.get('fechaInicioHora')!.value);
    const fechaFin = new Date(this.formGroup1.get('fechaFin')!.value + 'T' + this.formGroup1.get('fechaFinHora')!.value);
    if (fechaFin.getTime() < fechaInicio.getTime()) {
      return { fechasInvalidas: true };
    }
    return null;
  }

  cerrarModal(modoEdicion: boolean, idEvento: string) {
    if (modoEdicion && idEvento != "")
      this.borrarEvento(idEvento);

    localStorage.setItem('idEvento', '');
    $('#modalCalendario1').modal('hide');
    if (this.form)
      this.form.reset();

    this.formGroup1.get('fechaInicioHora')!.setValue("");
    this.formGroup1.get('fechaFinHora')!.setValue("");
    this.formGroup1.get('total')!.setValue(0 + "€");
  }

  aniadirEvento(evento: IEvento) {
    this.coleccionEventos.doc(evento.id).set(evento);
    this.cerrarModal(this.modoEdicion, '');
  }

  borrarEvento(id: string) {
    Swal.fire({
      title: '¿Estás seguro de que quieres eliminar este evento?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.value)
        this.coleccionEventos.doc(id).delete();
      if (this.form)
        this.form.reset();
    });
  }

  registrarEvento(modoEdicion: boolean) {
    let evento: IEvento = Object.assign({}, this.formGroup1.value);
    evento.fechaInicio = this.administrarFecha(evento.fechaInicio, evento.fechaInicioHora);
    evento.fechaFin = this.administrarFecha(evento.fechaFin, evento.fechaFinHora);

    //Primero aqui en el cliente aplicar validaciones
    if (this.formGroup1.invalid) {
      this.formGroup1.markAllAsTouched();
      return;
    }
    if (!modoEdicion) {
      localStorage.setItem('idEvento', this.db.createId().toString());
      evento.id = localStorage.getItem('idEvento')!.toString();
    }

    this.aniadirEvento(evento);
    //this.cerrarModal(this.modoEdicion, '');
  }

  administrarFecha(fecha: Date, hora: string): any {
    let fechaTz;
    if (hora.toString() == "") {
      const cogerFecha = moment(fecha);
      fechaTz = cogerFecha.tz('Europe/Madrid').format();
    }
    else {
      const cogerFechaHora = moment(`${fecha} ${hora}`);
      fechaTz = cogerFechaHora.tz('Europe/Madrid').format();
    }
    return fechaTz;
  }

  cargarItems() {
    this.arrayItems['Cultos'] = 'Cultos';
    this.arrayItems['Espiritual'] = 'Espiritual';
    this.arrayItems['Varias'] = 'Varias';
    this.arrayItems['Ceremonia'] = 'Ceremonia';
    this.arrayItems['Formación'] = 'Formación';
    this.arrayItems['Visitas'] = 'Visitas';
    this.arrayItems['Consejos'] = 'Consejos';
    this.arrayItems['Administración'] = 'Administración';
    this.arrayItems['Reuniones'] = 'Reuniones';
    this.arrayItems['Campaña'] = 'Campaña';
    this.arrayItems['Conferencia'] = 'Conferencia';
    this.arrayItems['Grupo Pequeño'] = 'Grupo Pequeño';
    this.arrayItems['Estudios Biblicos'] = 'Estudios Biblicos';
    this.arrayItems['Misioneras'] = 'Misioneras';
    this.arrayItems['Secretario'] = 'Secretario';
    this.arrayItems['Ancianos'] = 'Ancianos';
    this.arrayItems['Tesorero'] = 'Tesorero';
    this.arrayItems['Redes Sociales'] = 'Redes Sociales';
    this.arrayItems['Gestiones'] = 'Gestiones';
    this.arrayItems['Entrevistas'] = 'Entrevistas';
    this.arrayItems['Sociales'] = 'Sociales';
    this.arrayItems['Regional'] = 'Regional';
    this.arrayItems['Nacional'] = 'Nacional';
    this.arrayItems['Interesados EB'] = 'Interesados EB';
    this.arrayItems['Profesiones'] = 'Profesiones';
    this.arrayItems['Personas Visitadas'] = 'Personas Visitadas';
    this.arrayItems['Visitas Misioneras'] = 'Visitas Misioneras';
  }

  captarActualizaciones() {
    for (let i = 0; i < this.campos.length; i++) {
      this.formGroup1.get(this.campos[i])!.valueChanges.subscribe(() => this.actualizarTotal());
    }
  }

  actualizarTotal() {
    let total = 0;
    for (let i = 0; i < this.campos.length; i++) {
      const valorCampo = this.formGroup1.get(this.campos[i])!.value || 0;
      const fieldValueNum = parseFloat(valorCampo.toString().replace(',', '.'));
      if (this.campos[i] == 'dietas')
        total += parseInt(valorCampo) * 26.76;
      else if (this.campos[i] == 'km') {
        total += parseFloat(valorCampo) * 0.19;
      }
      else
        total += fieldValueNum;
    }
    this.formGroup1.get('total')!.setValue(Number(total).toFixed(2) + "€");
  }

  public get f() {
    return this.formGroup1.controls;
  }
}