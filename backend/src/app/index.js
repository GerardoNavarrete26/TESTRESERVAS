require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("../config/db");

const app = express();

// Conectar a la base de datos
conectarDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get("/", (req, res) => res.send("API de reservas funcionando 🚀"));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
