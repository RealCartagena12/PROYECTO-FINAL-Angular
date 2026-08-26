const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema(
    {
        usuario: {
            type: String,
            required: true
        },

        productos: [
            {
                producto: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Producto',
                    required: true
                },
                nombre: String,
                precio: Number,
                cantidad: Number,
                talla: String,
                color: String
            }
        ],
        subtotal: {
            type: Number,
            required: true
        },
        envio: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        },
        metodoPago: {
            type: String,
            enum: ['tarjeta', 'pse', 'efectivo', 'nequi'],
            required: true
        },
        estadoPago: {
            type: String,
            enum: ['pendiente', 'simulado_aprobado', 'simulado_rechazado'],
            default: 'pendiente'
        },
        estadoOrden: {
            type: String,
            enum: ['creada', 'pagada', 'preparando', 'enviada', 'entregada', 'cancelada'],
            default: 'creada'
        },
        direccionEnvio: {
            nombre: String,
            ciudad: String,
            direccion: String,
            telefono: String
        },
        referenciaPago: {
            type: String,
        },
        notaSimulcion: {
            type: String,
            default: 'Compra simulada, no se realizará ningún cargo real.'
        }

    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model('Orden', ordenSchema);