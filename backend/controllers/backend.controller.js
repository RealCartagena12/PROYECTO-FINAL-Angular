const authService = require('../services/auth.service');
const User = require('../models/backend.model');
const {enviarCorreoRegistro} = require('../services/email.service');


exports.register = async (req, res,) => {
     try {
    // 🔥 DEBUG (te va a decir si viene email)
    console.log('REGISTER BODY =>', req.body);

    const nuevoUsuario = await authService.registerUser(req.body);

    // ✅ usa el email que YA guardaste (más confiable)
  try {   
    await enviarCorreoRegistro(nuevoUsuario.email, nuevoUsuario.nombre);

  }catch (e) {
    console.error('Error enviando correo de registro:', e);
  }

    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: nuevoUsuario
    });

  } catch (error) {
    console.error('Error en el registro:', error);

    // Duplicado mongo
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El correo ya existe' });
    }

    return res.status(error.status || 500).json({
      message: error.message || 'Error interno del servidor'
    });
};
}


exports.login = async (req, res,) => {
    try {
        const result = await authService.loginUser(req.body);
        res.status(200).json(result);
    } catch (error) {
        console.error( 'Error en el login' ,error);
        return res.status(error.status || 500).json({ message: error.message || 'Error interno del servidor' });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        return res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
}


exports.actualizarPuntaje = async (req, res) => {
    try {
        const userId = req.user.id;
        const {delta, puntaje} = req.body;

        if (typeof delta === 'number'){
            const updated = await User.findByIdAndUpdate(
                userId,
                { $inc: { puntaje: delta } },
                { new: true }
            ).select('-password');
            return res.json (updated);
        }
        if (typeof puntaje === 'number'){
            const updated = await User.findByIdAndUpdate(
                userId,
                { puntaje: puntaje },
                { new: true }
            ).select('-password');
            return res.json (updated);
        }
        return res.status(400).json({ error: 'Envia {delta: number} o {puntaje: number} en el cuerpo' });
    } catch (error) {
        console.error('Error al actualizar puntaje:', error);
        res.status(500).json({ error: 'Error al actualizar puntaje' });
    }
};




exports.verifyMfa = async (req, res) => {
  try {
    const result = await authService.verifyMfa(req.body);
    res.status(200).json(result);

  } catch (error) {
    console.error('Error verificando MFA:', error);
    return res.status(error.status || 500).json({ message: error.message || 'Error interno del servidor' });
  }
};

exports.resendMfa = async (req, res) => {
  try {
    const result = await authService.resendMfaCode(req.body);
    res.status(200).json(result);
  }catch (error) {
    console.error('Error reenviando código MFA:', error);
    return res.status(error.status || 500).json({ message: error.message || 'Error interno del servidor' });
  }
};
