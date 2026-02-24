const express = require('express');
const router = express.Router();


const {
  register,
  login,
  deleteUser,
  getUsers,
  actualizarPuntaje,
  verifyMfa,
  resendMfa
} = require('../controllers/backend.controller');

const { authRequired } = require('../middleware/backend.authmiddleware');

// ✅ Rutas
router.post('/registrar', register);
router.post('/logear', login);
router.put('/puntaje', authRequired, actualizarPuntaje);
router.get('/usuarios', getUsers);
router.delete('/eliminar/:id', deleteUser);



router.post('/mfa/verify', verifyMfa);
router.post('/mfa/resend', resendMfa);

router.get('/perfil', authRequired, (req, res) => {
  res.json({ message: 'Acceso concedido a la ruta privada', user: req.user });
});

module.exports = router;
