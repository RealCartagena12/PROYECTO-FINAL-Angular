const Carrusel = require('../models/index.model');



exports.obtenerCarrusel = async (req, res) => {
    try {
        const carruselItems =  await Carrusel.find();
        res.status(200).json(carruselItems);
    }catch (error) {
        res.status(500).json({ message: 'Error al obtener los elementos del carrusel', error });
    }
};


exports.agregarCarrusel = async (req, res) => {
    try {
        const nuevo = new Carrusel(req.body);
        await nuevo.save();
        res.status(201).json(nuevo);
    }catch (error) {
        res.status(400).json({ message: 'Error al agregar el elemento al carrusel', error });
    }
};

exports.actualizarCarrusel = async (req, res) => {
  try {
    const { id } = req.params;

    const actualizado = await Carrusel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!actualizado) {
      return res.status(404).json({
        message: "Elemento del carrusel no encontrado"
      });
    }

    return res.status(200).json(actualizado);

  } catch (error) {
    return res.status(500).json({
      message: "Error al actualizar el elemento del carrusel",
      error
    });
  }
};


exports.eliminarCarrusel = async (req, res) => {
    try {
        const { id } = req.params;
        const eliminado = await Carrusel.findByIdAndDelete(id);
        if (!eliminado) {
            return res.status(404).json({ message: 'Elemento del carrusel no encontrado' });
        }
        res.status(200).json({ message: 'Elemento del carrusel eliminado correctamente' });
    }catch (error) {
        res.status(500).json({ message: 'Error al eliminar el elemento del carrusel', error });
    }
};