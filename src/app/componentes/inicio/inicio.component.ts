import { Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DateSelectArg, EventClickArg, CalendarOptions, EventInput, Calendar } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es';
import { map } from 'rxjs';
import listPlugin from '@fullcalendar/list';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import timeGridPlugin from '@fullcalendar/timegrid';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { IEvento } from 'src/app/models/IEvento';
declare var $: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})

export class InicioComponent {
  constructor(private db: AngularFirestore, private formBuilder1: FormBuilder) { }

  formGroup1!: FormGroup;
  modoEdicion: boolean = false;
  @ViewChild('calendario') calendario!: FullCalendarComponent;
  @ViewChild('formulario') form!: NgForm;
  idUsuario!: any;
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
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit'
    },
    eventClick: (clickInfo: any) => {
      this.borrarEvento(clickInfo);
    },
    eventDrop: (datos: any) => {
      this.coleccionEventos.doc(datos.event.id).update({ fechaFin: datos.event.endStr, fechaInicio: datos.event.startStr })
    },
    eventResize: (datos: any) => {
      this.coleccionEventos.doc(datos.event.id).update({ fechaFin: datos.event.endStr, fechaInicio: datos.event.startStr })
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
    })

    this.cargarItems();
    this.formularios();

  }

  ngAfterViewInit(): void {
    this.calendario.getApi().on('dateClick', (info) => {
      $('#modalCalendario1').modal('show');
      $("#fechaInicio").val(info.dateStr);
      $("#fechaFin").val(info.dateStr);
    });

  }

  cerrarModal() {
    $('#modalCalendario1').modal('hide');
    if (this.form) {
      this.form.reset();
    }
  }

  aniadirEvento(evento: IEvento) {
    this.coleccionEventos.add(evento)
      .then(docRef => {
        this.coleccionEventos.doc(docRef.id).update({ id: docRef.id });
      });
    this.cerrarModal();
  }

  borrarEvento(clickInfo: any) {
    if (confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      clickInfo.event.remove();
      this.db.collection("eventos").doc(clickInfo.event.id).delete();
    }
  }

  formularios() {
    this.formGroup1 = this.formBuilder1.group({
      item: ['', Validators.required],
      fechaInicio: [new Date(), Validators.required],
      fechaFin: [new Date(), Validators.required],
      colorEvento: ['#000000'],
      concepto: [''],
      trayecto: [''],
      gastos: [''],
      transporte: [''],
      dietas: [''],
      viajes: [''],
      alojamiento: [''],
      km: [''],
      total: ['0€']
    });

  }

  registrarEvento() {
    let evento: any = Object.assign({}, this.formGroup1.value);
    console.log(evento);

    //Primero aqui en el cliente aplicar validaciones
    if (this.formGroup1.invalid) {
      this.formGroup1.markAllAsTouched();
      return;
    }

    //this.aniadirEvento(evento);
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
    this.arrayItems['Bautismos'] = 'Bautismos';
    this.arrayItems['Profesiones'] = 'Profesiones';
    this.arrayItems['Personas Visitadas'] = 'Personas Visitadas';
    this.arrayItems['Visitas Misioneras'] = 'Visitas Misioneras';
  }

  public get f() {
    return this.formGroup1.controls;
  }
}
