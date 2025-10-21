const express = require('express');
const { getDocuments, getDocument, createDocument, updateDocument, deleteDocument } = require('../../config/firebase/firestore');

const router = express.Router();
const COLLECTION_NAME = 'eventos';

// GET /api/eventos - Obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const { limit = 10, city, style, date } = req.query;
    const constraints = [];

    if (city) {
      constraints.push([where('location.city', '==', city)]);
    }

    if (style) {
      constraints.push([where('styles', 'array-contains', style)]);
    }

    if (date) {
      // Filtrar por fecha específica
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      constraints.push([where('date', '>=', startDate)]);
      constraints.push([where('date', '<', endDate)]);
    }

    const result = await getDocuments(COLLECTION_NAME, constraints);

    res.json({
      success: true,
      data: result.documents,
      error: result.error
    });
  } catch (error) {
    console.error('Error obteniendo eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// GET /api/eventos/:id - Obtener evento específico
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await getDocument(COLLECTION_NAME, id);

    if (result.error) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado',
        error: result.error
      });
    }

    res.json({
      success: true,
      data: result.document
    });
  } catch (error) {
    console.error('Error obteniendo evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// POST /api/eventos - Crear nuevo evento
router.post('/', async (req, res) => {
  try {
    const eventoData = req.body;

    // Validar datos requeridos
    if (!eventoData.name || !eventoData.date || !eventoData.location) {
      return res.status(400).json({
        success: false,
        message: 'Nombre, fecha y ubicación son requeridos'
      });
    }

    const result = await createDocument(COLLECTION_NAME, eventoData);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error creando evento',
        error: result.error
      });
    }

    res.status(201).json({
      success: true,
      message: 'Evento creado exitosamente',
      data: { id: result.id }
    });
  } catch (error) {
    console.error('Error creando evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// PUT /api/eventos/:id - Actualizar evento
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const result = await updateDocument(COLLECTION_NAME, id, updateData);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error actualizando evento',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Evento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// DELETE /api/eventos/:id - Eliminar evento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteDocument(COLLECTION_NAME, id);

    if (result.error) {
      return res.status(400).json({
        success: false,
        message: 'Error eliminando evento',
        error: result.error
      });
    }

    res.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando evento:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
