const mongoose = require('mongoose');

const triviaSchema = new mongoose.Schema(
  {
    pregunta: {
      type: String,
      required: true,
      trim: true
    },
    opciones: {
      type: [String],
      required: true,
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length === 4;
        },
        message: 'La pregunta debe tener exactamente 4 opciones.'
      }
    },
    respuestaCorrecta: {
      type: String,
      required: true,
      trim: true
    },
    categoria: {
      type: String,
      default: 'NFL General',
      trim: true
    },
    dificultad: {
      type: String,
      enum: ['facil', 'media', 'dificil'],
      default: 'media'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);




module.exports = mongoose.model('Trivia', triviaSchema);
