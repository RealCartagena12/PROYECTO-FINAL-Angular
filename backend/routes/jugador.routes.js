const express = require('express');
const router = express.Router();
const jugadorController = require('../controllers/jugador.controller');



// RUTAS  Jugador
router.post('/', jugadorController.createJugador);
router.get('/', jugadorController.getJugadores);
router.get('/random', jugadorController.getRandomJugador);
router.get('/:id', jugadorController.getJugadorById);
router.put('/:id', jugadorController.updateJugador);
router.delete('/:id', jugadorController.deleteJugador);

module.exports = router;
