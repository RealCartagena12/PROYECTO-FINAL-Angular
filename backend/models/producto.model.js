const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    descripcion: {
      type: String,
      required: true
    },
    categoria: {
      type: String,
      enum: ['camisetas', 'gorras', 'accesorios', 'balones', 'chaquetas'],
      required: true
    },
    equipo: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true,
      min: 0
    },
    descuento: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    imagen: {
      type: String,
      required: true
    },
    tallas: {
      type: [String],
      default: []
    },
    colores: {
      type: [String],
      default: []
    },
    rating: {
      type: Number,
      default: 4.5
    },
    envioGratis: {
      type: Boolean,
      default: false
    },
    destacado: {
      type: Boolean,
      default: false
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Producto', productoSchema);