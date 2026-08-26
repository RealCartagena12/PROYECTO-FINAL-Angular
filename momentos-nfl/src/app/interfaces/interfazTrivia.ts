export interface TriviaPregunta {
    _id: string;
    pregunta: string;
    opciones: string[];
    categoria: string;
    dificultad: 'facil' | 'media' | 'dificil';
}

export interface TriviaSession {
    _id: string;
    usario: string;
    preguntasUsadas: string[];
    preguntaActual: string | null;
    puntaje: number;
    tiempoLimite: number; // en segundos
    activa: boolean;
}

export interface IniciarTriviaResponse {
    ok: boolean;
    mensaje: string;
    data: TriviaSession;
}

export interface SiguientePreguntaResponse {
    ok: boolean;
    tiempoLimite?: number;
    data?: TriviaPregunta;
    finalizada?: boolean;
    mensaje?: string;
    puntajeFinal?: number;
}

export interface ResponderTriviaResponse {
    ok: boolean;
    correcta: boolean;
    tiempoAgotado: boolean;
    segundosTranscurridos: number;
    respuestaCorrecta: string;
    puntajeActual: number;
    mensaje: string;
}