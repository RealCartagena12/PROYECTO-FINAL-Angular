import { Injectable } from '@angular/core';
import { HistoriaApi } from '../interfaces/interfazHistoria';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root',})
export class CardHistorias {
    private  readonly baseUrl = `${environment.apiBaseUrl}/historias`;

    private readonly  historias$: Observable<HistoriaApi[]>;

    constructor(private http: HttpClient) {
        this.historias$ = this.http.get<HistoriaApi[]>(this.baseUrl).pipe(
            shareReplay(1)
        );
    }

    getHistorias(): Observable<HistoriaApi[]> {
        return this.historias$;
    }

createHistoria(historia: Partial<HistoriaApi>) {
  const token = localStorage.getItem('token') || '';
  return this.http.post<HistoriaApi>(this.baseUrl, historia, {
    headers: { Authorization: `Bearer ${token}` }
  });
}


 deleteHistoria(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
 }
}

