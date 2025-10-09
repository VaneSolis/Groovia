// lib/firebase/firestore.js
import { 
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
    serverTimestamp,
    onSnapshot,
    startAfter,
    setDoc
  } from 'firebase/firestore';
  import { db } from './config';
  
  // Crear un nuevo documento
  export const createDocument = async (collectionName, data) => {
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
  export const getDocuments = async (collectionName, constraints = []) => {
    try {
      let q = collection(db, collectionName);
      
      // Aplicar constraints (where, orderBy, limit)
      constraints.forEach(constraint => {
        q = query(q, ...constraint);
      });
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      return { documents, error: null };
    } catch (error) {
      return { documents: [], error: error.message };
    }
  };
  
  // Obtener un documento específico
  export const getDocument = async (collectionName, docId) => {
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
  export const updateDocument = async (collectionName, docId, data) => {
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
  export const deleteDocument = async (collectionName, docId) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Consultas específicas para SocialDanz
  export const getUsersByType = async (userType) => {
    return await getDocuments('users', [
      [where('userType', '==', userType)]
    ]);
  };
  
  export const getClassesByAcademy = async (academyId) => {
    return await getDocuments('classes', [
      [where('academyId', '==', academyId)],
      [orderBy('schedule.startTime', 'asc')]
    ]);
  };
  
  export const searchClasses = async (filters = {}) => {
    const constraints = [];
    
    if (filters.style) {
      constraints.push([where('style', '==', filters.style)]);
    }
    
    if (filters.level) {
      constraints.push([where('level', '==', filters.level)]);
    }
    
    if (filters.location) {
      constraints.push([where('location.city', '==', filters.location)]);
    }
    
    constraints.push([orderBy('schedule.startTime', 'asc')]);
    constraints.push([limit(20)]);
    
    return await getDocuments('classes', constraints);
  };
  
  // Crear o actualizar documento con ID específico
  export const setDocument = async (collectionName, docId, data, merge = true) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge });
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Listener en tiempo real para un documento
  export const subscribeToDocument = (collectionName, docId, callback) => {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          callback({ document: { id: docSnap.id, ...docSnap.data() }, error: null });
        } else {
          callback({ document: null, error: 'Documento no encontrado' });
        }
      },
      (error) => {
        callback({ document: null, error: error.message });
      }
    );
  };
  
  // Listener en tiempo real para una colección
  export const subscribeToCollection = (collectionName, constraints = [], callback) => {
    let q = collection(db, collectionName);
    
    // Aplicar constraints
    constraints.forEach(constraint => {
      q = query(q, ...constraint);
    });
    
    return onSnapshot(q,
      (querySnapshot) => {
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        callback({ documents, error: null });
      },
      (error) => {
        callback({ documents: [], error: error.message });
      }
    );
  };
  
  // Consulta con paginación
  export const getDocumentsWithPagination = async (collectionName, constraints = [], lastDoc = null, pageSize = 10) => {
    try {
      let q = collection(db, collectionName);
      
      // Aplicar constraints
      constraints.forEach(constraint => {
        q = query(q, ...constraint);
      });
      
      // Aplicar límite
      q = query(q, limit(pageSize));
      
      // Si hay un último documento, continuar desde ahí
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      return { 
        documents, 
        lastDoc: lastVisible, 
        hasMore: querySnapshot.docs.length === pageSize,
        error: null 
      };
    } catch (error) {
      return { documents: [], lastDoc: null, hasMore: false, error: error.message };
    }
  };