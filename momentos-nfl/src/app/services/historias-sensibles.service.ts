import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface HistoriaSensibleApi {
  _id?: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  fuente: string;
  advertencia?: string;
}

@Injectable({ providedIn: 'root' })
export class HistoriasSensiblesService {
   private baseUrl = `${environment.apiBaseUrl}/historias-sensibles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<HistoriaSensibleApi[]> {
    return this.http.get<HistoriaSensibleApi[]>(this.baseUrl);
  }

  getById(id: string): Observable<HistoriaSensibleApi> {
    return this.http.get<HistoriaSensibleApi>(`${this.baseUrl}/${id}`);
  }
}
