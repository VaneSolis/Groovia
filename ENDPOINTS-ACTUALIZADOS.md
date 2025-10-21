# 🎉 ¡Endpoints Actualizados a Español!

Los endpoints de la API han sido renombrados al español para mayor claridad.

## 📝 Cambios Realizados

### ✅ Antes → Después

| Antes (Inglés) | Después (Español) |
|----------------|-------------------|
| `/api/academies` | `/api/academias` |
| `/api/classes` | `/api/clases` |
| `/api/events` | `/api/eventos` |
| `/api/users` | `/api/users` (sin cambio) |

---

## 🌐 Endpoints Disponibles

### 👥 Usuarios
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### 🏫 Academias
- `GET /api/academias` - Obtener todas las academias
- `GET /api/academias/:id` - Obtener academia por ID
- `POST /api/academias` - Crear academia
- `PUT /api/academias/:id` - Actualizar academia
- `DELETE /api/academias/:id` - Eliminar academia

### 💃 Clases
- `GET /api/clases` - Obtener todas las clases
- `GET /api/clases/:id` - Obtener clase por ID
- `POST /api/clases` - Crear clase
- `PUT /api/clases/:id` - Actualizar clase
- `DELETE /api/clases/:id` - Eliminar clase

### 🎉 Eventos
- `GET /api/eventos` - Obtener todos los eventos
- `GET /api/eventos/:id` - Obtener evento por ID
- `POST /api/eventos` - Crear evento
- `PUT /api/eventos/:id` - Actualizar evento
- `DELETE /api/eventos/:id` - Eliminar evento

---

## 🔄 Cómo Actualizar

### 1️⃣ Reimportar la Colección de Postman

1. Elimina la colección anterior de Postman
2. Importa nuevamente: `Groovia-API.postman_collection.json`
3. ¡Listo! Los nuevos endpoints estarán configurados

### 2️⃣ Prueba los Nuevos Endpoints

**Ejemplo - Academias:**
```
GET http://localhost:3000/api/academias
```

**Ejemplo - Clases:**
```
GET http://localhost:3000/api/clases
```

**Ejemplo - Eventos:**
```
GET http://localhost:3000/api/eventos
```

---

## 📂 Archivos Actualizados

✅ `app/api/academias/` - Carpeta renombrada  
✅ `app/api/clases/` - Carpeta renombrada  
✅ `app/api/eventos/` - Carpeta renombrada  
✅ `Groovia-API.postman_collection.json` - Colección actualizada  
✅ `API-README.md` - Documentación actualizada  

---

## ⚠️ Nota Importante

Si tienes el servidor corriendo, **reinícialo** para que reconozca los cambios:

```bash
# Detén el servidor (Ctrl+C)
# Luego inicia de nuevo:
npm run dev
```

---

## ✨ ¡Listo para Usar!

Ahora todos los endpoints están en español y listos para probar en Postman.

**URLs Actualizadas:**
- Base URL: `http://localhost:3000/api`
- Academias: `http://localhost:3000/api/academias`
- Clases: `http://localhost:3000/api/clases`
- Eventos: `http://localhost:3000/api/eventos`
- Usuarios: `http://localhost:3000/api/users`

---

**¡Feliz desarrollo! 🚀**

