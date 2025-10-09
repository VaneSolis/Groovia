// lib/firebase/auth.js
import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
  } from 'firebase/auth';
  import { auth } from './config';
  
  // Registro con email y contraseña
  export const registerWithEmail = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil con nombre
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
  
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Inicio de sesión con email y contraseña
  export const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Inicio de sesión con Google
  export const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Cerrar sesión
  export const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Observer para cambios de autenticación
  export const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };
  
  // Enviar email de verificación
  export const sendVerificationEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        return { error: null };
      }
      return { error: 'No hay usuario autenticado' };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Restablecer contraseña
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Actualizar email del usuario
  export const changeEmail = async (newEmail) => {
    try {
      if (auth.currentUser) {
        await updateEmail(auth.currentUser, newEmail);
        return { error: null };
      }
      return { error: 'No hay usuario autenticado' };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Actualizar contraseña del usuario
  export const changePassword = async (newPassword) => {
    try {
      if (auth.currentUser) {
        await updatePassword(auth.currentUser, newPassword);
        return { error: null };
      }
      return { error: 'No hay usuario autenticado' };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Reautenticar usuario (necesario para operaciones sensibles)
  export const reauthenticate = async (password) => {
    try {
      if (auth.currentUser && auth.currentUser.email) {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email,
          password
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        return { error: null };
      }
      return { error: 'No hay usuario autenticado' };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Actualizar foto de perfil
  export const updateUserPhoto = async (photoURL) => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL });
        return { error: null };
      }
      return { error: 'No hay usuario autenticado' };
    } catch (error) {
      return { error: error.message };
    }
  };