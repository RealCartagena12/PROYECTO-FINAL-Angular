const Producto = require('../models/producto.model');

// Crear un nuevo producto

exports.crearProducto = async (req, res) => {
    try {
        const producto = new Producto(req.body);
        const productoGuardado = await producto.save();

        res.status(201).json({
            ok : true,
            mensaje: 'Producto creado exitosamente',
            data: productoGuardado
        });
    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({
            ok : false,
            mensaje: 'Error al crear el producto',
            error: error.message
        });
    }
}

// Obtener todos los productos

exports.obtenerProductos = async (req, res) => {
    try {
        const { categoria, equipo, busqueda, destacado } = req.query;

        const filtro = { activo: true };

        if (categoria) filtro.categoria = categoria;
        if (equipo) filtro.equipo = equipo;
        if (destacado) filtro.destacado = destacado === 'true';

        if (busqueda) {
            filtro.$or = [
                { nombre: { $regex: busqueda, $options: 'i' } },
                {descripcion: { $regex: busqueda, $options: 'i' } },
                { equipo: { $regex: busqueda, $options: 'i' } }
            ];
        }

        const productos = await Producto.find(filtro).sort({ createdAt: -1 });

        res.status(200).json({
            ok : true,
            total: productos.length,
            data: productos
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({
            ok : false,
            mensaje: 'Error al obtener los productos',
            error: error.message
        });
    }
}


// Obtener un producto por ID

exports.obtenerProductoPorId = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                ok : false,
                mensaje: 'Producto no encontrado'
            });
        }

        res.status(200).json({
            ok : true,
            data: producto
        });

    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({
            ok : false,
            mensaje: 'Error al obtener el producto',
            error: error.message
        });
    }
};


// Actualizar un producto

exports.actualizarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!producto) {
            return res.status(404).json({
                ok : false,
                mensaje: 'Producto no encontrado'
            });
        }
        res.status(200).json({
            ok : true,
            mensaje: 'Producto actualizado exitosamente',
            data: producto
        });
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        res.status(500).json({
            ok : false,
            mensaje: 'Error al actualizar el producto',
            error: error.message
        });
    }
}

// Eliminar un producto (marcar como inactivo)

exports.eliminarProducto = async (req, res) => {
    try {
        const producto = await Producto.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });

        if (!producto) {
            return res.status(404).json({
                ok : false,
                mensaje: 'Producto no encontrado'
            });
        }
        res.status(200).json({
            ok : true,
            mensaje: 'Producto eliminado exitosamente',
            data: producto
        });

    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        res.status(500).json({
            ok : false,
            mensaje: 'Error al eliminar el producto',
            error: error.message
        });
    }
}