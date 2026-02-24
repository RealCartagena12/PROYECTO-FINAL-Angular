const express = require("express");
const router = express.Router();
const historiasController = require("../controllers/historias.controller.js");
const { authRequired, adminOnly } = require("../middleware/backend.authmiddleware.js");

// Rutas para historias PUBLICAS
router.get("/", historiasController.getHistorias);
router.get("/:id", historiasController.getHistoriaById);


// Rutas para historias PROTEGIDAS (solo admin)
router.post("/", authRequired, adminOnly, historiasController.createHistoria);
router.put("/:id", authRequired, adminOnly, historiasController.updateHistoria);
router.delete("/:id", authRequired, adminOnly, historiasController.deleteHistoria);

module.exports = router;