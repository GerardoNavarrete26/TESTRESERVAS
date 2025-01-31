import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EstadoCabañas.css"; 

const EstadoCabañas = () => {
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  // Datos de las habitaciones
  const habitaciones = [
    { type: "suite", number: "01", status: "ocupado" },
    { type: "suite", number: "02", status: "disponible" },
    { type: "suite", number: "03", status: "disponible" },
    { type: "suite", number: "04", status: "disponible" },
    { type: "suite", number: "05", status: "ocupado" },
    { type: "suite", number: "06", status: "disponible" },
    { type: "suite", number: "07", status: "disponible" },
    { type: "suite", number: "08", status: "ocupado" },
    { type: "suite", number: "09", status: "ocupado" },
    { type: "suite", number: "10", status: "pendiente" },
    { type: "tinycabin", number: "11", status: "disponible" },
    { type: "tinycabin", number: "12", status: "ocupado" },
    { type: "tinycabin", number: "13", status: "disponible" },
    { type: "tinycabin", number: "14", status: "ocupado" },
    { type: "tinycabin", number: "15", status: "disponible" },
    { type: "tinycabin", number: "16", status: "ocupado" },
    { type: "tinycabin", number: "17", status: "disponible" },
    { type: "tinycabin", number: "18", status: "disponible" },
    { type: "tinycabin", number: "19", status: "disponible" },
    { type: "tinycabin", number: "20", status: "ocupado" },
  ];

  // Filtrar habitaciones según el estado seleccionado
  const filteredRooms =
    filter === "all"
      ? habitaciones
      : habitaciones.filter((room) => room.status === filter);

  // Función para manejar clic en una tarjeta
  const handleCardClick = (roomNumber) => {
    navigate(`/Lista-Cabañas?search=${roomNumber}`); // Navegar a la vista de ListaCabañas con el parámetro de búsqueda
  };

  return (
    <div className="content-estado">
      <h1 className="text-center mb-4">Estado de Cabañas</h1>

      {/* Filtros */}
      <div className="d-flex justify-content-between mb-4">
        <select
          id="filterStatus"
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Todos los Estados</option>
          <option value="disponible">Disponible</option>
          <option value="ocupado">Ocupado</option>
          <option value="pendiente">Pendiente</option>
        </select>
      </div>

      {/* Tarjetas de estado de habitaciones */}
      <div id="roomStatusList" className="row">
        {filteredRooms.map((room) => (
          <div
            key={room.number}
            className={`col-md-4 mb-4 room-card`}
            data-number={room.number}
            data-status={room.status}
            onClick={() => handleCardClick(room.number)} // Agregar evento de clic
          >
            <div className={`card ${room.status}`}>
              <h2>{room.type} {room.number}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstadoCabañas;
