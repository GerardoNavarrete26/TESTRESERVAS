import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import "./CalendarioReservas.css"; // Importar estilos

const API_URL = "http://localhost:3000/api"; // Ajusta al puerto correcto

const CalendarioReservas = () => {
  const [añoSeleccionado, setAñoSeleccionado] = useState("2024");
  const [mesSeleccionado, setMesSeleccionado] = useState("02");
  const [cabanas, setCabanas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Obtener datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cabanasRes, reservasRes] = await Promise.all([
          fetch(`${API_URL}/cabanas`).then((res) => res.json()),
          fetch(`${API_URL}/reservas`).then((res) => res.json()),
        ]);

        console.log("Cabañas obtenidas:", cabanasRes);
        console.log("Reservas obtenidas:", reservasRes);

        setCabanas(cabanasRes);
        setReservas(reservasRes);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Genera los días del mes seleccionado
  const diasDelMes = () => {
    const start = startOfMonth(new Date(añoSeleccionado, mesSeleccionado - 1));
    const end = endOfMonth(new Date(añoSeleccionado, mesSeleccionado - 1));
    return eachDayOfInterval({ start, end }).map((day) => ({
      dia: format(day, "d"),
      fecha: format(day, "yyyy-MM-dd"),
    }));
  };

  if (loading) return <p>Cargando calendario...</p>;

  return (
    <div style={{ padding: "20px", overflowX: "auto" }}>
      <h2>Calendario de Reservas</h2>

      {/* Selectores de Año y Mes */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select value={añoSeleccionado} onChange={(e) => setAñoSeleccionado(e.target.value)}>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>

        <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)}>
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          <option value="03">Marzo</option>
          <option value="04">Abril</option>
          <option value="05">Mayo</option>
          <option value="06">Junio</option>
          <option value="07">Julio</option>
          <option value="08">Agosto</option>
          <option value="09">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>
      </div>

      {/* Tabla del calendario */}
      <div className="calendario-container">
        <table className="calendario-tabla">
          <thead>
            <tr>
              <th>Alojamiento</th>
              {diasDelMes().map((dia) => (
                <th key={dia.fecha}>{dia.dia}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cabanas.map((cabaña) => (
              <tr key={cabaña._id}>
                <td className="cabaña-nombre">{`${cabaña.tipo} ${cabaña.numero}`}</td>
                {diasDelMes().map((dia) => {
                  const reserva = reservas.find(
                    (r) =>
                      r.cabana._id === cabaña._id &&
                      r.fechaInicio.slice(0, 10) <= dia.fecha &&
                      r.fechaFin.slice(0, 10) >= dia.fecha
                  );

                  return (
                    <td
                      key={dia.fecha}
                      className={
                        reserva
                          ? reserva.fechaInicio.slice(0, 10) === dia.fecha
                            ? "reserva-inicio"
                            : reserva.fechaFin.slice(0, 10) === dia.fecha
                            ? "reserva-fin"
                            : "reserva-ocupada"
                          : ""
                      }
                    >
                      {reserva ? reserva.cliente.nombre : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalendarioReservas;
