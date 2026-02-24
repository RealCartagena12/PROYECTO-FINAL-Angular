const express = require("express");
const router = express.Router();
const controller = require("../controllers/historiasSensibles.controller");

// público (sin token)
router.get("/", controller.obtenerHistoriasSensibles);
router.get("/:id", controller.obtenerHistoriaSensiblePorId);

router.post("/",  controller.crearHistoriaSensible);
router.put("/:id",  controller.actualizarHistoriaSensible);
router.delete("/:id",  controller.eliminarHistoriaSensible);

module.exports = router;
