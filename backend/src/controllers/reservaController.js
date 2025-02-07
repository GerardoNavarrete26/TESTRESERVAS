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
        console.log("🔍 BODY RECIBIDO:", req.body);

        const { cliente, cabana, fechaInicio, fechaFin, canalOrigen } = req.body;

        // Verificar que todos los campos requeridos están presentes
        if (!cliente || !cabana || !fechaInicio || !fechaFin || !canalOrigen) {
            return res.status(400).json({ mensaje: "Todos los campos (cliente, cabana, fechaInicio, fechaFin, canalOrigen) son requeridos" });
        }

        // Verificar si la cabaña existe
        const cabanaDisponible = await Cabana.findById(cabana);
        if (!cabanaDisponible) {
            return res.status(400).json({ mensaje: "La cabaña no existe" });
        }

        // Buscar la última reserva activa de la cabaña
        const ultimaReserva = await Reserva.findOne({ cabana }).sort({ fechaFin: -1 });

        // Si hay una reserva activa, verificar que la nueva comience después
        if (ultimaReserva && new Date(fechaInicio) <= new Date(ultimaReserva.fechaFin)) {
            return res.status(400).json({
                mensaje: `Cabaña no disponible en estas fechas, la última reserva termina el ${ultimaReserva.fechaFin}`
            });
        }

        // Crear la nueva reserva con canalOrigen
        const nuevaReserva = new Reserva({ 
            cliente, 
            cabana, 
            fechaInicio, 
            fechaFin, 
            canalOrigen,  // 🔹 Asegurar que se está incluyendo
            estado: "pendiente" 
        });
        await nuevaReserva.save();

        // Marcar la cabaña como "reservado"
        cabanaDisponible.estado = "reservado";
        await cabanaDisponible.save();

        console.log("✅ Reserva creada con éxito:", nuevaReserva);
        res.status(201).json(nuevaReserva);
    } catch (error) {
        console.error("❌ Error al crear reserva:", error);
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
