const moongoose = require('mongoose');

const datosSchema = new moongoose.Schema({
    titulo:{ type: String, required: true },
    descripcion:{ type: String, required: true },
    imagen : {type: String, required: true }
});

module.exports = moongoose.model('Datos', datosSchema);