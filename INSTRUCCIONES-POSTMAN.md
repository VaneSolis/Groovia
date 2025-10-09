# 📮 Cómo Probar la API con Postman

## 🎯 Paso a Paso

### 1️⃣ Iniciar el Servidor

Primero, asegúrate de tener el servidor Next.js corriendo:

```bash
npm run dev
```

El servidor iniciará en: **http://localhost:3000**

---

### 2️⃣ Instalar Postman

Si no tienes Postman instalado:

1. Descarga desde: https://www.postman.com/downloads/
2. Instala y abre la aplicación

---

### 3️⃣ Importar la Colección

1. Abre Postman
2. Click en el botón **Import** (esquina superior izquierda)
3. Arrastra el archivo `Groovia-API.postman_collection.json` o haz click en **Upload Files**
4. Selecciona el archivo del proyecto
5. Click en **Import**

¡Listo! Verás una carpeta **"Groovia API - SocialDance"** con todos los endpoints.

---

### 4️⃣ Estructura de la Colección

La colección está organizada en 4 carpetas:

```
📁 Groovia API - SocialDance
  ├── 📂 Usuarios (5 requests)
  │   ├── GET - Obtener todos los usuarios
  │   ├── GET - Obtener usuario por ID
  │   ├── POST - Crear nuevo usuario
  │   ├── PUT - Actualizar usuario
  │   └── DELETE - Eliminar usuario
  │
  ├── 📂 Academias (5 requests)
  ├── 📂 Clases (5 requests)
  └── 📂 Eventos (5 requests)
```

---

### 5️⃣ Probar los Endpoints

#### ✅ Ejemplo 1: Crear un Usuario

1. Expande la carpeta **"Usuarios"**
2. Click en **"Crear nuevo usuario"**
3. Verás el body JSON pre-configurado:

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "correo": "juan.perez@example.com",
  "genero": "Masculino",
  "fecha_nacimiento": "1990-05-15",
  "pais": "México",
  "ciudad": "Mérida",
  "tipo_usuario": "Alumno"
}
```

4. Click en **Send**
5. Verás la respuesta con el ID generado:

```json
{
  "success": true,
  "data": {
    "id": "abc123xyz",
    "nombre": "Juan",
    ...
  },
  "message": "Usuario creado exitosamente"
}
```

6. **🔑 COPIA EL ID** (ejemplo: `abc123xyz`) - lo necesitarás para los siguientes pasos

---

#### ✅ Ejemplo 2: Obtener el Usuario Creado

1. Click en **"Obtener usuario por ID"**
2. En la URL verás: `http://localhost:3000/api/users/:id`
3. Reemplaza `:id` con el ID que copiaste (ejemplo: `abc123xyz`)
4. La URL quedará: `http://localhost:3000/api/users/abc123xyz`
5. Click en **Send**
6. Verás los datos del usuario

---

#### ✅ Ejemplo 3: Actualizar el Usuario

1. Click en **"Actualizar usuario"**
2. Reemplaza `:id` en la URL con tu ID
3. Modifica el body JSON con los datos a actualizar:

```json
{
  "nombre": "Juan Carlos",
  "ciudad": "Cancún"
}
```

4. Click en **Send**

---

#### ✅ Ejemplo 4: Obtener Todos los Usuarios

1. Click en **"Obtener todos los usuarios"**
2. Click en **Send**
3. Verás una lista con todos los usuarios en Firestore

---

### 6️⃣ Trabajar con Relaciones

#### Crear una Academia

Para crear una academia, necesitas el **ID de un usuario** que sea instructor:

1. Crea un usuario (o usa uno existente)
2. Copia su ID
3. Ve a **Academias → Crear nueva academia**
4. Reemplaza `USER_ID_HERE` en el body con el ID real:

```json
{
  "id_instructor": "abc123xyz",  // ← Tu ID de usuario real
  "nombre": "Academia de Salsa Caribeña",
  "ubicacion": "Mérida, Yucatán",
  "descripcion": "Academia especializada en bailes tropicales"
}
```

5. Click en **Send**
6. **Copia el ID de la academia** para crear clases

---

#### Crear una Clase

Para crear una clase, necesitas:
- **ID de una academia**
- **ID de un instructor (usuario)**

1. Ve a **Clases → Crear nueva clase**
2. Reemplaza los placeholders:

```json
{
  "id_academia": "xyz789abc",    // ← ID de academia real
  "id_instructor": "abc123xyz",  // ← ID de usuario real
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

3. Click en **Send**

---

### 7️⃣ Variable de Entorno (Opcional)

La colección usa una variable `{{base_url}}` configurada como:
```
http://localhost:3000/api
```

Para cambiarla (si despliegas en otro servidor):

1. Click en **Environments** (lado izquierdo)
2. Crea un nuevo environment
3. Agrega variable:
   - **Variable:** `base_url`
   - **Initial Value:** `http://localhost:3000/api`
4. Selecciona el environment creado

---

### 8️⃣ Tips Importantes

✅ **IDs Generados:** Firebase genera IDs automáticamente. Siempre copia los IDs de las respuestas para usarlos en otros requests.

✅ **Orden de Prueba:** Sigue este orden para probar correctamente:
1. Crear Usuario
2. Crear Academia (con ID de usuario)
3. Crear Clase (con ID de academia e instructor)
4. Crear Evento

✅ **Servidor Corriendo:** Asegúrate de que `npm run dev` esté corriendo antes de hacer requests.

✅ **Datos en Firestore:** Puedes ver todos los datos en la consola de Firebase:
   - https://console.firebase.google.com/
   - Ve a tu proyecto → Firestore Database

---

### 9️⃣ Errores Comunes

#### ❌ Error: "Cannot GET /api/users"
**Solución:** El servidor no está corriendo. Ejecuta `npm run dev`

#### ❌ Error 404: "Usuario no encontrado"
**Solución:** El ID que usaste no existe. Usa el endpoint "Obtener todos los usuarios" para ver IDs válidos.

#### ❌ Error 400: "Campos requeridos: nombre, correo"
**Solución:** El body JSON está incompleto. Verifica que tengas todos los campos requeridos.

#### ❌ Error 500: "Firebase not initialized"
**Solución:** 
1. Verifica que `.env.local` tenga todas las variables de Firebase
2. Reinicia el servidor (`npm run dev`)

---

### 🎉 ¡Todo Listo!

Ahora puedes probar todos los endpoints de la API. 

**Recuerda:**
- Lee la documentación completa en `API-README.md`
- Los datos se guardan en Firebase Firestore
- Puedes modificar los ejemplos según tus necesidades

---

**¿Tienes dudas?** Revisa el archivo `API-README.md` para más información detallada.

**¡Feliz testing! 🚀**

