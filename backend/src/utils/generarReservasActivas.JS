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

// Función para obtener una fecha aleatoria dentro de un mes/año específicos
const obtenerFechaAleatoria = (anio, mes) => {
    const dia = Math.floor(Math.random() * 28) + 1; // Evita problemas con febrero
    return new Date(anio, mes, dia);
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

// 🔹 Generar 1000 reservas pasadas sin solapamientos
const generarReservasPasadas = async () => {
    try {
        await Reservation.deleteMany({});
        const cabanas = await Cabin.find();
        const clientes = await Client.find();

        let historialReservas = {};
        cabanas.forEach(cabana => {
            historialReservas[cabana._id] = {}; // Guardar fechas por mes
        });

        let nuevasReservas = [];
        const totalReservas = 1000;
        const reservasPorMes = totalReservas / 24; // 1000 reservas / 24 meses = 41-42 reservas por mes

        for (let anio = 2023; anio <= 2024; anio++) {
            for (let mes = 0; mes < 12; mes++) {
                for (let i = 0; i < reservasPorMes; i++) {
                    const cabana = cabanas[Math.floor(Math.random() * cabanas.length)];
                    const cliente = clientes[Math.floor(Math.random() * clientes.length)];

                    if (!historialReservas[cabana._id][anio]) {
                        historialReservas[cabana._id][anio] = {};
                    }

                    if (!historialReservas[cabana._id][anio][mes]) {
                        historialReservas[cabana._id][anio][mes] = new Date(anio, mes, 1);
                    }

                    let fechaInicio = new Date(historialReservas[cabana._id][anio][mes]);
                    fechaInicio.setDate(fechaInicio.getDate() + Math.floor(Math.random() * 5) + 1);

                    const duracion = Math.floor(Math.random() * 4) + 4; // Entre 4 y 7 días
                    const fechaFin = new Date(fechaInicio);
                    fechaFin.setDate(fechaInicio.getDate() + duracion);

                    // Actualizar historial de reservas en la cabaña
                    historialReservas[cabana._id][anio][mes] = new Date(fechaFin);

                    const reserva = {
                        cabin: cabana._id,
                        client: cliente._id,
                        clientDocumentType: cliente.documentType,
                        clientDocumentNumber: cliente.documentNumber,
                        checkinDate: fechaInicio,
                        checkoutDate: fechaFin,
                        adults: Math.floor(Math.random() * (cabana.maxAdults - 1)) + 1,
                        children: Math.floor(Math.random() * (cabana.maxChildren + 1)),
                        hasHotTub: cabana.hasHotTub,
                        paymentMethod: Math.random() > 0.5 ? "Crédito" : "Débito",
                        paymentOrigin: Math.random() > 0.5 ? "Nacional" : "Extranjero",
                        isHistorical: true
                    };

                    nuevasReservas.push(reserva);
                }
            }
        }

        await Reservation.insertMany(nuevasReservas);
        console.log("✅ Se generaron 1000 reservas pasadas sin solapamientos.");
    } catch (error) {
        console.error("❌ Error al generar reservas pasadas:", error);
    }
};

// 🔹 Ejecutar generación de datos
const ejecutar = async () => {
    await generarClientes();
    await generarCabanas();
    await generarReservasPasadas();
};

ejecutar();
