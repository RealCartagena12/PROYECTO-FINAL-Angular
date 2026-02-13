import { Component, OnInit, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JugadoresService } from '../../services/jugadores';
import { JugadorApi } from '../../interfaces/jugador';
import { AuthService } from '../../services/auth-service';
import { Reconectando } from '../../services/reconectando';

type JugadorJuego = {nombre: string, pistas: string[]};


@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './juego.html',
  styleUrls: ['./juego.css'],
})


export class Juego implements OnInit {
  jugadorActual: JugadorJuego | null = null;
  indicePista: number = 0;
  puntaje: number = 0;
  respuesta='';
  pistaTexto='';
  resultadoTexto='';
  mostrarNuevoJugador: boolean = false;
  cargando: boolean = false;
  errorMsg: string | null = null;

  private readonly SCORE_KEY = 'nfl_score'

  constructor(private jugadoresService: JugadoresService,
    private authService: AuthService,
    private conn: Reconectando
  ) {}

  ngOnInit(): void {
    this.nuevoJuego();

    this.conn.reconnecting$.subscribe(reconnecting => {
      if (!reconnecting &&  this.errorMsg) {
        this.nuevoJuego();
      }
    })

    const user = this.authService.getUser();
    this.puntaje = user?.puntaje ?? 0;

  }

  private normalizar(texto: string): string {
    return (texto || '').trim().toLowerCase();
  }

  nuevoJuego(): void {


    this.cargando = true;
    this.pistaTexto = '';
    this.resultadoTexto = '';
    this.mostrarNuevoJugador = false;
    this.respuesta = '';
    this.indicePista = 0;
    this.errorMsg = null;


    this.jugadoresService.getJugadorRandom().subscribe({
      next: (data: JugadorApi) => {
        this.jugadorActual = {
          nombre: this.normalizar(data.nombre),
          pistas: [data.pista1, data.pista2, data.pista3, data.pista4],};
        this.errorMsg = null;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        this.jugadorActual = null;
        this.errorMsg = 'Error al cargar el jugador. Intenta de nuevo.';
      },
    });
  }


  comprobar(): void {
    if (!this.jugadorActual) return;

    const respuestaUser = this.normalizar(this.respuesta);

    if(respuestaUser === this.jugadorActual.nombre) {
       this.resultadoTexto = `✅ ¡Correcto! Era ${this.jugadorActual.nombre.toUpperCase()}!`;
       this.pistaTexto = '';
       this.mostrarNuevoJugador = true;
       this.puntaje+= 10;

       this.authService.addpoints(10).subscribe({
        next: (user) => {
          this.puntaje = user.puntaje?? this.puntaje;
        }
       });

       return;
    }
    if(this.indicePista < this.jugadorActual.pistas.length) {
      this.pistaTexto = this.jugadorActual.pistas[this.indicePista];
      this.indicePista++;
    } else {
      this.resultadoTexto = `❌ ¡Incorrecto! La respuesta correcta era ${this.jugadorActual.nombre.toUpperCase()}.`;
      this.pistaTexto = '';
      this.mostrarNuevoJugador = true;
      this.puntaje= 0;

      this.authService.setPoints(0).subscribe({
        next: (user) => {
          this.puntaje = user.puntaje ?? 0;
        }
      });
    }
  }
}
