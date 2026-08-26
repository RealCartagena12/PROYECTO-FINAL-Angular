import { Component, OnDestroy , ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriviaService } from '../../services/trivia.service';
import { TriviaPregunta } from '../../interfaces/interfazTrivia';

@Component({
  selector: 'app-trivia',
  imports: [CommonModule],
  templateUrl: './trivia.html',
  styleUrl: './trivia.css',
})
export class Trivia implements OnDestroy {
    usuario : string = localStorage.getItem('nombreUsuario') || 'JOSE123';

  sessionId = '';
  preguntaActual: TriviaPregunta | null = null;

  puntaje = 0;
  tiempoRestante = 0;
  tiempoLimite = 15;

  mensaje = '';
  respuestaCorrecta = '';
  juegoIniciado = false;
  juegoFinalizado = false;
  cargando = false;
  opcionSeleccionada = '';

  intervalo: any;

  constructor(private triviaService: TriviaService,
              private cdr: ChangeDetectorRef
  ) {}

  iniciarJuego(): void {
    this.cargando = true;
    this.mensaje = '';
    this.puntaje = 0;
    this.juegoFinalizado = false;

    this.triviaService.iniciarTrivia(this.usuario).subscribe({
      next: (res) => {
        this.sessionId = res.data._id;
        this.juegoIniciado = true;
        this.cargando = false;
        this.obtenerSiguientePregunta();
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'Error al iniciar la trivia';
      }
    });
  }

  obtenerSiguientePregunta(): void {
    this.cargando = true;
    this.mensaje = '';
    this.respuestaCorrecta = '';
    this.opcionSeleccionada = '';

    this.triviaService.obtenerSiguientePregunta(this.sessionId).subscribe({
      next: (res) => {
        this.cargando = false;

        if (res.finalizada) {
          this.juegoFinalizado = true;
          this.preguntaActual = null;
          this.detenerTiempo();
          this.mensaje = `Trivia finalizada. Puntaje final: ${res.puntajeFinal}`;
          return;
        }

        if (res.data) {
          this.preguntaActual = res.data;
          this.tiempoLimite = res.tiempoLimite || 15;
          this.tiempoRestante = this.tiempoLimite;
          this.iniciarTemporizador();
        }
      },
      error: () => {
        this.cargando = false;
        this.mensaje = 'Error al obtener la pregunta';
      }
    });
  }

  responder(opcion: string): void {
    if (!this.sessionId || !this.preguntaActual) return;

    this.opcionSeleccionada = opcion;
    this.detenerTiempo();

    this.triviaService.responderPregunta(this.sessionId, opcion).subscribe({
      next: (res) => {
        this.puntaje = res.puntajeActual;
        this.respuestaCorrecta = res.respuestaCorrecta;
        this.mensaje = res.mensaje;
      },
      error: () => {
        this.mensaje = 'Error al responder la pregunta';
      }
    });
  }

  iniciarTemporizador(): void {
    this.detenerTiempo();

    this.intervalo = setInterval(() => {
      this.tiempoRestante--;
      this.cdr.detectChanges();

      if (this.tiempoRestante <= 0) {
        this.detenerTiempo();
        this.responder('SIN_RESPUESTA');
      }
    }, 1000);
  }

  detenerTiempo(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  siguiente(): void {
    this.obtenerSiguientePregunta();
  }

  reiniciar(): void {
    this.detenerTiempo();
    this.iniciarJuego();
  }

  ngOnDestroy(): void {
    this.detenerTiempo();
  }
}
 