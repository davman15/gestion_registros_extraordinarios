import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as JSZip from 'jszip';
import { forkJoin, from, switchMap } from 'rxjs';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  //Funciona falta pasarle los parametros y ya
  async descargarCarpetaUsuario(usuario: string, mes: number, anio: number) {
    const rutaCarpeta = `usuarios/${usuario}/${mes}-${anio}/`;

    const zip = new JSZip();
    const descargarTodo: any = [];

    // Lista los archivos en la carpeta de Firebase Storage
    this.storage.ref(rutaCarpeta).listAll().pipe(
      switchMap((archivos) => {
        const descargaObservables = archivos.items.map((archivo) => {
          return from(this.storage.ref(archivo.fullPath).getDownloadURL()).pipe(
            switchMap(async (linkDescarga) => {
              const respuestaDescarga = await fetch(linkDescarga);
              if (respuestaDescarga.ok) {
                const fileBlob = await respuestaDescarga.blob();
                descargarTodo.push(fileBlob);
                zip.file(archivo.name, fileBlob);
              } else {
                console.error(`Error al descargar el archivo: ${archivo.name}`);
              }
            })
          );
        });
        return forkJoin(descargaObservables);
      })
    ).subscribe({
      complete: async () => {
        if (descargarTodo.length > 0) {
          const blob = await zip.generateAsync({ type: "blob" });
          saveAs(blob, 'facturasv2.zip');
        }
        else
          Swal.fire('Descarga Cancelada', 'Aún no hay facturas disponibles con este pastor este mes', 'error');
      }
    });
  }
}