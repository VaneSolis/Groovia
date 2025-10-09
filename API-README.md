# 🎵 Groovia API - Documentación

API REST para la plataforma SocialDance de Groovia, desarrollada con Next.js y Firebase Firestore.

## 🚀 Configuración Inicial

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
Crea un archivo `.env.local` en la raíz del proyecto con tus credenciales de Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 3. Iniciar el servidor
```bash
npm run dev
```

La API estará disponible en: `http://localhost:3000/api`

---

## 📋 Endpoints Disponibles

### Base URL
```
http://localhost:3000/api
```

---

## 👥 Usuarios (Users)

### GET `/api/users`
Obtiene todos los usuarios registrados.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user123",
      "nombre": "Juan",
      "apellido": "Pérez",
      "correo": "juan@example.com",
      "tipo_usuario": "Alumno",
      ...
    }
  ],
  "count": 1
}
```

### GET `/api/users/:id`
Obtiene un usuario específico por ID.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "data": {
    "id": "user123",
    "nombre": "Juan",
    "apellido": "Pérez",
    "correo": "juan@example.com",
    ...
  }
}
```

### POST `/api/users`
Crea un nuevo usuario.

**Body (JSON):**
```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan@example.com",
  "genero": "Masculino",
  "fecha_nacimiento": "1990-05-15",
  "pais": "México",
  "ciudad": "Mérida",
  "tipo_usuario": "Alumno"
}
```

**Campos requeridos:** `nombre`, `correo`

**Respuesta exitosa (201):**
```json
{
  "success": true,
  "data": {
    "id": "generated_id",
    ...
  },
  "message": "Usuario creado exitosamente"
}
```

### PUT `/api/users/:id`
Actualiza un usuario existente.

**Body (JSON):**
```json
{
  "nombre": "Juan Carlos",
  "ciudad": "Cancún"
}
```

### DELETE `/api/users/:id`
Elimina un usuario.

**Respuesta exitosa (200):**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente"
}
```

---

## 🏫 Academias (Academies)

### GET `/api/academies`
Obtiene todas las academias.

### GET `/api/academies/:id`
Obtiene una academia específica.

### POST `/api/academies`
Crea una nueva academia.

**Body (JSON):**
```json
{
  "id_instructor": "user123",
  "nombre": "Academia de Salsa Caribeña",
  "ubicacion": "Mérida, Yucatán",
  "descripcion": "Academia especializada en bailes tropicales"
}
```

**Campos requeridos:** `nombre`, `id_instructor`

### PUT `/api/academies/:id`
Actualiza una academia existente.

### DELETE `/api/academies/:id`
Elimina una academia.

---

## 💃 Clases (Classes)

### GET `/api/classes`
Obtiene todas las clases.

### GET `/api/classes/:id`
Obtiene una clase específica.

### POST `/api/classes`
Crea una nueva clase.

**Body (JSON):**
```json
{
  "id_academia": "academy123",
  "id_instructor": "user123",
  "nombre": "Salsa Intermedia",
  "estilo": "Salsa Cubana",
  "tipo": "Grupal",
  "periodicidad": "Semanal",
  "dia_hora": "Martes y Jueves 19:00",
  "costo_clase": 100,
  "costo_mensual": 800,
  "walk_in": true
}
```

**Campos requeridos:** `nombre`, `id_academia`, `id_instructor`

### PUT `/api/classes/:id`
Actualiza una clase existente.

### DELETE `/api/classes/:id`
Elimina una clase.

---

## 🎉 Eventos (Events)

### GET `/api/events`
Obtiene todos los eventos.

### GET `/api/events/:id`
Obtiene un evento específico.

### POST `/api/events`
Crea un nuevo evento.

**Body (JSON):**
```json
{
  "nombre": "Festival de Salsa 2025",
  "descripcion": "Gran festival con instructores internacionales",
  "fecha_hora": "2025-12-15 18:00",
  "ubicacion": "Plaza Grande, Mérida",
  "costo": 500,
  "tipo": "Festival"
}
```

**Campos requeridos:** `nombre`

### PUT `/api/events/:id`
Actualiza un evento existente.

### DELETE `/api/events/:id`
Elimina un evento.

---

## 📮 Probar con Postman

### Importar Colección

1. Abre Postman
2. Click en **Import**
3. Selecciona el archivo `Groovia-API.postman_collection.json`
4. La colección incluye todos los endpoints listos para probar

### Variable de Entorno

La colección usa una variable `{{base_url}}` configurada como:
```
http://localhost:3000/api
```

Puedes cambiarla si despliegas en otro servidor.

---

## 🔒 Formato de Respuestas

### Respuesta Exitosa
```json
{
  "success": true,
  "data": {...},
  "message": "Operación exitosa"
}
```

### Respuesta de Error
```json
{
  "success": false,
  "error": "Descripción del error",
  "message": "Detalles adicionales"
}
```

### Códigos de Estado HTTP

- `200` - OK (Operación exitosa)
- `201` - Created (Recurso creado)
- `400` - Bad Request (Datos inválidos)
- `404` - Not Found (Recurso no encontrado)
- `500` - Internal Server Error (Error del servidor)

---

## 🛠️ Tecnologías

- **Next.js 15** - Framework React
- **Firebase Firestore** - Base de datos NoSQL
- **JavaScript** - Lenguaje de programación

---

## 📝 Notas Importantes

1. **Autenticación:** Actualmente la API no requiere autenticación. Considera agregar Firebase Auth para producción.

2. **IDs Dinámicos:** Al crear recursos (POST), Firebase genera IDs automáticamente. Usa estos IDs para operaciones GET, PUT y DELETE.

3. **Timestamps:** Los campos `createdAt` y `updatedAt` se generan automáticamente.

4. **Validación:** Cada endpoint valida los campos requeridos antes de procesar la solicitud.

---

## 🐛 Solución de Problemas

### Error: "Firebase not initialized"
- Verifica que tu archivo `.env.local` tenga todas las variables de Firebase
- Reinicia el servidor de desarrollo

### Error: "Collection not found"
- Asegúrate de haber ejecutado el script de importación de datos:
  ```bash
  node scripts/importGrooviaData.js
  ```

### Error: "Document not found" (404)
- Verifica que el ID del documento sea correcto
- Usa el endpoint GET para listar todos los documentos y obtener IDs válidos

---

## 📞 Soporte

Para problemas o preguntas, revisa:
- Documentación de Firebase: https://firebase.google.com/docs
- Documentación de Next.js: https://nextjs.org/docs

---

**¡Feliz desarrollo! 🎵💃**

