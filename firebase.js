// Firebase Modüllerini İçe Aktar
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { 
    getFirestore, collection, doc, addDoc, getDocs, updateDoc, deleteDoc, 
    onSnapshot, query, serverTimestamp, writeBatch 
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// --- FIREBASE YAPILANDIRMASI ---
const firebaseConfig = {
    apiKey: "AIzaSyDsIDN74rIPhYtdaTIkeGcrczxQEjr7-sw",
    authDomain: "emre-bebe-takip.firebaseapp.com",
    projectId: "emre-bebe-takip",
    storageBucket: "emre-bebe-takip.firebasestorage.app",
    messagingSenderId: "174642780473",
    appId: "1:174642780473:web:89c50d5f80612c16e3f0e8"
};

// --- SERVİSLERİ BAŞLAT VE DIŞA AKTAR ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Gerekli servisleri ve fonksiyonları dışa aktararak diğer dosyalardan erişilebilir yap
export {
    db,
    auth,
    signInAnonymously,
    onAuthStateChanged,
    collection,
    doc,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    serverTimestamp,
    writeBatch
};
