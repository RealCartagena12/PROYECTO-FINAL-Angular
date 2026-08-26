const express = require('express');
const router = express.Router();
const {
  crearPregunta,
  obtenerTodasLasPreguntas,
  obtenerPreguntaAleatoria,
  validarRespuesta,
  eliminarPregunta,
  iniciarTrivia,
  obtenerSiguientePregunta,
  responderPreguntaConTiempo
} = require('../controllers/trivia.controller');



router.post('/iniciar', iniciarTrivia);
router.get('/session/:sessionId/siguiente', obtenerSiguientePregunta);
router.post('/session/:sessionId/responder', responderPreguntaConTiempo);

router.post('/', crearPregunta);
router.get('/', obtenerTodasLasPreguntas);
router.get('/random', obtenerPreguntaAleatoria);
router.post('/:id/responder', validarRespuesta);
router.delete('/:id', eliminarPregunta);


module.exports = router;

//MONGO_URI=mongodb://admin:secreto@mongo-db:27017/mi_db?authSource=admin 