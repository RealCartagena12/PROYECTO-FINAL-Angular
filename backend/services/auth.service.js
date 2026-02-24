const User = require('../models/backend.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { enviarCorreoMfa } = require('./email.service');


function genCode() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 dígitos
}
function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}


//  REGISTRO
async function registerUser({ nombre, email, equipo, password }) {
   if (!nombre || !email || !equipo || !password) {
    const error = new Error('Todos los campos son obligatorios');
    error.status = 400;
    throw error;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const error = new Error('El correo ya existe');
    error.status = 400;
    throw error;
  }

  const newUser = new User({ nombre, email, equipo, password });
  await newUser.save();

  return newUser; // ✅ devuelve el usuario creado
}


// LOGIN
async function loginUser({ email, password }) {
    if (!email || !password) {
        const error = new Error('Correo y contraseña son obligatorios');
        error.status = 400;
        throw error;
    }
    const user = await User.findOne({ email }).select('+password');

    if (!user || user.password !== password) {
        const error = new Error('Correo o contraseña incorrectos');
        error.status = 401;
        throw error;
    }

   const mfaEnabled = String(process.env.Mfa_Enabled || 'true') === 'true';

  if (mfaEnabled) {
    const code = genCode();
    const mfaToken = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

    user.mfaToken = mfaToken;
    user.mfaCodeHash = hashCode(code);
    user.mfaCodeExpiresAt = expiresAt;
    await user.save();

  
    // ✅ IMPORTANTE: enviar el código por correo
    await enviarCorreoMfa(user.email, user.nombre, code);

    return {
      message: 'MFA requerido',
      mfaRequired: true,
      mfaToken,
    };
  }

  // ✅ Tu login normal (NO se toca)
  const token = jwt.sign(
    { id: user._id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  return {
    message: 'Login exitoso',
    token,
    user: { id: user._id, nombre: user.nombre, email: user.email, equipo: user.equipo, rol: user.rol },
  };
}   


 async function verifyMfa({ mfaToken, code }) {
    const user = await User.findOne({ mfaToken});
    if (!user) {
      const err = new Error('Sesión MFA inválida o expirada. Inicia sesión de nuevo');
      err.status = 400;
      throw err;
    }
 if (!user.mfaCodeExpiresAt || user.mfaCodeExpiresAt.getTime() < Date.now()) {
    const err = new Error('El código expiró. Reenvía el código.');
    err.status = 400;
    throw err;
  }

  const codeHash = hashCode(code);
  if (codeHash !== user.mfaCodeHash) {
    const err = new Error('Código incorrecto.');
    err.status = 400;
    throw err;
  }

  // Limpia MFA
  user.mfaToken = null;
  user.mfaCodeHash = null;
  user.mfaCodeExpiresAt = null;
  user.mfaVerified = true;
  await user.save();

  // Ahora sí entregamos token
  const token = jwt.sign(
    { id: user._id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      equipo: user.equipo,
      rol: user.rol,
    },
  };
}

// ✅ Reenviar código MFA
async function resendMfaCode({ mfaToken }) {
  const user = await User.findOne({ mfaToken });
  if (!user) {
    const err = new Error('Sesión MFA inválida. Inicia sesión de nuevo.');
    err.status = 400;
    throw err;
  }

  const code = genCode();
  user.mfaCodeHash = hashCode(code);
  user.mfaCodeExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await enviarCorreoMfa(user.email, user.nombre, code);
  return { message: 'Código reenviado.' };
}




module.exports = {
    registerUser,
    loginUser,
    verifyMfa,
    resendMfaCode,
};