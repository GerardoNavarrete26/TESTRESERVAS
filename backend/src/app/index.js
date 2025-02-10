require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conectarDB = require("../config/db");  // Asegúrate de que la ruta sea correcta

// Rutas de cliente, cabaña y reserva
const clientRoutes = require("../routes/clientRoutes");
const cabinRoutes = require("../routes/cabinRoutes");
const reservationRoutes = require("../routes/reservationRoutes");

const app = express();

// Conectar a la base de datos
conectarDB();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas con prefijo /api/
app.use("/api/clients", clientRoutes);  // Ruta para clientes
app.use("/api/cabins", cabinRoutes);  // Ruta para cabañas
app.use("/api/reservations", reservationRoutes);  // Ruta para reservas

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
