const express = require('express');
const { loginWithEmail, registerWithEmail, loginWithGoogle, logout } = require('../../config/firebase/auth');
const { createUserDocument, getUserDocument } = require('../../database/userService');

const router = express.Router();

// POST /api/auth/login - Iniciar sesión con email y contraseña
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos de entrada
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Intentar login con Firebase
    const { user, error } = await loginWithEmail(email, password);

    if (error) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
        error: error
      });
    }

    // Obtener datos adicionales del usuario desde Firestore
    const userData = await getUserDocument(user.uid);

    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        ...userData
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/auth/register - Registrar nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName, phone, birthDate, danceLevel } = req.body;

    // Validar datos de entrada
    if (!email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        message: 'Email, contraseña y nombre son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Registrar usuario en Firebase Auth
    const { user, error } = await registerWithEmail(email, password, displayName);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Error al crear usuario',
        error: error
      });
    }

    // Crear documento de usuario en Firestore
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      phone: phone || '',
      birthDate: birthDate || null,
      danceLevel: danceLevel || 'Principiante',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await createUserDocument(user.uid, userData);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        ...userData
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/auth/google - Iniciar sesión con Google
router.post('/google', async (req, res) => {
  try {
    // Nota: Para Google Auth, necesitarás implementar el flujo en el frontend
    // ya que requiere interacción del usuario con la ventana de popup
    res.status(501).json({
      success: false,
      message: 'Google Auth debe implementarse en el frontend'
    });
  } catch (error) {
    console.error('Error en Google Auth:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/auth/logout - Cerrar sesión
router.post('/logout', async (req, res) => {
  try {
    const { error } = await logout();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Error al cerrar sesión',
        error: error
      });
    }

    res.json({
      success: true,
      message: 'Sesión cerrada exitosamente'
    });

  } catch (error) {
    console.error('Error en logout:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/auth/verify - Verificar token de autenticación
router.get('/verify', async (req, res) => {
  try {
    // Esta ruta requeriría middleware de autenticación
    // Por ahora devolvemos un mensaje informativo
    res.json({
      success: true,
      message: 'Endpoint de verificación - implementar middleware de auth'
    });
  } catch (error) {
    console.error('Error en verificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
