# Estructura del Proyecto SocialDance

## 📁 Organización del Proyecto

El proyecto ha sido reorganizado para separar claramente el **backend** (APIs y base de datos) del **frontend** (interfaz de usuario).

```
my-app/
├── backend/                 # 🚀 Backend - APIs y Base de Datos
│   ├── api/                # Rutas de la API
│   │   └── routes/         # Endpoints específicos
│   │       ├── auth.js     # Autenticación (login, registro, logout)
│   │       ├── users.js    # Gestión de usuarios
│   │       ├── academias.js # Gestión de academias
│   │       ├── clases.js   # Gestión de clases
│   │       └── eventos.js  # Gestión de eventos
│   ├── config/             # Configuración
│   │   └── firebase/       # Configuración de Firebase
│   ├── database/           # Servicios de base de datos
│   │   └── userService.js  # Servicios para usuarios
│   ├── server.js           # Servidor Express principal
│   ├── package.json        # Dependencias del backend
│   └── config.example.js   # Configuración de ejemplo
├── frontend/               # 🎨 Frontend - Interfaz de Usuario
│   ├── app/                # Aplicación Next.js
│   ├── public/             # Archivos estáticos
│   └── ...                 # Otros archivos del frontend
├── scripts/                # Scripts de utilidad
├── data/                   # Datos de ejemplo
└── package.json            # Configuración principal del proyecto
```

## 🚀 Comandos Disponibles

### Desarrollo
```bash
# Ejecutar solo el frontend
npm run dev:frontend

# Ejecutar solo el backend
npm run dev:backend

# Ejecutar frontend y backend simultáneamente
npm run dev:full
```

### Instalación
```bash
# Instalar dependencias del proyecto principal
npm install

# Instalar dependencias del backend
npm run install:backend
```

### Producción
```bash
# Construir frontend
npm run build:frontend

# Construir backend
npm run build:backend

# Ejecutar frontend en producción
npm run start:frontend

# Ejecutar backend en producción
npm run start:backend
```

## 🔧 Configuración del Backend

1. **Instalar dependencias del backend:**
   ```bash
   npm run install:backend
   ```

2. **Configurar variables de entorno:**
   - Copia `backend/config.example.js` como `backend/config.js`
   - Actualiza las credenciales de Firebase

3. **Ejecutar el servidor:**
   ```bash
   npm run dev:backend
   ```

## 📡 API Endpoints Disponibles

### Autenticación (`/api/auth`)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/verify` - Verificar token

### Usuarios (`/api/users`)
- `GET /api/users` - Obtener usuarios
- `GET /api/users/:id` - Obtener usuario específico
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Health Check
- `GET /api/health` - Estado del servidor

## 🔥 Firebase

El proyecto utiliza Firebase para:
- **Authentication**: Login, registro, gestión de sesiones
- **Firestore**: Base de datos NoSQL
- **Storage**: Almacenamiento de archivos

## 📝 Próximos Pasos

1. Configurar las credenciales de Firebase
2. Probar los endpoints de la API
3. Implementar middleware de autenticación
4. Crear componentes de frontend para login/registro
5. Conectar frontend con backend

## 🐛 Solución de Problemas

- **Error de conexión**: Verificar que Firebase esté configurado correctamente
- **CORS**: El backend está configurado para aceptar requests desde `http://localhost:3000`
- **Puertos**: Backend en puerto 3001, Frontend en puerto 3000
