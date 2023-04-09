import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import listPlugin from '@fullcalendar/list';

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
      dom: 'Btrtip',
    }
    this.calendarOptions = {
      plugins: [dayGridPlugin, listPlugin],
      locale: esLocale,
      showNonCurrentDates: false,
      fixedWeekCount: false,
      headerToolbar: {
        start: 'title',
        center: '',
        end: 'prev,next today,listMonth'
      },
      initialView: 'dayGridMonth',
      themeSystem: 'bootstrap5',
      events: []
    };
  }
}
