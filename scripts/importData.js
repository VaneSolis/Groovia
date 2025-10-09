// scripts/importData.js
// Script para importar datos JSON a Firestore

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, writeBatch } = require('firebase/firestore');
const fs = require('fs');
const path = require('path');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Importar datos en lote (hasta 500 documentos por lote)
 * @param {string} collectionName - Nombre de la colección
 * @param {Array|Object} data - Datos a importar
 */
async function importData(collectionName, data) {
  try {
    console.log(`📥 Iniciando importación a la colección: ${collectionName}`);
    
    let documents = [];
    
    // Si data es un objeto, convertirlo a array
    if (!Array.isArray(data)) {
      // Si es un objeto con estructura { docId: { datos }, ... }
      documents = Object.entries(data).map(([id, docData]) => ({
        id,
        ...docData
      }));
    } else {
      documents = data;
    }
    
    console.log(`📊 Total de documentos a importar: ${documents.length}`);
    
    // Firestore permite máximo 500 operaciones por batch
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchDocs = documents.slice(i, i + batchSize);
      
      batchDocs.forEach((docData) => {
        // Si el documento tiene un id, usarlo; si no, generar uno automático
        const docId = docData.id || doc(collection(db, collectionName)).id;
        const docRef = doc(db, collectionName, docId);
        
        // Remover el id del objeto para no duplicarlo
        const { id, ...dataWithoutId } = docData;
        
        // Agregar timestamps si no existen
        const dataToSave = {
          ...dataWithoutId,
          createdAt: docData.createdAt || new Date(),
          updatedAt: docData.updatedAt || new Date(),
        };
        
        batch.set(docRef, dataToSave);
      });
      
      batches.push(batch);
    }
    
    // Ejecutar todos los batches
    console.log(`🔄 Ejecutando ${batches.length} lote(s)...`);
    
    for (let i = 0; i < batches.length; i++) {
      await batches[i].commit();
      console.log(`✅ Lote ${i + 1}/${batches.length} completado`);
    }
    
    console.log(`🎉 Importación completada exitosamente!`);
    console.log(`✨ ${documents.length} documentos importados a '${collectionName}'`);
    
  } catch (error) {
    console.error('❌ Error durante la importación:', error);
    throw error;
  }
}

/**
 * Cargar y procesar archivo JSON
 * @param {string} filePath - Ruta al archivo JSON
 */
function loadJsonFile(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    console.log(`📂 Leyendo archivo: ${absolutePath}`);
    
    const fileContent = fs.readFileSync(absolutePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    console.log('✅ Archivo JSON cargado correctamente');
    return data;
  } catch (error) {
    console.error('❌ Error al leer el archivo JSON:', error.message);
    throw error;
  }
}

/**
 * Función principal
 */
async function main() {
  try {
    // Obtener argumentos de línea de comandos
    const args = process.argv.slice(2);
    
    if (args.length < 2) {
      console.log(`
📖 Uso: node scripts/importData.js <colección> <archivo.json>

Ejemplos:
  node scripts/importData.js users data/users.json
  node scripts/importData.js classes data/classes.json
  node scripts/importData.js academies data/academies.json

Nota: El archivo JSON puede tener dos formatos:
  1. Array de objetos: [{ id: "1", nombre: "..." }, { id: "2", ... }]
  2. Objeto con IDs: { "id1": { nombre: "..." }, "id2": { ... } }
      `);
      process.exit(1);
    }
    
    const collectionName = args[0];
    const jsonFilePath = args[1];
    
    console.log('\n🚀 Iniciando script de importación...\n');
    
    // Cargar datos del archivo JSON
    const data = loadJsonFile(jsonFilePath);
    
    // Importar datos a Firestore
    await importData(collectionName, data);
    
    console.log('\n✨ Proceso completado!\n');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar script
main();

