const Trivia = require('../models/trivia.model');
const TriviaSession = require('../models/triviaSession.model');


const crearPregunta = async (req, res) => {
  try {
    const { pregunta, opciones, respuestaCorrecta, categoria, dificultad } = req.body;

    if (!pregunta || !opciones || !respuestaCorrecta) {
      return res.status(400).json({
        ok: false,
        mensaje: 'pregunta, opciones y respuestaCorrecta son obligatorios'
      });
    }

    if (!Array.isArray(opciones) || opciones.length !== 4) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debes enviar exactamente 4 opciones'
      });
    }

    if (!opciones.includes(respuestaCorrecta)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'La respuestaCorrecta debe estar incluida dentro de las opciones'
      });
    }

    const nuevaPregunta = new Trivia({
      pregunta,
      opciones,
      respuestaCorrecta,
      categoria,
      dificultad
    });

    const guardada = await nuevaPregunta.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Pregunta creada correctamente',
      data: guardada
    });
  } catch (error) {
    console.error('Error al crear pregunta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno al crear la pregunta'
    });
  }
};

const obtenerTodasLasPreguntas = async (_req, res) => {
  try {
    const preguntas = await Trivia.find().sort({ createdAt: -1 });

    res.status(200).json({
      ok: true,
      total: preguntas.length,
      data: preguntas
    });
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener las preguntas'
    });
  }
};

const obtenerPreguntaAleatoria = async (_req, res) => {
  try {
    const preguntas = await Trivia.aggregate([{ $sample: { size: 1 } }]);

    if (!preguntas.length) {
      return res.status(404).json({
        ok: false,
        mensaje: 'No hay preguntas registradas'
      });
    }

    const pregunta = preguntas[0];

    // Importante: no enviamos la respuesta correcta al frontend aquí
    res.status(200).json({
      ok: true,
      data: {
        _id: pregunta._id,
        pregunta: pregunta.pregunta,
        opciones: pregunta.opciones,
        categoria: pregunta.categoria,
        dificultad: pregunta.dificultad
      }
    });
  } catch (error) {
    console.error('Error al obtener pregunta aleatoria:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener una pregunta aleatoria'
    });
  }
};

const validarRespuesta = async (req, res) => {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    if (!respuesta) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debes enviar una respuesta'
      });
    }

    const pregunta = await Trivia.findById(id);

    if (!pregunta) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Pregunta no encontrada'
      });
    }

    const esCorrecta =
      pregunta.respuestaCorrecta.trim().toLowerCase() === respuesta.trim().toLowerCase();

    res.status(200).json({
      ok: true,
      correcta: esCorrecta,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      mensaje: esCorrecta ? 'Respuesta correcta' : 'Respuesta incorrecta'
    });
  } catch (error) {
    console.error('Error al validar respuesta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno al validar la respuesta'
    });
  }
};

const eliminarPregunta = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminada = await Trivia.findByIdAndDelete(id);

    if (!eliminada) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Pregunta no encontrada'
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Pregunta eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar pregunta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno al eliminar la pregunta'
    });
  }
};




const iniciarTrivia = async (req, res) => {
  try {
    const { usuario } = req.body;

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'El usuario es obligatorio'
      });
    }

    const nuevaSesion = new TriviaSession({
      usuario,
      preguntasUsadas: [],
      puntaje: 0,
      tiempoLimite: 15,
      activa: true
    });

    const sesionGuardada = await nuevaSesion.save();

    res.status(201).json({
      ok: true,
      mensaje: 'Trivia iniciada correctamente',
      data: sesionGuardada
    });
  } catch (error) {
    console.error('Error al iniciar trivia:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno al iniciar trivia'
    });
  }
};

const obtenerSiguientePregunta = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const sesion = await TriviaSession.findById(sessionId);

    if (!sesion || !sesion.activa) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Sesión no encontrada o inactiva'
      });
    }

    const preguntaAleatoria = await Trivia.aggregate([
      {
        $match: {
          _id: {
            $nin: sesion.preguntasUsadas
          }
        }
      },
      {
        $sample: {
          size: 1
        }
      }
    ]);

    if (!preguntaAleatoria.length) {
      sesion.activa = false;
      await sesion.save();

      return res.status(200).json({
        ok: true,
        finalizada: true,
        mensaje: 'No hay más preguntas disponibles',
        puntajeFinal: sesion.puntaje
      });
    }

    const pregunta = preguntaAleatoria[0];

    sesion.preguntaActual = pregunta._id;
    sesion.preguntaInicio = new Date();
    sesion.preguntasUsadas.push(pregunta._id);

    await sesion.save();

    res.status(200).json({
      ok: true,
      tiempoLimite: sesion.tiempoLimite,
      data: {
        _id: pregunta._id,
        pregunta: pregunta.pregunta,
        opciones: pregunta.opciones,
        categoria: pregunta.categoria,
        dificultad: pregunta.dificultad
      }
    });
  } catch (error) {
    console.error('Error al obtener siguiente pregunta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener la siguiente pregunta'
    });
  }
};

const responderPreguntaConTiempo = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { respuesta } = req.body;

    if (!respuesta) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Debes enviar una respuesta'
      });
    }

    const sesion = await TriviaSession.findById(sessionId);

    if (!sesion || !sesion.activa) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Sesión no encontrada o inactiva'
      });
    }

    if (!sesion.preguntaActual || !sesion.preguntaInicio) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No hay una pregunta activa para responder'
      });
    }

    const ahora = new Date();
    const segundosTranscurridos = Math.floor(
      (ahora - sesion.preguntaInicio) / 1000
    );

    const sePasoDelTiempo = segundosTranscurridos > sesion.tiempoLimite;

    const pregunta = await Trivia.findById(sesion.preguntaActual);

    if (!pregunta) {
      return res.status(404).json({
        ok: false,
        mensaje: 'Pregunta no encontrada'
      });
    }

    let esCorrecta = false;

    if (!sePasoDelTiempo) {
      esCorrecta =
        pregunta.respuestaCorrecta.trim().toLowerCase() ===
        respuesta.trim().toLowerCase();

      if (esCorrecta) {
        sesion.puntaje += 10;
      } else {
        sesion.puntaje = 0;
      } 
    } else {
        sesion.puntaje = 0;
    }

    sesion.preguntaActual = null;
    sesion.preguntaInicio = null;

    await sesion.save();

    res.status(200).json({
      ok: true,
      correcta: esCorrecta,
      tiempoAgotado: sePasoDelTiempo,
      segundosTranscurridos,
      respuestaCorrecta: pregunta.respuestaCorrecta,
      puntajeActual: sesion.puntaje,
      mensaje: sePasoDelTiempo
        ? 'Tiempo agotado'
        : esCorrecta
        ? 'Respuesta correcta'
        : 'Respuesta incorrecta'
    });
  } catch (error) {
    console.error('Error al responder pregunta:', error);
    res.status(500).json({
      ok: false,
      mensaje: 'Error interno al responder la pregunta'
    });
  }
};

module.exports = {
  crearPregunta,
  obtenerTodasLasPreguntas,
  obtenerPreguntaAleatoria,
  validarRespuesta,
  eliminarPregunta,

  iniciarTrivia,
  obtenerSiguientePregunta,
  responderPreguntaConTiempo,
};