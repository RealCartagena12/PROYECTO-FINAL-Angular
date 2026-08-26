const orden = require("../models/orden.model");
const Producto = require("../models/producto.model");


// Crear una nueva orden

exports.crearOrdenSimulada = async (req, res) => {
    try {
        const { usuario, productos, metodoPago, direccionEnvio } = req.body;

        if (!usuario || !productos || productos.length === 0 || !metodoPago || !direccionEnvio) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Faltan campos obligatorios'
            });
        }
        let subtotal = 0;
        const productosorden = [];

        for (const item of productos) {
            const productoDB = await Producto.findById(item.producto);

            if (!productoDB || !productoDB.activo) {
                return res.status(404).json({
                    ok: false,
                    mensaje: `Producto: ${item.productoId} no encontrado`
                });
            }
            if (productoDB.stock < item.cantidad) {
                return res.status(400).json({
                    ok: false,
                    mensaje: `Stock insuficiente para el producto: ${productoDB.nombre}`
                });
            }

            const precioFinal = productoDB.precio - (productoDB.precio * (productoDB.descuento / 100));
            subtotal += precioFinal * item.cantidad;

            productosorden.push({
                producto: productoDB._id,
                nombre: productoDB.nombre,
                precio: precioFinal,
                cantidad: item.cantidad,
                talla: item.talla || '',
                color: item.color || '',
            });

            productoDB.stock -= item.cantidad;
            await productoDB.save();
        }
        const envio = subtotal >= 200000 ? 0 : 12000;
        const total = subtotal + envio;

        const aprobado = Math.random() < 0.15;

        const nuevaOrden = new orden({
            usuario,
            productos: productosorden,
            subtotal,
            envio,
            total,
            metodoPago,
            estadoPago: aprobado ? 'simulado_aprobado' : 'simulado_rechazado',
            estadoOrden: aprobado ? 'pagada' : 'creada',
            direccionEnvio,
            referenciaPago : `SIM-${Date.now()}`
        });
        const ordenGuardada = await nuevaOrden.save();

        res.status(201).json({
            ok: true,
            mensaje: aprobado ? 'Orden creada y aprobada exitosamente' : 'Orden creada pero rechazada en simulación',
            data: ordenGuardada
        });
    } catch (error) {
        console.error('Error al crear la orden:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al crear la orden',
            error: error.message
        });
    }
};

// Obtener todas las ordenes
exports.obtenerOrdenes = async (req, res) => {
    try {
        const ordenes = await orden.find().sort({ createdAt: -1 });

        res.status(200).json({
            ok: true,
            total: ordenes.length,
            data: ordenes
        });
    } catch (error) {
        console.error('Error al obtener las ordenes:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener las ordenes',
            error: error.message
        });
    }
};

// Obtener orden por ID
exports.obtenerOrdenPorId = async (req, res) => {
    try {
        const orden = await orden.findById(req.params.id).populate('productos.producto');

        if (!orden) {
            return res.status(404).json({
                ok: false,
                mensaje: 'Orden no encontrada'
            });
        }

        res.status(200).json({
            ok: true,
            data: orden
        });

    } catch (error) {
        console.error('Error al obtener la orden:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al obtener la orden',
            error: error.message
        });
    }
};
