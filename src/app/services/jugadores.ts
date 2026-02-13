import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JugadorApi } from '../interfaces/jugador';
import { environment } from '../../environments/environment';




@Injectable({ providedIn: 'root'})
export class JugadoresService {
  private baseUrl = `${environment.apiBaseUrl}/jugadores`;

  constructor(private http: HttpClient) { }

  getJugadorRandom(): Observable<JugadorApi> {
    return this.http.get<JugadorApi>(`${this.baseUrl}/random`);

  }
  
  sumarPunto(token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: token,
      'content-type': 'application/json'
    });
    return this.http.post(`${this.baseUrl}/sumar`, {}, { headers });
}
}
