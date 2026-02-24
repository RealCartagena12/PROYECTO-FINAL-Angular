const express = require('express'); 
const router = express.Router();
const indexController = require('../controllers/index.controller');

// Rutas para el carrusel
router.get('/carrusel', indexController.obtenerCarrusel);
router.post('/carrusel', indexController.agregarCarrusel);
router.put('/carrusel/:id', indexController.actualizarCarrusel);
router.delete('/carrusel/:id', indexController.eliminarCarrusel);

module.exports = router;