const express = require("express");
const { obtenerCabanas, crearCabana, actualizarCabana, eliminarCabana } = require("../controllers/cabanaController");

const router = express.Router();

// Obtener todas las cabañas
router.get("/", obtenerCabanas);

// Crear una nueva cabaña
router.post("/", crearCabana);

// Actualizar una cabaña por ID
router.put("/:id", actualizarCabana);

// Eliminar una cabaña por ID
router.delete("/:id", eliminarCabana);

module.exports = router;