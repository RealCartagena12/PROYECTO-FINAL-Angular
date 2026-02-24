const Historia = require("../models/historias.model.js");


// Obtener todas las historias
exports.getHistorias = async (req, res) => {
    try {
        const historias = await Historia.find();
        res.json(historias);
    }catch (error) {
        console.error("Error al obtener historias:", error);
        res.status(500).json({ error: "Error al obtener las historias" });
    }
};

// Obtener una historia por ID
exports.getHistoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const historia = await Historia.findById(id);
        if (!historia) {
            return res.status(404).json({ error: "Historia no encontrada" });
        }
    }catch (error) {
        console.error("Error al obtener historia:", error);
        res.status(500).json({ error: "Error al obtener la historia" });
    }
};



// Crear una nueva historia
exports.createHistoria = async (req, res) => {
    try {
        const { titulo, descripcion, imagen, fuente } = req.body;

        // Validaciones
        if (!titulo || !descripcion || !imagen || !fuente) {
            return res.status(400).json({ error: "Todos los campos son obligatorios." });
        }
        const nuevaHistoria = new Historia({ titulo, descripcion, imagen, fuente });
        await nuevaHistoria.save();
        res.status(201).json(nuevaHistoria);

    }catch (error) {
        console.error("Error al crear historia:", error);
        res.status(500).json({ error: "Error al crear la historia" });
    }
};

// Actualizar una historia
exports.updateHistoria = async (req, res) => {
    try{
        const { id } = req.params;
        const { titulo, descripcion, imagen, fuente } = req.body;
        const historiaActualizada = await Historia.findByIdAndUpdate
        (
            id,
            { titulo, descripcion, imagen, fuente },
            { new: true }
        );
        if (!historiaActualizada) {
            return res.status(404).json({ error: "Historia no encontrada" });
        }
    }catch (error) {
        console.error("Error al actualizar historia:", error);
        res.status(500).json({ error: "Error al actualizar la historia" });
    }
};

// Eliminar una historia
exports.deleteHistoria = async (req, res) => {
    try{
        const { id } = req.params;
        const historiaEliminada = await Historia.findByIdAndDelete(id);
        if (!historiaEliminada) {
            return res.status(404).json({ error: "Historia no encontrada" });
        }
    }catch (error) {
        console.error("Error al eliminar historia:", error);
        res.status(500).json({ error: "Error al eliminar la historia" });
    }
};