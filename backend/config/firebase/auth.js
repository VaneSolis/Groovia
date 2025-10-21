// backend/config/firebase/auth.js
const { 
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
  } = require('firebase/auth');
  const { auth } = require('./config');
  
  // Registro con email y contraseña
  const registerWithEmail = async (email, password, displayName) => {
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
  const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Inicio de sesión con Google
  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      return { user: userCredential.user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  };
  
  // Cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Observer para cambios de autenticación
  const onAuthChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };
  
  // Enviar email de verificación
  const sendVerificationEmail = async () => {
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
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error) {
      return { error: error.message };
    }
  };
  
  // Actualizar email del usuario
  const changeEmail = async (newEmail) => {
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
  const changePassword = async (newPassword) => {
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
  const reauthenticate = async (password) => {
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
  const updateUserPhoto = async (photoURL) => {
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

  module.exports = {
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
  };