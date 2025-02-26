import React, { useRef, useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AñadirReservas.css";

function AñadirReservas() {
  const formRef = useRef(null);
  const [rutError, setRutError] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [telefonoCliente, setTelefonoCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");
  const [nacionalidadCliente, setNacionalidadCliente] = useState(""); 
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionSeleccionada, setHabitacionSeleccionada] = useState("");
  const [fechaEntrada, setFechaEntrada] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [canalOrigen, setCanalOrigen] = useState("");
  const [estado, setEstado] = useState("");
  const [adultos, setAdultos] = useState(1);
  const [ninos, setNinos] = useState(0);
  const [hasHotTub, setHasHotTub] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Crédito");
  const [paymentOrigin, setPaymentOrigin] = useState("Nacional");
  const [clientDocumentType, setClientDocumentType] = useState("RUT");
  const [clientDocumentNumber, setClientDocumentNumber] = useState("");
  const [newClientId, setNewClientId] = useState(null);

  useEffect(() => {
    const fetchCabanas = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/cabins");
        const data = await response.json();
        setHabitaciones(data);
      } catch (error) {
        console.error("Error al obtener cabañas:", error);
      }
    };
    fetchCabanas();
  }, []);

  const handleReset = (event) => {
    event.preventDefault();
    if (formRef.current) {
      formRef.current.reset();
      setRutCliente("");
      setRutError("");
      setNombreCliente("");
      setTelefonoCliente("");
      setEmailCliente("");
      setNacionalidadCliente("");
      setHabitacionSeleccionada("");
      setFechaEntrada("");
      setFechaSalida("");
      setCanalOrigen("");
      setEstado("");
      setAdultos(1);
      setNinos(0);
      setHasHotTub(false);
      setPaymentMethod("Crédito");
      setPaymentOrigin("Nacional");
      setClientDocumentType("RUT");
      setClientDocumentNumber("");
    }
  };

  const formatRut = (value) => {
    let cleaned = value.replace(/[^0-9kK.-]/g, "");
    const numericOnly = cleaned.replace(/[^0-9kK]/g, "");
    if (numericOnly.length === 9) {
      let formattedRut =
        numericOnly.slice(0, 2) +
        "." +
        numericOnly.slice(2, 5) +
        "." +
        numericOnly.slice(5, 8) +
        "-" +
        numericOnly.slice(8).toUpperCase();
      return formattedRut;
    } else {
      return cleaned.toUpperCase();
    }
  };

  const handleRutChange = (event) => {
    const value = event.target.value;
    const formattedValue = formatRut(value);
    setRutCliente(formattedValue);
    if (formattedValue.length > 0 && formattedValue.length < 9) {
      setRutError("Ingrese su Rut, sin puntos ni guión.");
    } else {
      setRutError("");
    }
  };

  const handleClientDocumentNumber = (event) => {
    setClientDocumentNumber(event.target.value);
  };

  const handleNacionalidadChange = (event) => {
    setNacionalidadCliente(event.target.value);
  };

  const createClient = async () => {
    const clientData = {
      documentType: clientDocumentType,
      documentNumber: clientDocumentNumber.replace(/[^0-9kK]/g, ""),
      name: nombreCliente,
      phone: telefonoCliente,
      email: emailCliente,
      nationality: nacionalidadCliente,
    };
  
    try {
      // Primero, buscamos si el cliente ya existe por su número de documento
      const existingClient = await fetch(
        `http://localhost:3000/api/clients?documentNumber=${clientData.documentNumber}`
      );
      const existingClientData = await existingClient.json();
  
      console.log('Datos obtenidos del backend:', existingClientData);
  
      if (existingClientData && existingClientData._id) {
        // Si el cliente ya existe, retornamos la ID del cliente existente
        console.log("Cliente ya existe:", existingClientData);
        return existingClientData._id;  // Usamos la ID del cliente existente
      } else {
        // Si el cliente no existe, lo creamos
        const response = await fetch("http://localhost:3000/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(clientData),
        });
  
        const result = await response.json();
        if (response.ok) {
          console.log("Nuevo cliente creado:", result);
          return result._id;  // Usamos la ID del nuevo cliente creado
        } else {
          alert(result.message || "Error al crear el cliente");
          return null;
        }
      }
    } catch (error) {
      console.error("Error al crear o buscar cliente:", error);
      alert("Error en la conexión con el servidor");
      return null;
    }
  };
  
  const createReservation = async (clientId) => {
    const reservaData = {
      client: clientId,
      clientDocumentType: clientDocumentType,
      clientDocumentNumber: clientDocumentNumber.replace(/[^0-9kK]/g, ""),
      checkinDate: fechaEntrada,
      checkoutDate: fechaSalida,
      adults: adultos,
      children: ninos,
      hasHotTub: hasHotTub,
      paymentMethod: paymentMethod,
      paymentOrigin: paymentOrigin,
      isHistorical: estado === "Confirmada" ? true : false,
      cabin: habitacionSeleccionada,
    };

    try {
      const response = await fetch("http://localhost:3000/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservaData),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Reserva creada con éxito");
      } else {
        alert(result.message || "Error al crear la reserva");
      }
    } catch (error) {
      console.error("Error al crear reserva:", error);
      alert("Error en la conexión con el servidor");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Primero, crear o buscar el cliente
    const clientId = await createClient();
  
    if (clientId) {
      // Si se obtiene una ID válida, crear la reserva
      createReservation(clientId);
    } else {
      alert("No se pudo crear ni encontrar al cliente.");
    }
  };
  


  return (
    <div className="content-añadirres">
      <h1 className="title">Agregar Reserva</h1>
      <form ref={formRef} onSubmit={handleSubmit}>
          {/* Campo de tipo de documento */}
          <label htmlFor="documentType" className="form-label">
          Tipo de Documento:
        </label>
        <select
          id="documentType"
          name="documentType"
          className="form-select"
          value={clientDocumentType}
          onChange={(e) => setClientDocumentType(e.target.value)}
          required
        >
          <option value="RUT">RUT</option>
          <option value="Pasaporte">Pasaporte</option>
          <option value="ID Extranjero">ID Extranjero</option>
        </select>

      <label htmlFor="documento_cliente" className="form-label">
          Número de Documento:
        </label>
        <input
          type="text"
          id="documento_cliente"
          name="documento_cliente"
          className="form-input"
          value={clientDocumentNumber}
          onChange={handleClientDocumentNumber}
          required
        />
        {rutError && <p className="error-text">{rutError}</p>}

        <label htmlFor="nombre_cliente" className="form-label">
          Nombre del Cliente:
        </label>
        <input
          type="text"
          id="nombre_cliente"
          name="nombre_cliente"
          className="form-input"
          value={nombreCliente}
          onChange={(e) => setNombreCliente(e.target.value)}
          required
        />

               {/* Nuevo campo de nacionalidad */}
        <label htmlFor="nacionalidad_cliente" className="form-label">
          Nacionalidad del Cliente:
        </label>
        <input
          type="text"
          id="nacionalidad_cliente"
          name="nacionalidad_cliente"
          className="form-input"
          value={nacionalidadCliente}
          onChange={handleNacionalidadChange}
          required
        />

        <label htmlFor="telefono_cliente" className="form-label">
          Teléfono del Cliente:
        </label>
        <input
          type="text"
          id="telefono_cliente"
          name="telefono_cliente"
          className="form-input"
          value={telefonoCliente}
          onChange={(e) => setTelefonoCliente(e.target.value)}
        />

        <label htmlFor="email_cliente" className="form-label">
          Correo del Cliente:
        </label>
        <input
          type="email"
          id="email_cliente"
          name="email_cliente"
          className="form-input"
          value={emailCliente}
          onChange={(e) => setEmailCliente(e.target.value)}
        />

        <label htmlFor="habitacion" className="form-label">
          Seleccionar Cabaña:
        </label>
        <select
          id="habitacion"
          name="habitacion"
          className="form-select"
          value={habitacionSeleccionada}
          onChange={(e) => setHabitacionSeleccionada(e.target.value)}
          required
        >
          <option value="">Seleccione una cabaña</option>
          {habitaciones.map((cabaña) => (
            <option key={cabaña._id} value={cabaña._id}>
             {cabaña.number}
            </option>
          ))}
        </select>

        <label htmlFor="fecha_entrada" className="form-label">
          Fecha de Entrada:
        </label>
        <input
          type="date"
          id="fecha_entrada"
          name="fecha_entrada"
          className="form-input"
          value={fechaEntrada}
          onChange={(e) => setFechaEntrada(e.target.value)}
          required
        />

        <label htmlFor="fecha_salida" className="form-label">
          Fecha de Salida:
        </label>
        <input
          type="date"
          id="fecha_salida"
          name="fecha_salida"
          className="form-input"
          value={fechaSalida}
          onChange={(e) => setFechaSalida(e.target.value)}
          required
        />

        <label htmlFor="canal_origen" className="form-label">
          Canal de Origen:
        </label>
        <select
          id="canal_origen"
          name="canal_origen"
          className="form-select"
          value={canalOrigen}
          onChange={(e) => setCanalOrigen(e.target.value)}
          required
        >
          <option value="Directo">Directo</option>
          <option value="Booking">Booking</option>
        </select>

        <label htmlFor="estado" className="form-label">
          Estado:
        </label>
        <select
          id="estado"
          name="estado"
          className="form-select"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
        >
          <option value="Confirmada">Confirmada</option>
          <option value="Pendiente">Pendiente</option>
        </select>

        <label htmlFor="tipo_pago" className="form-label">
          Tipo de Pago:
        </label>
        <select
          id="tipo_pago"
          name="tipo_pago"
          className="form-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          required
        >
          <option value="Crédito">Crédito</option>
          <option value="Débito">Débito</option>
        </select>

        <label htmlFor="origen_pago" className="form-label">
          Origen de Pago:
        </label>
        <select
          id="origen_pago"
          name="origen_pago"
          className="form-select"
          value={paymentOrigin}
          onChange={(e) => setPaymentOrigin(e.target.value)}
          required
        >
          <option value="Nacional">Nacional</option>
          <option value="Extranjero">Extranjero</option>
        </select>

 

        <label htmlFor="adultos" className="form-label">
          Adultos:
        </label>
        <input
          type="number"
          id="adultos"
          name="adultos"
          className="form-input"
          value={adultos}
          onChange={(e) => setAdultos(e.target.value)}
          required
        />

        <label htmlFor="ninos" className="form-label">
          Niños:
        </label>
        <input
          type="number"
          id="ninos"
          name="ninos"
          className="form-input"
          value={ninos}
          onChange={(e) => setNinos(e.target.value)}
          required
        />

        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Aceptar
          </button>
          <button className="reset-btn" onClick={handleReset}>
            Restablecer
          </button>
        </div>
      </form>
    </div>
  );
}

export default AñadirReservas;
