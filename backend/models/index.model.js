const moongose = require('mongoose');

const carruselSchema = new moongose.Schema({
    titulo: { type: String, required: true},
    descripcion: { type: String, required: true},
    imagen: { type: String, required: true},
    fuente: { type: String, required: true},    
});

module.exports = moongose.model('Carrusel', carruselSchema);