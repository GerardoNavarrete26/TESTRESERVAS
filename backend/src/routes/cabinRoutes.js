const express = require("express");
const { obtenerCabanas, crearCabana, actualizarCabana, eliminarCabana } = require("../controllers/cabinController");

const router = express.Router();

router.get("/", obtenerCabanas);  // Obtener todas las cabañas
router.post("/", crearCabana);    // Crear una nueva cabaña
router.put("/:id", actualizarCabana); // Actualizar una cabaña por ID
router.delete("/:id", eliminarCabana); // Eliminar una cabaña por ID

module.exports = router;
