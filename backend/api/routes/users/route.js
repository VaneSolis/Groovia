import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

/**
 * GET /api/users - Obtener todos los usuarios
 */
export async function GET(request) {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener usuarios',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/users - Crear un nuevo usuario
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validar campos requeridos
    if (!body.nombre || !body.correo) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos requeridos: nombre, correo' 
        },
        { status: 400 }
      );
    }

    const usersCollection = collection(db, 'users');
    const newUser = {
      nombre: body.nombre,
      apellido: body.apellido || '',
      correo: body.correo,
      genero: body.genero || 'N/A',
      fecha_nacimiento: body.fecha_nacimiento || 'N/A',
      pais: body.pais || 'N/A',
      ciudad: body.ciudad || 'N/A',
      foto_perfil: body.foto_perfil || 'N/A',
      tipo_usuario: body.tipo_usuario || 'Alumno',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await addDoc(usersCollection, newUser);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...newUser
      },
      message: 'Usuario creado exitosamente'
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear usuario',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

