# Configuración de Firebase - SocialDance

## 📋 Configuración Inicial

### 1. Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Registra tu aplicación web

### 2. Obtener credenciales

En la configuración de tu aplicación web en Firebase, encontrarás las credenciales necesarias.

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

**Nota:** El archivo `.env.local` está incluido en `.gitignore` para mantener tus credenciales seguras.

## 🔐 Servicios de Firebase a habilitar

### Authentication
1. Ve a Authentication en Firebase Console
2. Habilita los siguientes métodos de inicio de sesión:
   - Email/Password
   - Google

### Firestore Database
1. Ve a Firestore Database
2. Crea una base de datos
3. Comienza en modo de prueba (puedes cambiar las reglas después)

### Storage
1. Ve a Storage
2. Habilita Cloud Storage
3. Comienza en modo de prueba

## 📚 Estructura de Colecciones Sugerida

### users
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  userType: 'student' | 'academy' | 'instructor',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### classes
```javascript
{
  academyId: string,
  title: string,
  description: string,
  style: string,
  level: 'beginner' | 'intermediate' | 'advanced',
  schedule: {
    startTime: timestamp,
    endTime: timestamp,
    daysOfWeek: array
  },
  location: {
    address: string,
    city: string,
    coordinates: {
      lat: number,
      lng: number
    }
  },
  instructor: string,
  maxStudents: number,
  currentStudents: number,
  price: number,
  images: array,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🛡️ Reglas de Seguridad

### Firestore Rules (ejemplo básico)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Función auxiliar para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Función auxiliar para verificar propietario
    function isOwner(uid) {
      return isAuthenticated() && request.auth.uid == uid;
    }
    
    // Reglas para usuarios
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isOwner(userId);
    }
    
    // Reglas para clases
    match /classes/{classId} {
      allow read: if true; // Públicas para búsqueda
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && 
        resource.data.academyId == request.auth.uid;
    }
  }
}
```

### Storage Rules (ejemplo básico)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Imágenes de perfil
    match /profile-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Imágenes de academias
    match /academy-images/{academyId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == academyId;
    }
    
    // Imágenes de clases
    match /class-images/{classId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Videos
    match /videos/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🚀 Uso en tu aplicación

### Importar servicios
```javascript
// Importar todo desde el archivo index
import { 
  auth, 
  loginWithEmail, 
  registerWithEmail,
  createDocument,
  uploadProfileImage 
} from '@/lib/firebase';
```

### Ejemplo de uso - Autenticación
```javascript
// Registrar usuario
const { user, error } = await registerWithEmail(
  'usuario@ejemplo.com',
  'contraseña123',
  'Nombre Usuario'
);

// Iniciar sesión
const { user, error } = await loginWithEmail(
  'usuario@ejemplo.com',
  'contraseña123'
);

// Cerrar sesión
await logout();
```

### Ejemplo de uso - Firestore
```javascript
// Crear documento
const { id, error } = await createDocument('users', {
  displayName: 'Juan',
  email: 'juan@ejemplo.com',
  userType: 'student'
});

// Leer documentos
const { documents, error } = await getDocuments('classes');

// Actualizar documento
await updateDocument('users', userId, {
  displayName: 'Juan Pérez'
});

// Escuchar cambios en tiempo real
const unsubscribe = subscribeToCollection('classes', [], ({ documents, error }) => {
  console.log('Clases actualizadas:', documents);
});

// Cancelar suscripción cuando ya no se necesite
unsubscribe();
```

### Ejemplo de uso - Storage
```javascript
// Subir imagen de perfil
const { url, error } = await uploadProfileImage(file, userId);

// Subir imagen de academia
const { url, error } = await uploadAcademyImage(file, academyId);

// Eliminar archivo
await deleteFile(fileUrl);
```

## 📦 Funciones Disponibles

### Authentication (auth.js)
- `registerWithEmail(email, password, displayName)` - Registro con email
- `loginWithEmail(email, password)` - Inicio de sesión con email
- `loginWithGoogle()` - Inicio de sesión con Google
- `logout()` - Cerrar sesión
- `onAuthChange(callback)` - Observador de cambios de autenticación
- `sendVerificationEmail()` - Enviar email de verificación
- `resetPassword(email)` - Restablecer contraseña
- `changeEmail(newEmail)` - Cambiar email
- `changePassword(newPassword)` - Cambiar contraseña
- `reauthenticate(password)` - Reautenticar usuario
- `updateUserPhoto(photoURL)` - Actualizar foto de perfil

### Firestore (firestore.js)
- `createDocument(collectionName, data)` - Crear documento
- `getDocuments(collectionName, constraints)` - Obtener documentos
- `getDocument(collectionName, docId)` - Obtener documento específico
- `updateDocument(collectionName, docId, data)` - Actualizar documento
- `deleteDocument(collectionName, docId)` - Eliminar documento
- `setDocument(collectionName, docId, data, merge)` - Crear/actualizar con ID
- `subscribeToDocument(collectionName, docId, callback)` - Listener de documento
- `subscribeToCollection(collectionName, constraints, callback)` - Listener de colección
- `getDocumentsWithPagination(collectionName, constraints, lastDoc, pageSize)` - Paginación

### Storage (storage.js)
- `uploadFile(file, path)` - Subir archivo genérico
- `uploadProfileImage(file, userId)` - Subir imagen de perfil
- `uploadVideo(file, userId)` - Subir video
- `uploadAcademyImage(file, academyId)` - Subir imagen de academia
- `uploadClassImage(file, classId)` - Subir imagen de clase
- `deleteFile(fileUrl)` - Eliminar archivo
- `listFiles(path)` - Listar archivos en directorio

## ⚠️ Notas Importantes

1. **Variables de entorno:** Nunca subas el archivo `.env.local` a tu repositorio
2. **Reglas de seguridad:** Las reglas de ejemplo son básicas, ajústalas según tus necesidades
3. **Límites de Firebase:** Ten en cuenta los límites del plan gratuito de Firebase
4. **Indexación:** Para consultas complejas, Firebase puede requerir índices compuestos
5. **Costos:** Monitorea el uso para evitar cargos inesperados

## 🔗 Enlaces Útiles

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com/)
- [Next.js con Firebase](https://firebase.google.com/docs/web/setup#next.js)

