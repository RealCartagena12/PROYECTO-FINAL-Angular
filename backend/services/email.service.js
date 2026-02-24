const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,},
    tls: {
      rejectUnauthorized: false
    }
});

async function enviarCorreoRegistro(email, nombre) {
  console.log('EMAIL DESTINO =>', email); // 👈 esto debe imprimir un correo real

  if (!email) throw new Error('Email destino no definido (to vacío)');

  const info = await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Bienvenido a Momentos NFL',
    html: `<h2>¡Bienvenido ${nombre || ""}!</h2><p>Tu registro en Momentos NFL fue exitoso, ya puedes dar tu aporte a la comunidad y disfrutar de los minijuegos  ✅</p>`
  });

  return info;

}


async function enviarCorreoMfa(email, nombre, code) {
  if (!email) throw new Error('Email destino no definido (to vacío)');

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Código de verificación para Momentos NFL',
    html: `<h2>Hola ${nombre || ""},</h2><p>Tu código de verificación es: <b>${code}</b>. Este código es válido por 5 minutos.</p>`,
  });
}


module.exports = {
    enviarCorreoRegistro
    , enviarCorreoMfa,
};