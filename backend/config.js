// Configuración de Firebase para el backend
// Reemplaza estos valores con tus credenciales reales de Firebase

module.exports = {
  // Configuración del servidor
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Configuración de Firebase
  FIREBASE: {
    apiKey: "TU_API_KEY_AQUI", // ← Reemplaza con tu API Key
    authDomain: "tu-proyecto.firebaseapp.com", // ← Reemplaza con tu dominio
    projectId: "tu-proyecto-id", // ← Reemplaza con tu Project ID
    storageBucket: "tu-proyecto.appspot.com", // ← Reemplaza con tu Storage Bucket
    messagingSenderId: "123456789", // ← Reemplaza con tu Sender ID
    appId: "1:123456789:web:abcdef123456" // ← Reemplaza con tu App ID
  },

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000"
};
