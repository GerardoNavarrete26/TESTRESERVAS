const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    cabin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cabin",
        required: true
    },
    client: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "Client",
        required: true
    },
    clientDocumentType: {
        type: String,
        required: true,
        enum: ["RUT", "Pasaporte", "ID Extranjero"]
    },
    checkinDate: {
        type: Date,
        required: true
    },
    checkoutDate: {
        type: Date,
        required: true
    },
    adults: {
        type: Number,
        required: true
    },
    children: {
        type: Number,
        required: true
    },
    hasHotTub: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Crédito", "Débito"]
    },
    paymentOrigin: {
        type: String,
        required: true,
        enum: ["Nacional", "Extranjero"]
    },
    isHistorical: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model("Reservation", reservationSchema);
