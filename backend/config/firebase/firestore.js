// backend/config/firebase/firestore.js
const { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp
} = require('firebase/firestore');
const { db } = require('./config');

// Crear un nuevo documento
const createDocument = async (collectionName, data) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Obtener todos los documentos de una colección
const getDocuments = async (collectionName, constraints = []) => {
  try {
    let q = collection(db, collectionName);
    
    // Aplicar constraints
    constraints.forEach(constraint => {
      q = query(q, ...constraint);
    });
    
    const querySnapshot = await getDocs(q);
    const documents = [];
    
    querySnapshot.forEach(doc => {
      documents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { documents, error: null };
  } catch (error) {
    return { documents: [], error: error.message };
  }
};

// Obtener un documento específico
const getDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { document: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { document: null, error: 'Documento no encontrado' };
    }
  } catch (error) {
    return { document: null, error: error.message };
  }
};

// Actualizar un documento
const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Eliminar un documento
const deleteDocument = async (collectionName, docId) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  db
};