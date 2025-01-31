const Reserva = require("../models/reservaModels");
const Cabana = require("../models/cabanaModels");

// Obtener todas las reservas
const obtenerReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().populate("cabana");
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener reservas", error });
    }
};

// Crear una nueva reserva
const crearReserva = async (req, res) => {
    try {
        const { cliente, cabana, fechaInicio, fechaFin } = req.body;

        // Verificar si la cabaña está disponible
        const cabanaDisponible = await Cabana.findById(cabana);
        if (!cabanaDisponible || cabanaDisponible.estado === "reservado") {
            return res.status(400).json({ mensaje: "Cabaña no disponible" });
        }

        // Crear la reserva
        const nuevaReserva = new Reserva({ cliente, cabana, fechaInicio, fechaFin, estado: "pendiente" });
        await nuevaReserva.save();

        // Marcar la cabaña como reservada
        cabanaDisponible.estado = "reservado";
        await cabanaDisponible.save();

        res.status(201).json(nuevaReserva);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear reserva", error });
    }
};

// Actualizar una reserva por ID
const actualizarReserva = async (req, res) => {
    try {
        const reservaActualizada = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!reservaActualizada) {
            return res.status(404).json({ mensaje: "Reserva no encontrada" });
        }
        res.json(reservaActualizada);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar reserva", error });
    }
};

// Eliminar una reserva por ID
const eliminarReserva = async (req, res) => {
    try {
        const reservaEliminada = await Reserva.findByIdAndDelete(req.params.id);
        if (!reservaEliminada) {
            return res.status(404).json({ mensaje: "Reserva no encontrada" });
        }

        // Marcar la cabaña como disponible nuevamente
        const cabana = await Cabana.findById(reservaEliminada.cabana);
        if (cabana) {
            cabana.estado = "disponible";
            await cabana.save();
        }

        res.json({ mensaje: "Reserva eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar reserva", error });
    }
};

// Exportar todas las funciones al final
module.exports = {
    obtenerReservas,
    crearReserva,
    actualizarReserva,
    eliminarReserva
};
