// ACTUALIZAR PUNTAJE
const User = require("../models/backend.model.js");

exports.sumarPunto = async (req, res) => {
    try {
        const userId = req.user.id; 

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

        user.puntaje += 1;
        await user.save();

        res.json({
            message: "Punto añadido",
            puntaje: user.puntaje
        });

    } catch (error) {
        console.error("Error al sumar puntaje:", error);
        res.status(500).json({ error: "Error al sumar puntaje" });
    }
};