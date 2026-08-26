const mongoose = require('mongoose');

const triviaSessionSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true
    },
    preguntasUsadas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Trivia'
      }
    ],
    preguntaActual: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trivia',
      default: null
    },
    preguntaInicio: {
      type: Date,
      default: null
    },
    puntaje: {
      type: Number,
      default: 0
    },
    tiempoLimite: {
      type: Number,
      default: 15
    },
    activa: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('TriviaSession', triviaSessionSchema);