// lib/firebase/index.js
// Archivo central de exportación para facilitar imports

// Configuración
export { auth, db, storage } from './config';

// Funciones de autenticación
export {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout,
  onAuthChange,
  sendVerificationEmail,
  resetPassword,
  changeEmail,
  changePassword,
  reauthenticate,
  updateUserPhoto
} from './auth';

// Funciones de Firestore
export {
  createDocument,
  getDocuments,
  getDocument,
  updateDocument,
  deleteDocument,
  setDocument,
  subscribeToDocument,
  subscribeToCollection,
  getDocumentsWithPagination,
  getUsersByType,
  getClassesByAcademy,
  searchClasses
} from './firestore';

// Funciones de Storage
export {
  uploadFile,
  uploadProfileImage,
  uploadVideo,
  uploadAcademyImage,
  uploadClassImage,
  deleteFile,
  listFiles
} from './storage';

