import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/Input";
import { FiMail, FiLock, FiUser, FiShield } from "react-icons/fi";
import { GiGhost } from "react-icons/gi";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

// Definimos la URL base asegurando que apunte a Render si VITE_API_URL no está configurada
const API_URL = import.meta.env.VITE_API_URL || "https://phantombids-back-3aod.onrender.com";

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Estados controlados para los inputs
  const [alias, setAlias] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas de campos vacíos
    if (!email || !password || (!isLogin && !alias)) {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    setError("");

    try {
      if (isLogin) {
        // Petición real al endpoint de Login del backend
        const res = await axios.post(`${API_URL}/api/auth/login`, {
          email,
          password,
        });

        // Guardamos el token real que devuelve el servidor en el localStorage
        const token = res.data.token || res.data.accessToken;
        if (token) {
          localStorage.setItem("token", token);
        }

        // Si tu contexto también maneja el estado de usuario
        authLogin(res.data.user || { email, role: "user" });

      } else {
        // Petición real al endpoint de Registro del backend
        const res = await axios.post(`${API_URL}/api/auth/register`, {
          alias,
          email,
          password,
        });

        // Si el registro devuelve token automáticamente, lo guardamos
        const token = res.data.token || res.data.accessToken;
        if (token) {
          localStorage.setItem("token", token);
        }

        authLogin(res.data.user || { alias, email, role: "user" });
      }

      // Redirigir a las casas de subasta tras iniciar/registrar sesión con éxito
      navigate("/houses");
    } catch (err) {
      console.error("Error en autenticación:", err);
      setError(
        err.response?.data?.message || 
        "Error al conectar con el servidor espectral. Verifica tus credenciales."
      );
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-8">
          <GiGhost className="text-3xl text-purple-400 animate-bounce mb-3" />
          <h1 className="text-2xl font-bold text-purple-400">PhantomBids</h1>
          <p className="text-sm text-slate-400 mt-1">{isLogin ? "Accede" : "Únete"}</p>
        </div>
        
        <div className="flex bg-slate-950 p-1 rounded-xl mb-6">
          <button 
            type="button" 
            onClick={() => { setIsLogin(true); setError(""); }} 
            className={`flex-1 py-2 text-sm rounded-lg transition-colors cursor-pointer ${isLogin ? "bg-purple-900/50 text-purple-300 font-semibold" : "text-slate-400"}`}
          >
            Login
          </button>
          <button 
            type="button" 
            onClick={() => { setIsLogin(false); setError(""); }} 
            className={`flex-1 py-2 text-sm rounded-lg transition-colors cursor-pointer ${!isLogin ? "bg-purple-900/50 text-purple-300 font-semibold" : "text-slate-400"}`}
          >
            Registro
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input 
              label="Alias" 
              icon={FiUser} 
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="Tu alias anónimo"
            />
          )}
          
          <Input 
            label="Correo" 
            type="email" 
            icon={FiMail} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@espectral.com"
          />
          
          <Input 
            label="Contraseña" 
            type={showPassword ? "text" : "password"} 
            icon={FiLock} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-purple-600 hover:bg-purple-500 transition-colors text-white py-3 rounded-xl flex justify-center items-center gap-2 font-semibold cursor-pointer shadow-lg shadow-purple-900/30"
          >
            <FiShield /> {isLogin ? "Entrar" : "Crear Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
}