import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

/**
 * GET /api/academies - Obtener todas las academias
 */
export async function GET(request) {
  try {
    const academiesCollection = collection(db, 'academies');
    const academiesSnapshot = await getDocs(academiesCollection);
    const academies = academiesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: academies,
      count: academies.length
    });
  } catch (error) {
    console.error('Error al obtener academias:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener academias',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/academies - Crear una nueva academia
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.nombre || !body.id_instructor) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: nombre, id_instructor' 
        },
        { status: 400 }
      );
    }

    const academiesCollection = collection(db, 'academies');
    const newAcademy = {
      id_instructor: body.id_instructor,
      nombre: body.nombre,
      ubicacion: body.ubicacion || 'N/A',
      descripcion: body.descripcion || 'N/A',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(academiesCollection, newAcademy);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...newAcademy
      },
      message: 'Academia creada exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear academia:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear academia',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

