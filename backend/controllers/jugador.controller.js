const Jugador = require('../models/jugador.model');


// Crear un nuevo jugador
exports.createJugador = async (req, res) => {
    try {
        const { nombre, pista1, pista2, pista3, pista4 } = req.body;

        // Validaciones
        if (!nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio." });
        }

        if (!pista1 || !pista2 || !pista3 || !pista4) {
            return res.status(400).json({
                error: "Todas las pistas (pista1, pista2, pista3, pista4) son obligatorias."
            });
        }

        // Crear jugador
        const jugador = new Jugador({
            nombre,
            pista1,
            pista2,
            pista3,
            pista4
        });

        await jugador.save();

        res.json({
            message: "Jugador creado exitosamente",
            jugador
        });

    } catch (error) {
        console.error("Error al crear jugador:", error);
        res.status(500).json({ error: "Error al crear el jugador" });
    }
};


// Obtener todos los jugadores
exports.getJugadores = async (req, res) => {
    try {
        const jugadores = await Jugador.find();

        res.json(jugadores);
    } catch (error) {
        console.error("Error al obtener jugadores:", error);
        res.status(500).json({ error: "Error al obtener los jugadores" });
    }
};


// Obtener un jugador por ID
exports.getJugadorById = async (req, res) => {
    try {
        const jugador = await Jugador.findById(req.params.id);

        if (!jugador) {
            return res.status(404).json({ error: 'Jugador no encontrado' });
        }

        res.json(jugador);

    } catch (error) {
        console.error("Error al obtener jugador:", error);
        res.status(500).json({ error: 'Error al obtener el jugador' });
    }
};


// Obtener un jugador aleatorio
exports.getRandomJugador = async (req, res) => {
    try {
        const jugadores = await Jugador.aggregate([
            { $sample: { size: 1 } }
        ]);

        if (!jugadores || jugadores.length === 0) {
            return res.status(404).json({
                error: "No hay jugadores registrados en la base de datos."
            });
        }

        res.json(jugadores[0]); 
    } catch (error) {
        console.error("Error al obtener un jugador aleatorio:", error);
        res.status(500).json({ error: "Error al obtener un jugador aleatorio" });
    }
};

// Actualizar un jugador
exports.updateJugador = async (req, res) => {
    try {
        const jugador = await Jugador.findById(req.params.id);

        if (!jugador) {
            return res.status(404).json({ error: "Jugador no encontrado" });
        }

        const updatedJugador = await Jugador.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            message: "Jugador actualizado exitosamente",
            jugador: updatedJugador
        });

    } catch (error) {
        console.error("Error al actualizar jugador:", error);
        res.status(500).json({ error: "Error al actualizar el jugador" });
    }
};


// Eliminar un jugador
exports.deleteJugador = async (req, res) => {
    try {
        const jugador = await Jugador.findById(req.params.id);

        if (!jugador) {
            return res.status(404).json({ error: "Jugador no encontrado" });
        }

        await Jugador.findByIdAndDelete(req.params.id);

        res.json({ message: "Jugador eliminado exitosamente" });

    } catch (error) {
        console.error("Error al eliminar jugador:", error);
        res.status(500).json({ error: "Error al eliminar el jugador" });
    }
};