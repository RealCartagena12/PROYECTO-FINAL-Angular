import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatoApi } from '../interfaces/interfazDatos';
import { environment } from '../../environments/environment';




@Injectable({providedIn: 'root',})
export class CardDatos {
    private apiUrl = `${environment.apiBaseUrl}/datos`;

    constructor(private http: HttpClient) {}

  
    getDatos(): Observable<DatoApi[]> {
        console.log('Fetching datos from API:', this.apiUrl);
        return this.http.get<DatoApi[]>(this.apiUrl);
    }

    getDatoById(id: string): Observable<DatoApi> {
      return this.http.get<DatoApi>(`${this.apiUrl}/${id}`);
    }
}
