import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAuKC9NaTv4hz0xYjlw0kEmpogmZ2cx1oc",
    authDomain: "speaking-and-writing.firebaseapp.com",
    projectId: "speaking-and-writing",
    storageBucket: "speaking-and-writing.firebasestorage.app",
    messagingSenderId: "628086175728",
    appId: "1:628086175728:web:24d412fdb9fef02fab8f35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
