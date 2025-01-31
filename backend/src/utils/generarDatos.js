const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Reserva = require("../models/reservaModels");
const Cabana = require("../models/cabanaModels");

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

// Datos de clientes falsos
const clientesFalsos = [
    { nombre: "Carlos Gómez", email: "carlos@example.com", telefono: "123456789" },
    { nombre: "Ana Pérez", email: "ana@example.com", telefono: "987654321" },
    { nombre: "Luis Rodríguez", email: "luis@example.com", telefono: "567890123" },
    { nombre: "María Fernández", email: "maria@example.com", telefono: "345678901" },
    { nombre: "Pedro Sánchez", email: "pedro@example.com", telefono: "234567890" }
];

// Función para generar cabañas
const generarCabanas = async () => {
    try {
        // 🔹 Eliminar todas las cabañas existentes para evitar duplicados
        await Cabana.deleteMany({});
        
        const cabanas = [];

        // Agregar 10 cabañas tipo "suite"
        for (let i = 1; i <= 10; i++) {
            cabanas.push({ tipo: "suite", numero: i, estado: "disponible" });
        }

        // Agregar 10 cabañas tipo "tinycabin"
        for (let i = 1; i <= 10; i++) {
            cabanas.push({ tipo: "tinycabin", numero: 10 + i, estado: "disponible" });
        }

        // Insertar todas las cabañas juntas
        await Cabana.insertMany(cabanas);
        console.log("✅ Se generaron 20 cabañas correctamente.");
    } catch (error) {
        console.error("❌ Error al generar cabañas:", error);
    }
};

// Función para generar reservas
const generarReservas = async () => {
    try {
        const cabanasDisponibles = await Cabana.find({ estado: "disponible" });

        if (cabanasDisponibles.length < 5) {
            console.log("❌ No hay suficientes cabañas disponibles.");
            return;
        }

        const canales = ["PaginaWeb", "Directo", "Boking"]; // 📌 Posibles valores para canalOrigen
        const reservas = [];

        for (let i = 0; i < 5; i++) {
            const cabana = cabanasDisponibles[i];

            const nuevaReserva = new Reserva({
                cliente: clientesFalsos[i],
                cabana: cabana._id,
                fechaInicio: new Date(2024, 1, 10 + i),
                fechaFin: new Date(2024, 1, 15 + i),
                fechaCreacion: new Date(), // 📌 Se genera la fecha de creación
                canalOrigen: canales[Math.floor(Math.random() * canales.length)] // 📌 Asigna un canal aleatorio
            });

            await nuevaReserva.save();

            // Marcar la cabaña como reservada
            cabana.estado = "reservado";
            await cabana.save();

            reservas.push(nuevaReserva);
        }

        console.log("✅ Se generaron 5 reservas falsas con fecha de creación y canal de origen.");
    } catch (error) {
        console.error("❌ Error al generar reservas:", error);
    }
};

// Ejecutar las funciones en orden
const ejecutar = async () => {
    await generarCabanas();
    await generarReservas();
    mongoose.connection.close();
};

ejecutar();
