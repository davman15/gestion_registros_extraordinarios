export interface IEvento {
    id: string,
    item: string,
    fechaInicio: Date,
    fechaInicioHora: string,
    fechaFin: Date,
    fechaFinHora: string,
    colorEvento: string,
    concepto: string,
    trayecto: string,
    gastos: string,
    transporte: string,
    dietas: string,
    viajes: string,
    alojamiento: string,
    km: string,
    total: string,
    archivosSubidos: any
}