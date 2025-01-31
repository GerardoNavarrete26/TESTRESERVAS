const express = require("express");
const { obtenerReservas, crearReserva, actualizarReserva, eliminarReserva } = require("../controllers/reservaController");

const router = express.Router();

// Obtener todas las reservas
router.get("/", obtenerReservas);

// Crear una nueva reserva
router.post("/", crearReserva);

// Actualizar una reserva por ID
router.put("/:id", actualizarReserva);

// Eliminar una reserva por ID
router.delete("/:id", eliminarReserva);

module.exports = router;