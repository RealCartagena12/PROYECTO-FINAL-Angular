import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  ProductoResponse,
  CrearOrdenRequest,
  OrdenResponse
} from '../interfaces/interfazTienda';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private apiProductos = `${environment.apiBaseUrl}/productos`;
  private apiOrdenes = `${environment.apiBaseUrl}/ordenes`;

  constructor(private http: HttpClient) {}

  obtenerProductos(): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(this.apiProductos);
  }

  buscarProductos(busqueda: string): Observable<ProductoResponse> {
    return this.http.get<ProductoResponse>(
      `${this.apiProductos}?busqueda=${busqueda}`
    );
  }

  crearOrden(data: CrearOrdenRequest): Observable<OrdenResponse> {
    return this.http.post<OrdenResponse>(this.apiOrdenes, data);
  }
}