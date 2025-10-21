# Backend SocialDance API

## 🚀 Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar Firebase

1. Copia el archivo `config.example.js` como `config.js`:
   ```bash
   copy config.example.js config.js
   ```

2. Actualiza las credenciales de Firebase en `config.js`:
   ```javascript
   module.exports = {
     PORT: process.env.PORT || 3001,
     NODE_ENV: process.env.NODE_ENV || 'development',
     FIREBASE: {
       apiKey: "tu_api_key_real",
       authDomain: "tu-proyecto.firebaseapp.com",
       projectId: "tu-proyecto-id",
       storageBucket: "tu-proyecto.appspot.com",
       messagingSenderId: "123456789",
       appId: "1:123456789:web:abcdef123456"
     }
   };
   ```

### 3. Ejecutar el servidor

#### Desarrollo
```bash
npm run dev
```

#### Producción
```bash
npm start
```

## 📡 Endpoints Disponibles

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
- `GET /api/users/search/email?email=...` - Buscar por email
- `GET /api/users/level/:level` - Filtrar por nivel de baile

### Academias (`/api/academias`)
- `GET /api/academias` - Obtener academias
- `GET /api/academias/:id` - Obtener academia específica
- `POST /api/academias` - Crear academia
- `PUT /api/academias/:id` - Actualizar academia
- `DELETE /api/academias/:id` - Eliminar academia

### Clases (`/api/clases`)
- `GET /api/clases` - Obtener clases
- `GET /api/clases/:id` - Obtener clase específica
- `POST /api/clases` - Crear clase
- `PUT /api/clases/:id` - Actualizar clase
- `DELETE /api/clases/:id` - Eliminar clase

### Eventos (`/api/eventos`)
- `GET /api/eventos` - Obtener eventos
- `GET /api/eventos/:id` - Obtener evento específico
- `POST /api/eventos` - Crear evento
- `PUT /api/eventos/:id` - Actualizar evento
- `DELETE /api/eventos/:id` - Eliminar evento

### Health Check
- `GET /api/health` - Estado del servidor

## 🔧 Ejemplos de Uso

### Login de Usuario
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"123456"}'
```

### Registro de Usuario
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"nuevo@ejemplo.com",
    "password":"123456",
    "displayName":"Juan Pérez",
    "phone":"+1234567890",
    "birthDate":"1990-01-01",
    "danceLevel":"Intermedio"
  }'
```

### Obtener Usuarios
```bash
curl http://localhost:3001/api/users
```

## 🐛 Solución de Problemas

### Error de API Key de Firebase
- Verifica que las credenciales de Firebase estén correctas en `config.js`
- Asegúrate de que el proyecto de Firebase esté activo

### Error de CORS
- El servidor está configurado para aceptar requests desde `http://localhost:3000`
- Para cambiar esto, modifica la configuración de CORS en `server.js`

### Puerto en uso
- El servidor usa el puerto 3001 por defecto
- Puedes cambiarlo con la variable de entorno `PORT`

## 📝 Próximos Pasos

1. Configurar las credenciales de Firebase
2. Implementar middleware de autenticación
3. Agregar validación de datos más robusta
4. Implementar rate limiting
5. Agregar logging y monitoreo
