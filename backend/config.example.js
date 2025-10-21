// Archivo de configuración de ejemplo
// Copia este archivo como config.js y actualiza los valores

module.exports = {
  // Configuración del servidor
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Configuración de Firebase
  FIREBASE: {
    apiKey: process.env.FIREBASE_API_KEY || "tu_api_key_aqui",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || "tu_proyecto.firebaseapp.com",
    projectId: process.env.FIREBASE_PROJECT_ID || "tu_proyecto_id",
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "tu_proyecto.appspot.com",
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: process.env.FIREBASE_APP_ID || "1:123456789:web:abcdef123456"
  },

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000"
};
