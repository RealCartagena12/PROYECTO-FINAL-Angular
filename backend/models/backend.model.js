const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    equipo : { type: String, required: true },
    password : { type: String, required: true, select: false, minlength: 6 },
    puntaje: { type: Number, default: 0},
    rol : { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
    mfaEnabled: { type: Boolean, default: true },
    mfaToken: { type: String, default: null },
    mfaCodeHash: { type: String, default: null },
    mfaCodeExpiresAt: { type: Date, default: null },
    mfaVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);