const express = require('express');
const router = express.Router();

const { authRequired } = require('../middleware/backend.authmiddleware');
const { actualizarPuntaje } = require('../controllers/backend.controller');


router.post('/sumar', authRequired, actualizarPuntaje);

module.exports = router;
