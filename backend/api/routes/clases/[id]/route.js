import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * GET /api/classes/[id] - Obtener una clase por ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const classDoc = doc(db, 'classes', id);
    const classSnapshot = await getDoc(classDoc);

    if (!classSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Clase no encontrada' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: classSnapshot.id,
        ...classSnapshot.data()
      }
    });
  } catch (error) {
    console.error('Error al obtener clase:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener clase',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/classes/[id] - Actualizar una clase
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const classDoc = doc(db, 'classes', id);
    const classSnapshot = await getDoc(classDoc);

    if (!classSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Clase no encontrada' 
        },
        { status: 404 }
      );
    }

    const updatedData = {
      ...body,
      updatedAt: new Date()
    };

    delete updatedData.createdAt;

    await updateDoc(classDoc, updatedData);

    return NextResponse.json({
      success: true,
      data: {
        id,
        ...updatedData
      },
      message: 'Clase actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar clase:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar clase',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/classes/[id] - Eliminar una clase
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const classDoc = doc(db, 'classes', id);
    const classSnapshot = await getDoc(classDoc);

    if (!classSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Clase no encontrada' 
        },
        { status: 404 }
      );
    }

    await deleteDoc(classDoc);

    return NextResponse.json({
      success: true,
      message: 'Clase eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar clase:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar clase',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

