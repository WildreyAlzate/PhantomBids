🔮 PhantomBids - Plataforma de Subastas Inversas y Relicarios Malditos

Asignatura: Ingeniería Web (2026-2)
Docente: Silvia Natalia Suarez Gomez
Equipo: Equipo 8
Integrantes: Carlos Ignacio Uribe Vásquez y Wildrey Alexis Alzate Berrío (Wil)

---

## 🚀 Enlaces de Producción y Repositorios

* **URL Frontend (Vercel):** https://phantom-bids.vercel.app (Catálogo principal en: /houses)
* **URL Backend (Render):** https://phantombids-back-3aod.onrender.com

### Repositorios del Proyecto (Forks) // Se realizo un fork para montar los repos a render y vercel
* **Repositorio Frontend:** https://github.com/WildreyAlzate/PhantomBids
* **Repositorio Backend:** https://github.com/WildreyAlzate/phantombids-back
### Repositorios del Proyecto 
* **Repositorio Frontend:** https://github.com/Kaiser7771/PhantomBids.git
* **Repositorio Backend:** https://github.com/Kaiser7771/phantombids-back.git


---

## 🔑 Credenciales de Prueba (Roles y Permisos)
Para evaluar los accesos y restricciones de roles (RBAC):

* **Administrador:**
  * *Correo:* `admin@phantombids.com`
  * *Contraseña:* `Admin123*`
* **Usuario Estándar:**
  * *Correo:* `user@phantombids.com`
  * *Contraseña:* `User123*`

---

📌 **Descripción del Proyecto**

PhantomBids es una plataforma web inmersiva de subastas inversas y comercio de artefactos paranormales. La aplicación permite a los usuarios explorar recintos ocultos, pujar en tiempo real por objetos embrujados bajo un entorno de anonimato y gestionar un registro detallado de maldiciones, sanciones y rankings de reputación.

🚀 **Tecnologías Utilizadas**

* **Framework:** React
* **Empaquetador & Server:** Vite
* **Estilos:** Tailwind CSS (Tema personalizado modo oscuro base slate-950 con acentos purple, rose, amber y emerald)
* **Enrutamiento:** React Router DOM (Con soporte de rutas protegidas y navegación declarativa)
* **Iconografía:** React Icons (`react-icons/fi`, `react-icons/gi`)
* **Gestión de Estado:** Context API (`AuthContext`)
* **Comunicación HTTP:** Axios (Consumo de API real integrada con Render)

📁 **Arquitectura del Proyecto**

El proyecto sigue una estructura modular por dominios de negocio y separación de responsabilidades:

src/
├── main.jsx
├── App.jsx
├── App.css
├── context/
│   └── AuthContext.jsx          # Context API para gestión global de sesión y rol
├── routes/
│   ├── AppRoutes.jsx            # Enrutador principal de la aplicación
│   └── ProtectedRoute.jsx       # Control de acceso basado en roles (RBAC)
├── data/                        # Mocks centralizados de respaldo
│   ├── houses.js
│   ├── objects.js
│   └── rankings.js
├── components/
│   ├── AlertBanner.jsx          # Alertas visuales y sanciones
│   ├── BettingWidget.jsx        # Widget de apuestas paralelas (3x)
│   ├── CountdownTimer.jsx       # Temporizador dinámico en tiempo real
│   ├── layout/
│   │   └── Navbar.jsx           # Barra de navegación principal y estado de sesión
│   └── ui/
│       └── Input.jsx            # Componente de entrada de datos reutilizable
└── pages/
    ├── AuthPage.jsx             # Formulario controlado de Login / Registro
    ├── HousePage.jsx            # Catálogo de recintos ocultos y salas VIP
    ├── ProfilePage.jsx          # Perfil de usuario y registro de pujas
    ├── CreateObjectPage.jsx     # Publicación de objetos con previsualización en tiempo real
    ├── AuctionDetail.jsx        # Detalle de subasta y consola de ofertas
    ├── CurseLog.jsx             # Registro de sanciones y efectos espectrales
    └── RankingsDashboard.jsx    # Tableros de clasificación de invocadores

✨ **Características Principales**

* **Subastas Inversas en Tiempo Real:** Monitorización de pujas con alertas dinámicas cuando el temporizador entra en estado crítico (< 30s).
* **Control de Acceso Basado en Roles (RBAC):** Restricción de rutas privadas conectadas a `AuthContext`.
* **Integración API REST con Axios:** Conexión directa y segura con el backend en Render utilizando variables de entorno (`VITE_API_URL`).

