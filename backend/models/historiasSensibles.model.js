const mongoose = require("mongoose");

const historiaSensibleSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    imagen: { type: String, required: true },
    fuente: { type: String, required: true },
    // opcional: para que el disclaimer sea más “fuerte” si quieres
    advertencia: { type: String, default: "Contenido sensible" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HistoriaSensible", historiaSensibleSchema);
