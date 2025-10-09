// scripts/importGrooviaData.js
// Script para importar datos de Groovia.json a Firestore

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Verificar configuración
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Error: Configuración de Firebase incompleta');
  console.error('Asegúrate de tener el archivo .env.local configurado correctamente');
  process.exit(1);
}

console.log('✅ Configuración de Firebase cargada correctamente');
console.log(`   - Project ID: ${firebaseConfig.projectId}`);

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Limpiar datos inválidos para Firestore
 */
function cleanData(obj) {
  const cleaned = {};
  for (const [key, value] of Object.entries(obj)) {
    // Saltar valores undefined o null
    if (value === undefined || value === null) continue;
    
    // Saltar campo contraseña por seguridad
    if (key === 'contraseña' || key === 'password') continue;
    
    // Si es una fecha, mantenerla
    if (value instanceof Date) {
      cleaned[key] = value;
    }
    // Si es un array, limpiarlo
    else if (Array.isArray(value)) {
      if (value.length > 0) {
        cleaned[key] = value;
      }
    }
    // Si es un objeto, limpiarlo recursivamente
    else if (typeof value === 'object') {
      const cleanedObj = cleanData(value);
      // Solo agregar si el objeto tiene propiedades
      if (Object.keys(cleanedObj).length > 0) {
        cleaned[key] = cleanedObj;
      }
    }
    // Para números, strings (incluyendo 'N/A'), booleanos
    else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Validar ID de documento para Firestore
 */
function validateDocId(id) {
  if (!id || typeof id !== 'string') return false;
  // Firestore no permite ciertos caracteres en IDs
  const invalidChars = /[\/\\\.\#\$\[\]]/;
  return !invalidChars.test(id) && id.length > 0 && id.length <= 1500;
}

/**
 * Importar documentos en lote
 */
async function importBatch(collectionName, documents) {
  if (documents.length === 0) return;
  
  console.log(`📥 Importando ${documents.length} documentos a '${collectionName}'...`);
  
  // Validar IDs antes de importar
  const invalidDocs = documents.filter(({ id }) => !validateDocId(id));
  if (invalidDocs.length > 0) {
    console.error(`❌ Documentos con IDs inválidos encontrados:`);
    invalidDocs.forEach(({ id }) => console.error(`   - "${id}"`));
    throw new Error(`Se encontraron ${invalidDocs.length} documentos con IDs inválidos`);
  }
  
  const batchSize = 500;
  const batches = [];
  
  for (let i = 0; i < documents.length; i += batchSize) {
    const batch = writeBatch(db);
    const batchDocs = documents.slice(i, i + batchSize);
    
    batchDocs.forEach(({ id, data }) => {
      const docRef = doc(db, collectionName, id);
      const cleanedData = cleanData(data);
      batch.set(docRef, cleanedData);
    });
    
    batches.push(batch);
  }
  
  for (let i = 0; i < batches.length; i++) {
    await batches[i].commit();
    console.log(`  ✅ Lote ${i + 1}/${batches.length} completado`);
  }
  
  console.log(`  ✨ ${documents.length} documentos importados a '${collectionName}'\n`);
}

/**
 * Normalizar y importar datos de Groovia
 */
async function importGrooviaData() {
  try {
    console.log('\n🚀 Iniciando importación de datos de Groovia...\n');
    
    // Leer archivo JSON
    const jsonPath = path.resolve('data/Groovia.json');
    const fileContent = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log('📂 Archivo Groovia.json cargado correctamente\n');
    
    // Arrays para almacenar los documentos normalizados
    const users = [];
    const academies = [];
    const classes = [];
    const enrollments = [];
    const attendances = [];
    const videos = [];
    const messages = [];
    const payments = [];
    const events = [];
    const eventParticipants = [];
    
    // Procesar usuarios
    if (data.usuarios) {
      Object.entries(data.usuarios).forEach(([userId, userData]) => {
        // Usuario base
        users.push({
          id: userId,
          data: {
            nombre: userData.nombre || 'N/A',
            apellido: userData.apellido || 'N/A',
            correo: userData.correo || 'N/A',
            genero: userData.genero || 'N/A',
            fecha_nacimiento: userData.fecha_nacimiento || 'N/A',
            pais: userData.pais || 'N/A',
            ciudad: userData.ciudad || 'N/A',
            foto_perfil: userData.foto_perfil || 'N/A',
            tipo_usuario: userData.tipo_usuario || 'Alumno',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        
        // Academias del usuario
        if (userData.academias) {
          Object.entries(userData.academias).forEach(([academiaId, academiaData]) => {
            academies.push({
              id: academiaId,
              data: {
                id_instructor: userId,
                nombre: academiaData.nombre_academia || 'N/A',
                ubicacion: academiaData.ubicacion || 'N/A',
                descripcion: academiaData.descripcion || 'N/A',
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
            
            // Clases de la academia
            if (academiaData.clases) {
              Object.entries(academiaData.clases).forEach(([claseId, claseData]) => {
                classes.push({
                  id: claseId,
                  data: {
                    id_academia: academiaId,
                    id_instructor: userId,
                    nombre: claseData.nombre_clase || 'N/A',
                    estilo: claseData.estilo || 'N/A',
                    tipo: claseData.tipo || 'N/A',
                    periodicidad: claseData.periodicidad || 'N/A',
                    dia_hora: claseData.dia_hora || 'N/A',
                    costo_clase: claseData.costo_clase || 0,
                    costo_mensual: claseData.costo_mensual || 0,
                    walk_in: claseData.walk_in || false,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }
                });
                
                // Inscripciones de la clase
                if (claseData.inscripciones) {
                  Object.entries(claseData.inscripciones).forEach(([inscripcionId, inscripcionData]) => {
                    enrollments.push({
                      id: `${claseId}_${inscripcionId}`,
                      data: {
                        id_clase: claseId,
                        id_alumno: inscripcionData.id_alumno || 'N/A',
                        fecha_inscripcion: inscripcionData.fecha_inscripcion || 'N/A',
                        estado: inscripcionData.estado || 'Activo',
                        createdAt: new Date(),
                        updatedAt: new Date()
                      }
                    });
                  });
                }
                
                // Asistencias de la clase
                if (claseData.asistencias) {
                  Object.entries(claseData.asistencias).forEach(([asistenciaId, asistenciaData]) => {
                    attendances.push({
                      id: `${claseId}_${asistenciaId}`,
                      data: {
                        id_clase: claseId,
                        id_alumno: asistenciaData.id_alumno || 'N/A',
                        fecha: asistenciaData.fecha || 'N/A',
                        presente: asistenciaData.presente || false,
                        createdAt: new Date(),
                        updatedAt: new Date()
                      }
                    });
                  });
                }
              });
            }
          });
        }
        
        // Videos del usuario
        if (userData.videos) {
          Object.entries(userData.videos).forEach(([videoId, videoData]) => {
            videos.push({
              id: videoId,
              data: {
                id_instructor: userId,
                titulo: videoData.titulo || 'N/A',
                descripcion: videoData.descripcion || 'N/A',
                url_video: videoData.url_video || 'N/A',
                estilo: videoData.estilo || 'N/A',
                fecha_publicacion: videoData.fecha_publicacion || 'N/A',
                exclusivo: videoData.exclusivo || false,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          });
        }
        
        // Mensajes del usuario
        if (userData.mensajes) {
          Object.entries(userData.mensajes).forEach(([mensajeId, mensajeData]) => {
            messages.push({
              id: `${userId}_${mensajeId}`,
              data: {
                id_remitente: userId,
                id_destinatario: mensajeData.id_destinatario || 'N/A',
                contenido: mensajeData.contenido || 'N/A',
                fecha_envio: mensajeData.fecha_envio || 'N/A',
                leido: false,
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          });
        }
        
        // Pagos del usuario
        if (userData.pagos) {
          Object.entries(userData.pagos).forEach(([pagoId, pagoData]) => {
            payments.push({
              id: `${userId}_${pagoId}`,
              data: {
                id_usuario: userId,
                id_clase: pagoData.id_clase || 'N/A',
                monto: pagoData.monto || 0,
                fecha_pago: pagoData.fecha_pago || 'N/A',
                metodo: pagoData.metodo || 'N/A',
                estado: pagoData.estado || 'Pendiente',
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          });
        }
      });
    }
    
    // Procesar eventos
    if (data.eventos) {
      Object.entries(data.eventos).forEach(([eventoId, eventoData]) => {
        events.push({
          id: eventoId,
          data: {
            nombre: eventoData.nombre_evento || 'N/A',
            descripcion: eventoData.descripcion || 'N/A',
            fecha_hora: eventoData.fecha_hora || 'N/A',
            ubicacion: eventoData.ubicacion || 'N/A',
            costo: eventoData.costo || 0,
            tipo: eventoData.tipo_evento || 'N/A',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        
        // Participantes del evento
        if (eventoData.participantes) {
          Object.entries(eventoData.participantes).forEach(([participanteId, participanteData]) => {
            eventParticipants.push({
              id: `${eventoId}_${participanteId}`,
              data: {
                id_evento: eventoId,
                id_usuario: participanteData.id_usuario || 'N/A',
                rol: participanteData.rol || 'Asistente',
                createdAt: new Date(),
                updatedAt: new Date()
              }
            });
          });
        }
      });
    }
    
    // Importar todas las colecciones
    console.log('📊 Resumen de datos a importar:');
    console.log(`   - Usuarios: ${users.length}`);
    console.log(`   - Academias: ${academies.length}`);
    console.log(`   - Clases: ${classes.length}`);
    console.log(`   - Inscripciones: ${enrollments.length}`);
    console.log(`   - Asistencias: ${attendances.length}`);
    console.log(`   - Videos: ${videos.length}`);
    console.log(`   - Mensajes: ${messages.length}`);
    console.log(`   - Pagos: ${payments.length}`);
    console.log(`   - Eventos: ${events.length}`);
    console.log(`   - Participantes de eventos: ${eventParticipants.length}\n`);
    
    await importBatch('users', users);
    await importBatch('academies', academies);
    await importBatch('classes', classes);
    await importBatch('enrollments', enrollments);
    await importBatch('attendances', attendances);
    await importBatch('videos', videos);
    await importBatch('messages', messages);
    await importBatch('payments', payments);
    await importBatch('events', events);
    await importBatch('event_participants', eventParticipants);
    
    console.log('🎉 ¡Importación completada exitosamente!');
    console.log('✨ Todos los datos de Groovia han sido importados a Firebase\n');
    
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    throw error;
  }
}

// Ejecutar script
importGrooviaData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });

