const mongoose = require("mongoose");

const reservaSchema = new mongoose.Schema({
    cliente: {
        nombre: { type: String, required: true },
        email: { type: String, required: true },
        telefono: { type: String, required: true }
    },
    cabana: { type: mongoose.Schema.Types.ObjectId, ref: "Cabana", required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    fechaCreacion: { type: Date, default: Date.now },
    canalOrigen: { type: String, enum: ["PaginaWeb", "Directo", "Booking"], required: true } 
});

module.exports = mongoose.model("Reserva", reservaSchema);