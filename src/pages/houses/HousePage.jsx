import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiHome, FiTrendingUp, FiLock } from "react-icons/fi";
import { GiCrystalBall, GiCastle, GiGhost } from "react-icons/gi";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://phantombids-back-3aod.onrender.com";

export function HousesPage() {
  const [houses, setHouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar las casas reales desde la API del backend
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/houses`);
        const houseData = Array.isArray(res.data) 
          ? res.data 
          : res.data.houses || res.data.data || res.data.items || [];
        setHouses(houseData);
      } catch (err) {
        console.error("Error al cargar las casas habilitadas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  const filteredHouses = houses.filter((house) =>
    house.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (house.theme && house.theme.toLowerCase().includes(searchTerm.toLowerCase()))
  );

 const handleEnterHouse = async (house) => {
    if (house.isPrivate) {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          alert("Debes iniciar sesión para intentar acceder a una casa privada.");
          return;
        }

        // Consultamos al backend enviando el token
        await axios.get(`${API_URL}/api/houses/${house._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Si la llamada responde bien (es Admin o Miembro), permitimos el paso
        navigate(`/auction/${house._id}`);
      } catch (err) {
        // Si responde 403 Forbidden u otro error, mostramos el mensaje de bloqueo
        alert(err.response?.data?.message || "Acceso denegado: Solo el Administrador o miembros pueden ingresar a esta casa privada.");
      }
    } else {
      // Las casas públicas se pueden ingresar libremente
      navigate(`/auction/${house._id}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent flex items-center gap-3">
            <GiCastle className="text-purple-400 text-3xl" /> Casas de Subastas Ocultas
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Explora los recintos paranormales y accede a los lotes de relicarios embrujados.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-3 text-slate-500 text-lg" />
          <input
            type="text"
            placeholder="Buscar por recinto o temática..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Cargando recintos espectrales...</div>
      ) : filteredHouses.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No se encontraron casas de subastas registradas.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouses.map((house) => (
            <div
              key={house._id}
              className="group bg-slate-900/80 border border-slate-800 hover:border-purple-800/60 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-950/30 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden bg-slate-950">
                <img
                  src={house.coverImageUrl || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=600"}
                  alt={house.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {house.isPrivate && (
                  <span className="absolute top-3 right-3 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-md">
                    <FiLock className="text-xs" /> Privada
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
                    {house.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <FiHome className="text-purple-500" /> Tema: {house.theme || "General"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-center gap-2">
                    <GiCrystalBall className="text-purple-400 text-lg" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Miembros</p>
                      <p className="text-xs font-semibold text-slate-200">{house.members?.length || 0} Registrados</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <GiGhost className="text-indigo-400 text-lg" />
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">Estado</p>
                      <p className="text-xs font-semibold text-slate-200">Activa</p>
                    </div>
                  </div>
                </div>

              <button 
  onClick={() => handleEnterHouse(house)}
  className="w-full bg-purple-950/80 hover:bg-purple-900 border border-purple-800/50 hover:border-purple-600 text-purple-300 font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm group-hover:shadow-md group-hover:shadow-purple-950/50 cursor-pointer"
>
  <span>Ingresar al Recinto</span>
  <FiTrendingUp className="text-xs group-hover:translate-x-1 transition-transform" />
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}