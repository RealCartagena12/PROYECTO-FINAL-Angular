import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { IniciarTriviaResponse, SiguientePreguntaResponse, ResponderTriviaResponse } from '../interfaces/interfazTrivia';


@Injectable({
  providedIn: 'root',
})
export class TriviaService {
   private baseUrl = `${environment.apiBaseUrl}/trivia`;

  constructor(private http: HttpClient) {}

  iniciarTrivia(usuario:string): Observable<IniciarTriviaResponse> {
    return this.http.post<IniciarTriviaResponse>(`${this.baseUrl}/iniciar`, { usuario });
  }

  obtenerSiguientePregunta(sessionId: string): Observable<SiguientePreguntaResponse> {
     return this.http.get<SiguientePreguntaResponse>(
      `${this.baseUrl}/session/${sessionId}/siguiente`
    );

  }

  responderPregunta(sessionId: string, respuesta: string): Observable<ResponderTriviaResponse> {
    return this.http.post<ResponderTriviaResponse>(
      `${this.baseUrl}/session/${sessionId}/responder`,
      { respuesta }
    );
  }
}
