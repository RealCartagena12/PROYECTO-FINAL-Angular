const HistoriaSensible = require("../models/historiasSensibles.model");

exports.obtenerHistoriasSensibles = async (req, res) => {
  try {
    const data = await HistoriaSensible.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (e) {
    res.status(500).json({ message: "Error obteniendo historias sensibles" });
  }
};

exports.obtenerHistoriaSensiblePorId = async (req, res) => {
  try {
    const item = await HistoriaSensible.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "No encontrada" });
    res.json(item);
  } catch (e) {
    res.status(400).json({ message: "ID inválido" });
  }
};

exports.crearHistoriaSensible = async (req, res) => {
  const nueva = await HistoriaSensible.create(req.body);
  res.status(201).json(nueva);
};

exports.actualizarHistoriaSensible = async (req, res) => {
  const upd = await HistoriaSensible.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!upd) return res.status(404).json({ message: "No encontrada" });
  res.json(upd);
};

exports.eliminarHistoriaSensible = async (req, res) => {
  const del = await HistoriaSensible.findByIdAndDelete(req.params.id);
  if (!del) return res.status(404).json({ message: "No encontrada" });
  res.json({ message: "Eliminada" });
};