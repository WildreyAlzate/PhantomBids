import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiMinus, FiPlus, FiLock } from 'react-icons/fi';
import { CountdownTimer } from '../components/CountdownTimer';
import { BettingWidget } from '../components/BettingWidget';
import { AlertBanner } from '../components/AlertBanner';

const API_URL = import.meta.env.VITE_API_URL || 'https://phantombids-back-3aod.onrender.com';

export const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  const minBid = 10;
  const maxBid = 500;
  const [bidAmount, setBidAmount] = useState(minBid);
  const [showPenalty, setShowPenalty] = useState(false);

  // Validación de acceso al cargar la vista directamente por URL
  useEffect(() => {
    const checkAccess = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Debes iniciar sesión para acceder a esta subasta.');
        navigate('/houses');
        return;
      }

      try {
        // Consultamos la casa al backend enviando el token
        await axios.get(`${API_URL}/api/houses/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAuthorized(true);
      } catch (err) {
        alert(
          err.response?.data?.message ||
            'Acceso denegado: No tienes permisos para ingresar a este recinto privado.'
        );
        navigate('/houses');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      checkAccess();
    } else {
      setLoading(false);
      setAuthorized(true);
    }
  }, [id, navigate]);

  const handleIncrement = () => setBidAmount((prev) => Math.min(prev + 5, maxBid));
  const handleDecrement = () => setBidAmount((prev) => Math.max(prev - 5, minBid));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center font-mono">
        Verificando permisos espectrales...
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 flex flex-col lg:flex-row gap-8">
      {/* Columna Izquierda: Detalle del Objeto */}
      <div className="flex-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div className="relative rounded-xl overflow-hidden mb-6 aspect-video bg-slate-950 border border-slate-800 flex items-center justify-center">
            <span className="text-slate-600 font-mono text-sm">[ Preview Objeto Embrujado ]</span>
            <div className="absolute top-4 right-4">
              <CountdownTimer initialSeconds={90} />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-purple-400 mb-2">
            Espejo del Susurro Absoluto
          </h1>
          <p className="text-slate-400 mb-4">
            Maldición asociada: <span className="text-amber-400 font-semibold">Eco del Silencio</span>
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm">
            <span className="text-slate-400">Rango permitido de puja: </span>
            <span className="font-mono text-emerald-400 font-bold">${minBid} - ${maxBid}</span>
          </div>

          {showPenalty && (
            <div className="mt-4">
              <AlertBanner
                type="penalty"
                message="¡Atención! Tu puja ha coincidido con otro participante. Se aplica bajada de reputación."
              />
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Formulario de Puja Secreta y Apuestas */}
      <div className="w-full lg:w-96 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-200">
            <FiLock className="text-purple-400" /> Puja Secreta
          </h2>
          
          <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl p-2 mb-4">
            <button
              type="button"
              onClick={handleDecrement}
              className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              <FiMinus />
            </button>
            <span className="font-mono text-2xl font-bold text-emerald-400">${bidAmount}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className="p-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
            >
              <FiPlus />
            </button>
          </div>

          <p className="text-xs text-slate-500 mb-4 text-center">
            Tu puja permanece oculta hasta el cierre oficial de la subasta.
          </p>

          <button
            type="button"
            onClick={() => setShowPenalty(!showPenalty)}
            className="w-full py-3 bg-purple-700 hover:bg-purple-600 text-white font-bold rounded-xl transition-colors shadow-lg cursor-pointer"
          >
            Confirmar Oferta Oculta
          </button>
        </div>

        <BettingWidget />
      </div>
    </div>
  );
};