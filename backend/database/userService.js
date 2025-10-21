const { db } = require('../config/firebase/firestore');
const { doc, setDoc, getDoc, updateDoc, deleteDoc, collection, getDocs, query, where, orderBy, limit, startAfter } = require('firebase/firestore');

const COLLECTION_NAME = 'users';

// Crear documento de usuario en Firestore
const createUserDocument = async (uid, userData) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    
    // Verificar si el usuario ya existe
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      throw new Error('El usuario ya existe');
    }

    // Crear el documento
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return { success: true, id: uid };
  } catch (error) {
    console.error('Error creando documento de usuario:', error);
    throw error;
  }
};

// Obtener documento de usuario por UID
const getUserDocument = async (uid) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return null;
    }

    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error('Error obteniendo documento de usuario:', error);
    throw error;
  }
};

// Actualizar documento de usuario
const updateUserDocument = async (uid, updateData) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    
    await updateDoc(userRef, {
      ...updateData,
      updatedAt: new Date()
    });

    return { success: true, id: uid };
  } catch (error) {
    console.error('Error actualizando documento de usuario:', error);
    throw error;
  }
};

// Eliminar documento de usuario
const deleteUserDocument = async (uid) => {
  try {
    const userRef = doc(db, COLLECTION_NAME, uid);
    await deleteDoc(userRef);

    return { success: true, id: uid };
  } catch (error) {
    console.error('Error eliminando documento de usuario:', error);
    throw error;
  }
};

// Obtener todos los usuarios (con paginación)
const getAllUsers = async (limitCount = 10, startAfterDoc = null) => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    const snapshot = await getDocs(q);
    const users = [];

    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return {
      users,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      hasMore: snapshot.docs.length === limitCount
    };
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    throw error;
  }
};

// Buscar usuarios por email
const searchUsersByEmail = async (email) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('email', '==', email)
    );
    const snapshot = await getDocs(q);

    const users = [];
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return users;
  } catch (error) {
    console.error('Error buscando usuarios por email:', error);
    throw error;
  }
};

// Buscar usuarios por nivel de baile
const getUsersByDanceLevel = async (danceLevel) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('danceLevel', '==', danceLevel)
    );
    const snapshot = await getDocs(q);

    const users = [];
    snapshot.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return users;
  } catch (error) {
    console.error('Error obteniendo usuarios por nivel de baile:', error);
    throw error;
  }
};

module.exports = {
  createUserDocument,
  getUserDocument,
  updateUserDocument,
  deleteUserDocument,
  getAllUsers,
  searchUsersByEmail,
  getUsersByDanceLevel
};