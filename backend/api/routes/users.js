const express = require('express');
const { getUserDocument, updateUserDocument, deleteUserDocument, getAllUsers, searchUsersByEmail, getUsersByDanceLevel } = require('../../database/userService');

const router = express.Router();

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const { limit = 10, startAfter } = req.query;
    const result = await getAllUsers(parseInt(limit), startAfter);

    res.json({
      success: true,
      data: result.users,
      pagination: {
        lastDoc: result.lastDoc?.id || null,
        hasMore: result.hasMore
      }
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/users/:id - Obtener usuario específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await getUserDocument(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Validar que el usuario existe
    const existingUser = await getUserDocument(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar usuario
    await updateUserDocument(id, updateData);

    // Obtener usuario actualizado
    const updatedUser = await getUserDocument(id);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validar que el usuario existe
    const existingUser = await getUserDocument(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Eliminar usuario
    await deleteUserDocument(id);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/users/search/email - Buscar usuarios por email
router.get('/search/email', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido para la búsqueda'
      });
    }

    const users = await searchUsersByEmail(email);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error buscando usuarios por email:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/users/level/:level - Obtener usuarios por nivel de baile
router.get('/level/:level', async (req, res) => {
  try {
    const { level } = req.params;
    const users = await getUsersByDanceLevel(level);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error obteniendo usuarios por nivel:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
