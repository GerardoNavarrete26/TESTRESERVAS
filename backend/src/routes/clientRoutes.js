const express = require("express");
const { obtenerClientes, crearCliente, actualizarCliente, eliminarCliente } = require("../controllers/clientController");

const router = express.Router();

router.get("/", obtenerClientes);  // Obtener todos los clientes
router.post("/", crearCliente);    // Crear un nuevo cliente
router.put("/:id", actualizarCliente); // Actualizar un cliente por ID
router.delete("/:id", eliminarCliente); // Eliminar un cliente por ID

module.exports = router;
