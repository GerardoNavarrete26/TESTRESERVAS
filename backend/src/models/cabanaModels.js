const mongoose = require("mongoose");

const cabanaSchema = new mongoose.Schema({
    tipo: { type: String, enum: ["suite", "tinycabin"], required: true },
    numero: { type: Number, required: true, unique: true },
    estado: { type: String, enum: ["disponible", "reservado"], default: "disponible" }
});

module.exports = mongoose.model("Cabana", cabanaSchema);