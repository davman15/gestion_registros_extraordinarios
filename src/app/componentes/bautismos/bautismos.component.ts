import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-bautismos',
  templateUrl: './bautismos.component.html',
  styleUrls: ['./bautismos.component.css']
})
export class BautismosComponent implements OnInit {
  calendarOptions!: CalendarOptions;
  tablaOpciones: any = {};

  constructor() { }

  ngOnInit() {
    this.tablaOpciones = {
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json'
      },
      dom:'Btrtip',
    }
    this.calendarOptions = {
      plugins: [dayGridPlugin],
      locale: esLocale,
      headerToolbar: {
        start: 'title',
        center: '',
        end: 'prev,next'
      },
      initialView: 'dayGridMonth',
      events: []
    };
  }
}
