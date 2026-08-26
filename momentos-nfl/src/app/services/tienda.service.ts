import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ProductoResponse,
  CrearOrdenRequest,
  OrdenResponse
} from '../interfaces/interfazTienda';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {
  private apiProductos = 'http://localhost:8080/api/productos';
  private apiOrdenes = 'http://localhost:8080/api/ordenes';

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