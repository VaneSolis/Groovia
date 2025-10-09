# Scripts de Utilidad - Groovia

## 📥 Importar Datos a Firestore

### Script: `importData.js`

Este script te permite importar datos desde archivos JSON a Firestore de manera sencilla.

### Requisitos previos

1. Asegúrate de tener el archivo `.env.local` configurado con tus credenciales de Firebase
2. Coloca tu archivo JSON en alguna carpeta (recomendado: crear carpeta `data/`)

### Uso

```bash
node scripts/importData.js <nombre-colección> <ruta-al-archivo.json>
```

### Ejemplos

```bash
# Importar usuarios
node scripts/importData.js users data/users.json

# Importar clases
node scripts/importData.js classes data/classes.json

# Importar academias
node scripts/importData.js academies data/academies.json
```

### Formatos de JSON soportados

El script acepta dos formatos de JSON:

#### Formato 1: Array de objetos
```json
[
  {
    "id": "user1",
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "userType": "student"
  },
  {
    "id": "user2",
    "name": "María García",
    "email": "maria@ejemplo.com",
    "userType": "instructor"
  }
]
```

#### Formato 2: Objeto con IDs como claves
```json
{
  "user1": {
    "name": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "userType": "student"
  },
  "user2": {
    "name": "María García",
    "email": "maria@ejemplo.com",
    "userType": "instructor"
  }
}
```

### Notas importantes

- Si no especificas un `id` en los documentos, se generará uno automáticamente
- El script agrega automáticamente campos `createdAt` y `updatedAt` si no existen
- Soporta hasta 500 documentos por lote (sin límite total)
- Los datos existentes con el mismo ID serán sobrescritos

### Ejemplo de estructura de carpetas

```
my-app/
  ├── data/              ← Crea esta carpeta para tus archivos JSON
  │   ├── users.json
  │   ├── classes.json
  │   └── academies.json
  ├── scripts/
  │   ├── importData.js
  │   └── README.md
  └── ...
```

### Solución de problemas

**Error: "Cannot find module 'firebase'"**
- Asegúrate de estar en la raíz del proyecto
- Verifica que las dependencias estén instaladas: `npm install`

**Error: "Firebase config not found"**
- Verifica que el archivo `.env.local` exista
- Asegúrate de que todas las variables de entorno estén configuradas

**Error: "Permission denied"**
- Verifica las reglas de seguridad de Firestore en Firebase Console
- En modo de desarrollo, puedes usar reglas permisivas temporalmente

