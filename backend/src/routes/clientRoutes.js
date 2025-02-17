const express = require("express");
const { obtenerClientes, crearCliente, actualizarCliente, eliminarCliente , obtenerClientePorDocumento } = require("../controllers/clientController");

const router = express.Router();

router.get("/", obtenerClientes);  // Obtener todos los clientes
router.post("/", crearCliente);    // Crear un nuevo cliente
router.put("/:id", actualizarCliente); // Actualizar un cliente por ID
router.delete("/:id", eliminarCliente); // Eliminar un cliente por ID
// Buscar cliente por número de documento
router.get("/", obtenerClientePorDocumento);

module.exports = router;
