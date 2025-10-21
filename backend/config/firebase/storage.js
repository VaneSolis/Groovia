// lib/firebase/storage.js
import { 
    ref, 
    uploadBytes, 
    getDownloadURL, 
    deleteObject,
    listAll 
  } from 'firebase/storage';
  import { storage } from './config';
  
  // Subir archivo
  export const uploadFile = async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return { url: downloadURL, error: null };
    } catch (error) {
      return { url: null, error: error.message };
    }
  };
  
  // Subir imagen de perfil
  export const uploadProfileImage = async (file, userId) => {
    const path = `profile-images/${userId}/${Date.now()}-${file.name}`;
    return await uploadFile(file, path);
  };
  
  // Subir video
  export const uploadVideo = async (file, userId) => {
    const path = `videos/${userId}/${Date.now()}-${file.name}`;
    return await uploadFile(file, path);
  };
  
  // Eliminar archivo
  export const deleteFile = async (fileUrl) => {
    try {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Subir imagen de academia
  export const uploadAcademyImage = async (file, academyId) => {
    const path = `academy-images/${academyId}/${Date.now()}-${file.name}`;
    return await uploadFile(file, path);
  };
  
  // Subir imagen de clase
  export const uploadClassImage = async (file, classId) => {
    const path = `class-images/${classId}/${Date.now()}-${file.name}`;
    return await uploadFile(file, path);
  };
  
  // Listar archivos en un directorio
  export const listFiles = async (path) => {
    try {
      const listRef = ref(storage, path);
      const result = await listAll(listRef);
      
      const files = await Promise.all(
        result.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return {
            name: itemRef.name,
            fullPath: itemRef.fullPath,
            url
          };
        })
      );
      
      return { files, error: null };
    } catch (error) {
      return { files: [], error: error.message };
    }
  };