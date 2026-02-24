const mongoose = require('mongoose');

const jugadorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    pista1: { type: String, required: true },
    pista2: { type: String, required: true },
    pista3: { type: String, required: true },
   pista4: { type: String, required: true },
});

module.exports = mongoose.model('Jugador', jugadorSchema);