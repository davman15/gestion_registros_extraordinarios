import { Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { SacardatosService } from 'src/app/servicios/sacardatos.service';
import * as Highcharts from 'highcharts';
@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent {
  constructor(private servicio: SacardatosService) { }
  docs: any[] = [];
  totalGastos: number = 0;
  cargando: boolean = true;
  @ViewChild('pieChart') pieChart!: ElementRef<HTMLDivElement>;
  chart: Highcharts.Chart | undefined;
  ngOnInit(): void {
    this.servicio.getTotalGastos().subscribe((total) => {
      this.totalGastos = parseFloat(total.toFixed(2));
      setTimeout(() => {
        this.actualizarSemiPie();
      }, 70);
    });
  }
  actualizarSemiPie(): void {
    if (this.chart) {
      this.chart.series[0].points[0].update(this.totalGastos);
    }
  }
  ngAfterViewInit() {
    this.chart = Highcharts.chart(this.pieChart.nativeElement, {
      chart: {
        type: 'pie',
        renderTo: 'pieChart'
      },
      title: {
        text: 'Total gastos histórico en euros'
      },
      plotOptions: {
        pie: {
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '120%',
          showInLegend: false,
          dataLabels: {
            enabled: true,
            format: '{y}',
            distance: -80,
            style: {
              fontWeight: 'bold',
              fontSize: '25px',
              color: 'white'
            }
          }
        }
      },
      series: [{
        name: 'Datos',
        data: [{
          name: 'Gastos en euros',
          y: this.totalGastos
        }]
      } as any]
    });
  }

  lineChart = new Chart({
    chart: {
      type: 'line',
      backgroundColor: '#3780ed'
    },
    title: {
      text: 'Gastos Mensuales',
      style: {
        color: '#fff',
        marginTop: 50
      }
    },
    credits: {
      enabled: true
    },
    xAxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      labels: {
        style: {
          color: '#fff'
        }
      }
    },
    yAxis: {
      title: {
        text: 'Gastos en euros',
        style: {
          color: '#fff'
        }
      },
      labels: {
        style: {
          color: '#fff'
        }
      }
    },
    legend: {
      itemStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: 'Gastos en Km',
        data: [45, 12, 15, 18, 20, 22, 25, 28, 30, 33, 35, 40]
      } as any,
      {
        name: 'Gastos en Dietas',
        data: [10, 12, 15, 18, 20, 22, 25, 28, 30, 33, 35, 45]
      } as any,
      {
        name: 'Gastos Totales',
        data: [5, 3, 15, 18, 20, 22, 25, 28, 30, 33, 35, 40]
      } as any
    ]
  });
}
