const moongose = require("mongoose");

const historiasSchema = new moongose.Schema({
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String, required: true },
    fuente: { type: String, required: true },
});

module.exports = moongose.model("Historia", historiasSchema);