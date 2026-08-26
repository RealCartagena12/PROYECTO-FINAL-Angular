import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { IniciarTriviaResponse, SiguientePreguntaResponse, ResponderTriviaResponse } from '../interfaces/interfazTrivia';

@Injectable({
  providedIn: 'root',
})
export class TriviaService {
  private apiUrl = 'http://localhost:8080/api/trivia';

  constructor(private http: HttpClient) {}

  iniciarTrivia(usuario:string): Observable<IniciarTriviaResponse> {
    return this.http.post<IniciarTriviaResponse>(`${this.apiUrl}/iniciar`, { usuario });
  }

  obtenerSiguientePregunta(sessionId: string): Observable<SiguientePreguntaResponse> {
     return this.http.get<SiguientePreguntaResponse>(
      `${this.apiUrl}/session/${sessionId}/siguiente`
    );

  }

  responderPregunta(sessionId: string, respuesta: string): Observable<ResponderTriviaResponse> {
    return this.http.post<ResponderTriviaResponse>(
      `${this.apiUrl}/session/${sessionId}/responder`,
      { respuesta }
    );
  }
}
