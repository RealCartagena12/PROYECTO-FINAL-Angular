const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
    codigo : { type: String, default: 'CEDULA' },
    descripcion: { type: String, default: 'IDENTIFICADOR DE PERSONA EN FUENTE' },
});

module.exports = mongoose.model('Persona', personaSchema);