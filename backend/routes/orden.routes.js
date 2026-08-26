const express = require("express");
const router = express.Router();
const ordenController = require("../controllers/orden.controller");


// Rutas para ordenes
router.post("/", ordenController.crearOrdenSimulada);
router.get("/", ordenController.obtenerOrdenes);
router.get("/:id", ordenController.obtenerOrdenPorId);

module.exports = router;