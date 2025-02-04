const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Reserva = require("../models/reservaModels");
const Cabana = require("../models/cabanaModels");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

const clientesFalsos = [
    { nombre: "Carlos Gómez", email: "carlos@example.com", telefono: "123456789" },
    { nombre: "Ana Pérez", email: "ana@example.com", telefono: "987654321" },
    { nombre: "Luis Rodríguez", email: "luis@example.com", telefono: "567890123" },
    { nombre: "María Fernández", email: "maria@example.com", telefono: "345678901" },
    { nombre: "Pedro Sánchez", email: "pedro@example.com", telefono: "234567890" },
    { nombre: "Javier Méndez", email: "javier@example.com", telefono: "567123456" },
    { nombre: "Laura Torres", email: "laura@example.com", telefono: "654789321" },
    { nombre: "Andrés Ramírez", email: "andres@example.com", telefono: "789654123" },
    { nombre: "Carmen López", email: "carmen@example.com", telefono: "321987654" },
    { nombre: "Fernando Ríos", email: "fernando@example.com", telefono: "987321456" },
    { nombre: "Sofía Herrera", email: "sofia@example.com", telefono: "852963741" },
    { nombre: "Ricardo Vázquez", email: "ricardo@example.com", telefono: "741852963" },
    { nombre: "Gabriela Muñoz", email: "gabriela@example.com", telefono: "369258147" },
    { nombre: "Esteban Duarte", email: "esteban@example.com", telefono: "147258369" },
    { nombre: "Natalia Castillo", email: "natalia@example.com", telefono: "951753852" },
    { nombre: "Rodrigo Alvarado", email: "rodrigo@example.com", telefono: "357951468" },
    { nombre: "Paola Medina", email: "paola@example.com", telefono: "654123789" },
    { nombre: "Oscar Paredes", email: "oscar@example.com", telefono: "951357486" },
    { nombre: "Isabel Ríos", email: "isabel@example.com", telefono: "852147963" },
    { nombre: "Antonio Gutiérrez", email: "antonio@example.com", telefono: "123789456" },
    { nombre: "Marina Velázquez", email: "marina@example.com", telefono: "753951852" },
    { nombre: "Diego Campos", email: "diego@example.com", telefono: "963258741" },
    { nombre: "Elena Correa", email: "elena@example.com", telefono: "258147369" },
    { nombre: "Hugo Sosa", email: "hugo@example.com", telefono: "357852951" },
    { nombre: "Clara Espinoza", email: "clara@example.com", telefono: "852963147" }
];

const canales = ["PaginaWeb", "Directo", "Booking"]; // Asegurar valores válidos

const obtenerFechaAleatoria = (inicio, fin) => {
    return new Date(inicio.getTime() + Math.random() * (fin.getTime() - inicio.getTime()));
};

const generarReservas = async () => {
    try {
        await Reserva.deleteMany({}); // Eliminar reservas previas

        const cabanas = await Cabana.find();
        if (cabanas.length < 20) {
            console.log("❌ No hay suficientes cabañas.");
            return;
        }

        let reservas = [];

        // 🔹 680 Reservas pasadas (2024 - 2025)
        for (let i = 0; i < 680; i++) {
            const cabana = cabanas[Math.floor(Math.random() * cabanas.length)];
            const fechaInicio = obtenerFechaAleatoria(new Date(2024, 0, 1), new Date(2025, 6, 1));
            const duracion = Math.floor(Math.random() * 6) + 2; // Entre 2 y 7 días
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaInicio.getDate() + duracion);

            reservas.push({
                cliente: clientesFalsos[Math.floor(Math.random() * clientesFalsos.length)],
                cabana: cabana._id,
                fechaInicio,
                fechaFin,
                fechaCreacion: new Date(),
                canalOrigen: canales[Math.floor(Math.random() * canales.length)]
            });
        }

        // 🔹 20 Reservas futuras (ACTIVAS)
        for (let i = 0; i < 20; i++) {
            const cabana = cabanas[i]; // Las primeras 20 cabañas tendrán reservas activas
            const fechaInicio = obtenerFechaAleatoria(new Date(), new Date(2025, 11, 31));
            const duracion = Math.floor(Math.random() * 6) + 2; // Entre 2 y 7 días
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaInicio.getDate() + duracion);

            reservas.push({
                cliente: clientesFalsos[Math.floor(Math.random() * clientesFalsos.length)],
                cabana: cabana._id,
                fechaInicio,
                fechaFin,
                fechaCreacion: new Date(),
                canalOrigen: canales[Math.floor(Math.random() * canales.length)]
            });

            // Marcar la cabaña como reservada
            cabana.estado = "reservado";
            await cabana.save();
        }

        await Reserva.insertMany(reservas);
        console.log("✅ Se generaron 700 reservas correctamente con 25 clientes falsos.");
    } catch (error) {
        console.error("❌ Error al generar reservas:", error);
    } finally {
        mongoose.connection.close();
    }
};

generarReservas();

// node src/utils/generarDatos.js  para ejecutar achivo