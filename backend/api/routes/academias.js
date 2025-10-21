const express = require('express');
const { getDocuments, getDocument, createDocument, updateDocument, deleteDocument } = require('../../config/firebase/firestore');

const router = express.Router();
const COLLECTION_NAME = 'academias';

// GET /api/academias - Obtener todas las academias
router.get('/', async (req, res) => {
  try {
    const { limit = 10, city, style } = req.query;
    const constraints = [];

    if (city) {
      constraints.push([where('location.city', '==', city)]);
    }

    if (style) {
      constraints.push([where('styles', 'array-contains', style)]);
    }

    const result = await getDocuments(COLLECTION_NAME, constraints);

    res.json({
      success: true,
      data: result.documents,
      error: result.error
    });
  } catch (error) {
    console.error('Error obteniendo academias:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/academias/:id - Obtener academia específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getDocument(COLLECTION_NAME, id);

    if (result.error) {
      return res.status(404).json({
        success: false,
        message: 'Academia no encontrada',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.document
    });
  } catch (error) {
    console.error('Error obteniendo academia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/academias - Crear nueva academia
router.post('/', async (req, res) => {
  try {
    const academiaData = req.body;

    // Validar datos requeridos
    if (!academiaData.name || !academiaData.location) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y ubicación son requeridos'
      });
    }

    const result = await createDocument(COLLECTION_NAME, academiaData);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error creando academia',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: 'Academia creada exitosamente',
      data: { id: result.id }
    });
  } catch (error) {
    console.error('Error creando academia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/academias/:id - Actualizar academia
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await updateDocument(COLLECTION_NAME, id, updateData);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error actualizando academia',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Academia actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando academia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/academias/:id - Eliminar academia
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteDocument(COLLECTION_NAME, id);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error eliminando academia',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Academia eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando academia:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
