const Cabana = require("../models/cabanaModels");

// Obtener todas las cabañas
const obtenerCabanas = async (req, res) => {
    try {
        const cabanas = await Cabana.find();
        res.json(cabanas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener cabañas", error });
    }
};

// Crear una nueva cabaña
const crearCabana = async (req, res) => {
    try {
        const { tipo, numero } = req.body;

        // Verificar si el número de cabaña ya existe
        const cabanaExistente = await Cabana.findOne({ numero });
        if (cabanaExistente) {
            return res.status(400).json({ mensaje: "El número de cabaña ya existe" });
        }

        const nuevaCabana = new Cabana({ tipo, numero });
        await nuevaCabana.save();

        res.status(201).json(nuevaCabana);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear cabaña", error });
    }
};

// Actualizar una cabaña por ID
const actualizarCabana = async (req, res) => {
    try {
        const cabanaActualizada = await Cabana.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cabanaActualizada) {
            return res.status(404).json({ mensaje: "Cabaña no encontrada" });
        }
        res.json(cabanaActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar cabaña", error });
    }
};

// Eliminar una cabaña por ID
const eliminarCabana = async (req, res) => {
    try {
        const cabanaEliminada = await Cabana.findByIdAndDelete(req.params.id);
        if (!cabanaEliminada) {
            return res.status(404).json({ mensaje: "Cabaña no encontrada" });
        }
        res.json({ mensaje: "Cabaña eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar cabaña", error });
    }
};

// Exportar todas las funciones al final
module.exports = {
    obtenerCabanas,
    crearCabana,
    actualizarCabana,
    eliminarCabana
};