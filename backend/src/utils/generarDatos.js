const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Cabin = require("../models/cabinModels");
const Client = require("../models/clientModels");
const Reservation = require("../models/reservationModels");

dotenv.config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Conectado a MongoDB"))
    .catch(err => console.error("❌ Error al conectar a MongoDB:", err));

const obtenerFechaAleatoria = (inicio, fin) => {
    return new Date(inicio.getTime() + Math.random() * (fin.getTime() - inicio.getTime()));
};

// 🔹 Generar cabañas
const generarCabanas = async () => {
    try {
        await Cabin.deleteMany({});
        
        const cabanas = [];
        for (let i = 1; i <= 10; i++) {
            cabanas.push({
                type: "Suite",
                number: `suite-${i}`,
                maxAdults: Math.floor(Math.random() * 3) + 2, // 2-4 adultos
                maxChildren: Math.floor(Math.random() * 3), // 0-2 niños
                hasHotTub: Math.random() > 0.7,
                status: "Disponible",
                price: Math.floor(Math.random() * 50000) + 50000,
                currency: "CLP"
            });
        }

        for (let i = 1; i <= 10; i++) {
            cabanas.push({
                type: "TinyCabin",
                number: `tainycabin-${i}`,
                maxAdults: Math.floor(Math.random() * 2) + 1, // 1-2 adultos
                maxChildren: Math.floor(Math.random() * 2),
                hasHotTub: Math.random() > 0.5,
                status: "Disponible",
                price: Math.floor(Math.random() * 40000) + 30000,
                currency: "CLP"
            });
        }

        await Cabin.insertMany(cabanas);
        console.log("✅ Se generaron 20 cabañas correctamente.");
    } catch (error) {
        console.error("❌ Error al generar cabañas:", error);
    }
};

// 🔹 Generar clientes
const generarClientes = async () => {
    try {
        await Client.deleteMany({});

        const tiposDocumento = ["RUT", "Pasaporte", "ID Extranjero"];
        const nacionalidades = ["Chilena", "Argentina", "Brasileña", "Peruana", "Colombiana", "Mexicana"];

        const clientes = [];

        for (let i = 1; i <= 30; i++) {
            clientes.push({
                documentType: tiposDocumento[Math.floor(Math.random() * tiposDocumento.length)],
                documentNumber: `${Math.floor(Math.random() * 100000000)}-${Math.floor(Math.random() * 9)}`,
                name: `Cliente ${i}`,
                nationality: nacionalidades[Math.floor(Math.random() * nacionalidades.length)],
                phone: `+56 9 ${Math.floor(10000000 + Math.random() * 89999999)}`,
                email: `cliente${i}@example.com`
            });
        }

        await Client.insertMany(clientes);
        console.log("✅ Se generaron 30 clientes correctamente.");
    } catch (error) {
        console.error("❌ Error al generar clientes:", error);
    }
};

// 🔹 Generar reservas sin solapamientos
const generarReservas = async () => {
    try {
        await Reservation.deleteMany({});

        const cabanas = await Cabin.find();
        const clientes = await Client.find();

        if (cabanas.length < 20 || clientes.length < 10) {
            console.log("❌ No hay suficientes cabañas o clientes.");
            return;
        }

        let reservas = {};
        cabanas.forEach(cabana => {
            reservas[cabana._id] = [];
        });

        let nuevasReservas = [];
        for (let i = 0; i < 100; i++) {
            const cabana = cabanas[Math.floor(Math.random() * cabanas.length)];
            const idCabana = cabana._id;

            let fechaInicio = new Date(2024, 0, 1);
            if (reservas[idCabana].length > 0) {
                fechaInicio = new Date(reservas[idCabana][reservas[idCabana].length - 1].checkoutDate);
                fechaInicio.setDate(fechaInicio.getDate() + Math.floor(Math.random() * 5) + 1);
            }

            const duracion = Math.floor(Math.random() * 6) + 2;
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaInicio.getDate() + duracion);

            const cliente = clientes[Math.floor(Math.random() * clientes.length)];

            const reserva = {
                cabin: idCabana,
                client: cliente._id, // 🔹 Ahora se guarda el ObjectId del cliente
                clientDocumentType: cliente.documentType,
                clientDocumentNumber: cliente.documentNumber,
                checkinDate: fechaInicio,
                checkoutDate: fechaFin,
                adults: Math.floor(Math.random() * (cabana.maxAdults - 1)) + 1,
                children: Math.floor(Math.random() * (cabana.maxChildren + 1)),
                hasHotTub: cabana.hasHotTub,
                paymentMethod: Math.random() > 0.5 ? "Crédito" : "Débito",
                paymentOrigin: Math.random() > 0.5 ? "Nacional" : "Extranjero",
                isHistorical: fechaFin < new Date()
            };

            reservas[idCabana].push(reserva);
            nuevasReservas.push(reserva);
        }

        await Reservation.insertMany(nuevasReservas);
        console.log("✅ Se generaron 100 reservas sin solapamientos correctamente.");
    } catch (error) {
        console.error("❌ Error al generar reservas:", error);
    } finally {
        mongoose.connection.close();
    }
};

// 🔹 Ejecutar la creación de datos en orden
const ejecutar = async () => {
    await generarCabanas();
    await generarClientes();
    await generarReservas();
};

ejecutar();


// node src/utils/generarDatos.js  para ejecutar achivo