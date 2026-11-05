import { useState } from "react";
import { FiPlusCircle, FiDollarSign, FiClock, FiAlertTriangle, FiImage, FiShield } from "react-icons/fi";
import { GiCrystalBall, GiSkullCrossedBones, GiGhost, GiBurningBook } from "react-icons/gi";
import axios from "axios"; // Asegúrate de tener axios instalado

const CURSE_TYPES = [
  { id: "spectral", name: "Aparición Espectral", icon: GiGhost, color: "border-purple-500/50 text-purple-400 bg-purple-950/30" },
  { id: "mind", name: "Corrupción Mental", icon: GiBurningBook, color: "border-indigo-500/50 text-indigo-400 bg-indigo-950/30" },
  { id: "lethal", name: "Maldición Letal", icon: GiSkullCrossedBones, color: "border-rose-500/50 text-rose-400 bg-rose-950/30" },
];

export function CreateObjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingBid: "",
    durationHours: "24",
    curseType: "spectral",
    dangerLevel: "Alto",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Tomamos la URL del backend desde las variables de entorno de Vite
      const API_URL = import.meta.env.VITE_API_URL || "https://phantombids-back.onrender.com"; // Ajusta tu URL base si es necesario
      
      // Realizamos la petición POST al backend (incluyendo credenciales/token si manejas autenticación con cookies o headers)
      const response = await axios.post(`${API_URL}/api/objects`, formData, {
        withCredentials: true, // Si usas cookies de sesión
      });

      alert(`¡Objeto "${formData.title}" sellado y publicado con éxito!`);
      // Opcional: limpiar formulario o redirigir
    } catch (err) {
      console.error("Error al publicar el objeto:", err);
      setError(err.response?.data?.message || "Hubo un error al conectar con el submundo (backend).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
          <FiPlusCircle className="text-purple-400 text-3xl" /> Publicar Relicario / Objeto Maldito
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Ingresa los detalles espectrales y la categoría de peligro para iniciar la subasta.
        </p>
      </div>

      {/* Mostrar error si la API falla */}
      {error && (
        <div className="bg-rose-950/50 border border-rose-800 text-rose-300 p-4 rounded-xl text-sm flex items-center gap-2">
          <FiAlertTriangle className="text-lg shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario Principal */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          {/* Título */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Nombre del Objeto</label>
            <input
              type="text"
              name="title"
              required
              placeholder="Ej. Amuleto del Ojo Sangriento"
              value={formData.title}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Selector de Tipo de Maldición Predefinida */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Naturaleza de la Maldición</label>
            <div className="grid grid-cols-3 gap-3">
              {CURSE_TYPES.map((curse) => {
                const Icon = curse.icon;
                const isSelected = formData.curseType === curse.id;
                return (
                  <button
                    type="button"
                    key={curse.id}
                    onClick={() => setFormData({ ...formData, curseType: curse.id })}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-center transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-950/60 shadow-lg shadow-purple-950/50"
                        : "border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-400"
                    }`}
                  >
                    <Icon className={`text-2xl ${isSelected ? "text-purple-400" : "text-slate-500"}`} />
                    <span className="text-xs font-medium">{curse.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Precios y Tiempos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Oferta Inicial (USD)</label>
              <div className="relative">
                <FiDollarSign className="absolute left-3 top-3 text-slate-500" />
                <input
                  type="number"
                  name="startingBid"
                  required
                  placeholder="150"
                  value={formData.startingBid}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Duración de Subasta</label>
              <div className="relative">
                <FiClock className="absolute left-3 top-3 text-slate-500" />
                <select
                  name="durationHours"
                  value={formData.durationHours}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="12">12 Horas</option>
                  <option value="24">24 Horas</option>
                  <option value="48">48 Horas</option>
                  <option value="72">72 Horas</option>
                </select>
              </div>
            </div>
          </div>

          {/* Nivel de Peligro */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Nivel de Severidad Espectral</label>
            <select
              name="dangerLevel"
              value={formData.dangerLevel}
              onChange={handleChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
            >
              <option value="Bajo">Bajo (Manipulación Leve)</option>
              <option value="Medio">Medio (Manifestación Física)</option>
              <option value="Alto">Alto (Posesión / Inestabilidad)</option>
              <option value="Extremo">Extremo (Peligro Letal)</option>
            </select>
          </div>

          {/* URL Imagen */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">URL de la Imagen</label>
            <div className="relative">
              <FiImage className="absolute left-3 top-3 text-slate-500" />
              <input
                type="url"
                name="imageUrl"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Origen / Historia de la Maldición</label>
            <textarea
              name="description"
              rows="3"
              placeholder="Describe la procedencia del artefacto y sus efectos documentados..."
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
            <FiShield className="text-lg" /> {loading ? "Sellando en el servidor..." : "Sellar y Publicar Objeto"}
          </button>
        </form>

        {/* Tarjeta de Previsualización */}
        <div className="space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <GiCrystalBall className="text-purple-400" /> Vista Previa de la Ficha
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
              <span className="absolute top-2 right-2 bg-rose-950/90 text-rose-300 border border-rose-800/60 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <FiAlertTriangle /> {formData.dangerLevel}
              </span>
            </div>

            <div>
              <h4 className="font-bold text-slate-100">{formData.title || "Nombre del Objeto"}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {formData.description || "La historia del objeto aparecerá aquí..."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Base</span>
                <span className="font-bold text-purple-300">${formData.startingBid || "0"} USD</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Tiempo</span>
                <span className="font-bold text-slate-300">{formData.durationHours} Horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}