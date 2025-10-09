import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, addDoc } from 'firebase/firestore';

/**
 * GET /api/classes - Obtener todas las clases
 */
export async function GET(request) {
  try {
    const classesCollection = collection(db, 'classes');
    const classesSnapshot = await getDocs(classesCollection);
    const classes = classesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: classes,
      count: classes.length
    });
  } catch (error) {
    console.error('Error al obtener clases:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener clases',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/classes - Crear una nueva clase
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.nombre || !body.id_academia || !body.id_instructor) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: nombre, id_academia, id_instructor' 
        },
        { status: 400 }
      );
    }

    const classesCollection = collection(db, 'classes');
    const newClass = {
      id_academia: body.id_academia,
      id_instructor: body.id_instructor,
      nombre: body.nombre,
      estilo: body.estilo || 'N/A',
      tipo: body.tipo || 'N/A',
      periodicidad: body.periodicidad || 'N/A',
      dia_hora: body.dia_hora || 'N/A',
      costo_clase: body.costo_clase || 0,
      costo_mensual: body.costo_mensual || 0,
      walk_in: body.walk_in || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(classesCollection, newClass);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...newClass
      },
      message: 'Clase creada exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear clase:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear clase',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

