import { useState, useEffect } from "react";
import { FiPlusCircle, FiDollarSign, FiClock, FiAlertTriangle, FiImage, FiShield } from "react-icons/fi";
import { GiCrystalBall } from "react-icons/gi";
import axios from "axios";

// Definimos la URL base asegurando que apunte a Render si VITE_API_URL no está configurada
const API_URL = import.meta.env.VITE_API_URL || "https://phantombids-back-3aod.onrender.com";

const PREDEFINED_CURSES = [
  { id: "LOSE_10_REP", name: "Perder 10 Reputación" },
  { id: "BAN_NEXT_2_AUCTIONS", name: "Prohibido en próximas 2 subastas" },
  { id: "CURSE_MARK_7_DAYS", name: "Marca de Maldición (7 días)" },
  { id: "REDUCE_BET_LIMIT", name: "Reducir Límite de Apuesta" },
  { id: "POLTERGEIST_24H", name: "Convertir en Poltergeist (24h)" },
  { id: "PUBLIC_SHAME_ROLE", name: "Rol de Vergüenza Pública" },
  { id: "REPUTATION_DRAIN_PER_DAY", name: "Drenaje Diario de Reputación" },
  { id: "SILENCE_IN_HOUSE", name: "Silencio en la Casa" },
];

export function CreateObjectPage() {
  const [houses, setHouses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    baseCurse: "LOSE_10_REP",
    minBid: 1,
    maxBid: 50,
    durationDays: 1,
    house: "", // ID de la casa a la que pertenecerá
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Cargar las casas disponibles para poder seleccionar una
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/houses`);
        const houseData = Array.isArray(res.data) ? res.data : res.data.houses || [];
        setHouses(houseData);
        if (houseData.length > 0) {
          setFormData((prev) => ({ ...prev, house: houseData[0]._id }));
        }
      } catch (err) {
        console.error("Error al cargar casas:", err);
      }
    };
    fetchHouses();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        baseCurse: formData.baseCurse,
        minBid: Number(formData.minBid),
        maxBid: Number(formData.maxBid),
        durationDays: Number(formData.durationDays),
        house: formData.house,
      };

      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/api/cursed-objects`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage({ type: "success", text: `Objeto "${formData.name}" publicado exitosamente.` });
      setFormData({
        name: "",
        description: "",
        imageUrl: "",
        baseCurse: "LOSE_10_REP",
        minBid: 1,
        maxBid: 50,
        durationDays: 1,
        house: houses[0]?._id || "",
      });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Error al registrar el objeto embrujado.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
          <FiPlusCircle className="text-purple-400 text-3xl" /> Publicar Objeto Embrujado
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Ingresa los detalles espectrales y asígnalo a una casa de subastas.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm ${
            message.type === "success" ? "bg-green-950/80 text-green-300 border border-green-800" : "bg-red-950/80 text-red-300 border border-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          {/* Casa de Subastas */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Casa de Subastas Destino</label>
            <select
              name="house"
              value={formData.house}
              onChange={handleChange}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            >
              {houses.length === 0 && <option value="">Cargando casas o no hay casas creadas...</option>}
              {houses.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.name} ({h.theme})
                </option>
              ))}
            </select>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Nombre del Objeto</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ej. Amuleto del Ojo Sangriento"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Maldición Predefinida */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Maldición Base</label>
            <select
              name="baseCurse"
              value={formData.baseCurse}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            >
              {PREDEFINED_CURSES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Rango de Pujas y Duración */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Puja Mín (1-100)</label>
              <input
                type="number"
                name="minBid"
                min="1"
                max="100"
                required
                value={formData.minBid}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Puja Máxima</label>
              <input
                type="number"
                name="maxBid"
                required
                value={formData.maxBid}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Duración (Días 1-7)</label>
              <input
                type="number"
                name="durationDays"
                min="1"
                max="7"
                required
                value={formData.durationDays}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* URL Imagen */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">URL de la Imagen</label>
            <div className="relative">
              <FiImage className="absolute left-3 top-3 text-slate-500" />
              <input
                type="url"
                name="imageUrl"
                required
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Historia / Descripción</label>
            <textarea
              name="description"
              rows="3"
              required
              placeholder="Describe la procedencia del artefacto..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiShield className="text-lg" /> {loading ? "Guardando..." : "Sellar y Publicar Objeto"}
          </button>
        </form>

        {/* Previsualización */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <GiCrystalBall className="text-purple-400" /> Vista Previa
          </h3>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden p-4 space-y-4 shadow-xl">
            <div className="h-44 bg-slate-950 rounded-xl overflow-hidden relative border border-slate-800/80 flex items-center justify-center">
              {formData.imageUrl ? (
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-slate-600 space-y-1">
                  <FiImage className="text-3xl mx-auto" />
                  <p className="text-xs">Sin imagen asignada</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="font-bold text-slate-100">{formData.name || "Nombre del Objeto"}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {formData.description || "La historia del objeto aparecerá aquí..."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Rango Pujas</span>
                <span className="font-bold text-purple-300">${formData.minBid} - ${formData.maxBid}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Duración</span>
                <span className="font-bold text-slate-300">{formData.durationDays} Día(s)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}