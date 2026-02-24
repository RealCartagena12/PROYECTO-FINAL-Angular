const express = require('express');
const router = express.Router();
const datosController = require('../controllers/datos.controller');

router.get('/', datosController.getDatos);
router.get('/:id', datosController.getDatoById);
router.post('/', datosController.createDatos);
router.put('/:id', datosController.updateDato);
router.delete('/:id', datosController.deleteDato);

module.exports = router;