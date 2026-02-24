const Datos = require('../models/datos.model');

// Obtener todos los datos
exports.getDatos = async (req, res) => {
    try {
        const datos = await Datos.find();
        res.status(200).json(datos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los datos', error });
    }

};
// Obtener un dato por ID
exports.getDatoById = async (req, res) => {
    try {
        const dato = await Datos.findById(req.params.id);
        if (!dato) {
            return res.status(404).json({ message: 'Dato no encontrado' });
        }
}catch (error) {
        res.status(500).json({ message: 'Error al obtener el dato', error });
    }
};

// Crear un nuevo dato
exports.createDatos = async (req, res) => {
    try {
        const nuevoDato = new Datos(req.body);
        await nuevoDato.save();
        res.status(201).json(nuevoDato);
    }catch (error) {
        res.status(500).json({ message: 'Error al crear el dato', error });
    }
};

// Actualizar un dato existente
exports.updateDato = async (req, res) => {
    try {
        const updatedDato = await Datos.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDato) {
            return res.status(404).json({ message: 'Dato no encontrado' });
        }
        res.status(200).json(updatedDato);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el dato', error });
    }
};

// Eliminar un dato
exports.deleteDato = async (req, res) => {
    try {
        const deletedDato = await Datos.findByIdAndDelete(req.params.id);
        if (!deletedDato) {
            return res.status(404).json({ message: 'Dato no encontrado' });
        }
    }catch (error) {
        res.status(500).json({ message: 'Error al eliminar el dato', error });
    }

};