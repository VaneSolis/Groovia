import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * GET /api/academies/[id] - Obtener una academia por ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const academyDoc = doc(db, 'academies', id);
    const academySnapshot = await getDoc(academyDoc);

    if (!academySnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Academia no encontrada' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: academySnapshot.id,
        ...academySnapshot.data()
      }
    });
  } catch (error) {
    console.error('Error al obtener academia:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener academia',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/academies/[id] - Actualizar una academia
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const academyDoc = doc(db, 'academies', id);
    const academySnapshot = await getDoc(academyDoc);

    if (!academySnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Academia no encontrada' 
        },
        { status: 404 }
      );
    }

    const updatedData = {
      ...body,
      updatedAt: new Date()
    };

    delete updatedData.createdAt;

    await updateDoc(academyDoc, updatedData);

    return NextResponse.json({
      success: true,
      data: {
        id,
        ...updatedData
      },
      message: 'Academia actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar academia:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar academia',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/academies/[id] - Eliminar una academia
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const academyDoc = doc(db, 'academies', id);
    const academySnapshot = await getDoc(academyDoc);

    if (!academySnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Academia no encontrada' 
        },
        { status: 404 }
      );
    }

    await deleteDoc(academyDoc);

    return NextResponse.json({
      success: true,
      message: 'Academia eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar academia:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar academia',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

