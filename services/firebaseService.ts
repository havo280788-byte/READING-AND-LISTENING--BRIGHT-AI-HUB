import { db } from "../firebaseConfig";
import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    query,
    orderBy
} from "firebase/firestore";
import { UserStats } from "../types";

const COLLECTION_NAME = "students";

/**
 * Saves or updates user statistics in Firestore.
 */
export const saveUserStats = async (name: string, stats: UserStats) => {
    try {
        const studentRef = doc(db, COLLECTION_NAME, name);
        await setDoc(studentRef, {
            ...stats,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log(`Stats saved for ${name}`);
    } catch (error) {
        console.error("Error saving user stats:", error);
        throw error;
    }
};

/**
 * Retrieves statistics for a specific student from Firestore.
 */
export const getUserStats = async (name: string): Promise<UserStats | null> => {
    try {
        const studentRef = doc(db, COLLECTION_NAME, name);
        const docSnap = await getDoc(studentRef);

        if (docSnap.exists()) {
            return docSnap.data() as UserStats;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user stats:", error);
        throw error;
    }
};

/**
 * Retrieves statistics for ALL students (for Teacher Dashboard).
 */
export interface StudentRecord {
    name: string;
    stats: UserStats;
}

export const getAllStudentStats = async (): Promise<StudentRecord[]> => {
    try {
        const studentsCol = collection(db, COLLECTION_NAME);
        const q = query(studentsCol, orderBy("updatedAt", "desc"));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            name: doc.id,
            stats: doc.data() as UserStats
        }));
    } catch (error) {
        console.error("Error fetching all student stats:", error);
        throw error;
    }
};
