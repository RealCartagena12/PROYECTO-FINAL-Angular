const dotenv = require("dotenv");
// Cargar variables de entorno
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('ENV CHECK =>', {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS ? 'OK' : 'NO PASS'
});


const express = require("express");
const cors = require("cors"); 
const connectDB = require("./config/db");

const userRoutes = require("./routes/backend.routes");
const jugadorRoutes = require("./routes/jugador.routes");

// Crear app
const app = express();

//CORS
// CORS
const cors = require("cors");

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:4200",
  "http://proyecto-final-front-jose-2026.s3-website-us-east-2.amazonaws.com",
  // por si luego usas CloudFront (https)
  "https://proyecto-final-front-jose-2026.s3-website-us-east-2.amazonaws.com",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Permitir requests sin Origin (Postman/curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) return callback(null, true);

    // En vez de lanzar error (a veces confunde), mejor "false"
    return callback(null, false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// IMPORTANTÍSIMO: preflight (OPTIONS)
// En Express nuevo, '*' a veces da problemas; usa regex:
app.options(/.*/, cors(corsOptions));




// Parseo JSON
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Comprobar estado del server
app.get("/api/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date() });
});

// Rutas API
//api usarios
app.use("/api/users", userRoutes);
//api jugadores
app.use("/api/jugadores", jugadorRoutes);
//api puntaje
app.use("/api/puntaje", require("./routes/puntaje.routes"));
//api datos
app.use("/api/datos", require("./routes/datos.routes"));
//api historias
app.use("/api/historias", require("./routes/historias.routes"));
//api historias sensibles
app.use("/api/historias-sensibles", require("./routes/historiasSensibles.routes"));
//api carrusel
app.use("/api", require("./routes/index.routes"));


// Iniciar servidor
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

