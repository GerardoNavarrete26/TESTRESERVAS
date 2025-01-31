require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("../config/db");

const cabanaRoutes = require("../routes/cabanaRoutes");
const reservaRoutes = require("../routes/reservaRoutes");

const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Rutas con prefijo /api/
app.use("/api/cabanas", cabanaRoutes);
app.use("/api/reservas", reservaRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
