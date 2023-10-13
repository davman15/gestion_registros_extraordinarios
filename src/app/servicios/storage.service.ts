import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as JSZip from 'jszip';
import { forkJoin, from, switchMap } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private storage: AngularFireStorage) { }

  //Funciona falta pasarle los parametros y ya
  async descargarCarpetaUsuario(usuario: string, fechaCarpeta: string) {
    const rutaCarpeta = `usuarios/David Manrique/10-2023/`;
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
        const blob = await zip.generateAsync({ type: "blob" });
        saveAs(blob, 'facturasv2.zip');
      }
    });        
  }
}
