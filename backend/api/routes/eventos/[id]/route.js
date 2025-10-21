import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * GET /api/events/[id] - Obtener un evento por ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const eventDoc = doc(db, 'events', id);
    const eventSnapshot = await getDoc(eventDoc);

    if (!eventSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Evento no encontrado' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: eventSnapshot.id,
        ...eventSnapshot.data()
      }
    });
  } catch (error) {
    console.error('Error al obtener evento:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener evento',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/events/[id] - Actualizar un evento
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const eventDoc = doc(db, 'events', id);
    const eventSnapshot = await getDoc(eventDoc);

    if (!eventSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Evento no encontrado' 
        },
        { status: 404 }
      );
    }

    const updatedData = {
      ...body,
      updatedAt: new Date()
    };

    delete updatedData.createdAt;

    await updateDoc(eventDoc, updatedData);

    return NextResponse.json({
      success: true,
      data: {
        id,
        ...updatedData
      },
      message: 'Evento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar evento:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar evento',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/events/[id] - Eliminar un evento
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const eventDoc = doc(db, 'events', id);
    const eventSnapshot = await getDoc(eventDoc);

    if (!eventSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Evento no encontrado' 
        },
        { status: 404 }
      );
    }

    await deleteDoc(eventDoc);

    return NextResponse.json({
      success: true,
      message: 'Evento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar evento',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

