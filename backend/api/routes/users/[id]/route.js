import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * GET /api/users/[id] - Obtener un usuario por ID
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const userDoc = doc(db, 'users', id);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuario no encontrado' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: userSnapshot.id,
        ...userSnapshot.data()
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener usuario',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/users/[id] - Actualizar un usuario
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const userDoc = doc(db, 'users', id);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuario no encontrado' 
        },
        { status: 404 }
      );
    }

    const updatedData = {
      ...body,
      updatedAt: new Date()
    };

    // Eliminar campos que no se deben actualizar
    delete updatedData.createdAt;

    await updateDoc(userDoc, updatedData);

    return NextResponse.json({
      success: true,
      data: {
        id,
        ...updatedData
      },
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar usuario',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id] - Eliminar un usuario
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const userDoc = doc(db, 'users', id);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuario no encontrado' 
        },
        { status: 404 }
      );
    }

    await deleteDoc(userDoc);

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar usuario',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

