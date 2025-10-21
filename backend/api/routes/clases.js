const express = require('express');
const { getDocuments, getDocument, createDocument, updateDocument, deleteDocument } = require('../../config/firebase/firestore');

const router = express.Router();
const COLLECTION_NAME = 'clases';

// GET /api/clases - Obtener todas las clases
router.get('/', async (req, res) => {
  try {
    const { limit = 10, academyId, style, level, city } = req.query;
    const constraints = [];

    if (academyId) {
      constraints.push([where('academyId', '==', academyId)]);
    }

    if (style) {
      constraints.push([where('style', '==', style)]);
    }

    if (level) {
      constraints.push([where('level', '==', level)]);
    }

    if (city) {
      constraints.push([where('location.city', '==', city)]);
    }

    const result = await getDocuments(COLLECTION_NAME, constraints);

    res.json({
      success: true,
      data: result.documents,
      error: result.error
    });
  } catch (error) {
    console.error('Error obteniendo clases:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/clases/:id - Obtener clase específica
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getDocument(COLLECTION_NAME, id);

    if (result.error) {
      return res.status(404).json({
        success: false,
        message: 'Clase no encontrada',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.document
    });
  } catch (error) {
    console.error('Error obteniendo clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/clases - Crear nueva clase
router.post('/', async (req, res) => {
  try {
    const claseData = req.body;

    // Validar datos requeridos
    if (!claseData.name || !claseData.academyId || !claseData.style) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, academia y estilo son requeridos'
      });
    }

    const result = await createDocument(COLLECTION_NAME, claseData);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error creando clase',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: 'Clase creada exitosamente',
      data: { id: result.id }
    });
  } catch (error) {
    console.error('Error creando clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/clases/:id - Actualizar clase
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await updateDocument(COLLECTION_NAME, id, updateData);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error actualizando clase',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Clase actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/clases/:id - Eliminar clase
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteDocument(COLLECTION_NAME, id);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error eliminando clase',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Clase eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando clase:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
