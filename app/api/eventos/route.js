import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

/**
 * GET /api/events - Obtener todos los eventos
 */
export async function GET(request) {
  try {
    const eventsCollection = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);
    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: events,
      count: events.length
    });
  } catch (error) {
    console.error('Error al obtener eventos:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener eventos',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events - Crear un nuevo evento
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.nombre) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campo requerido: nombre' 
        },
        { status: 400 }
      );
    }

    const eventsCollection = collection(db, 'events');
    const newEvent = {
      nombre: body.nombre,
      descripcion: body.descripcion || 'N/A',
      fecha_hora: body.fecha_hora || 'N/A',
      ubicacion: body.ubicacion || 'N/A',
      costo: body.costo || 0,
      tipo: body.tipo || 'N/A',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(eventsCollection, newEvent);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...newEvent
      },
      message: 'Evento creado exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear evento:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear evento',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

