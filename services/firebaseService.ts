/**
 * Firebase Realtime Database Service (REST API)
 * Uses Firebase REST API directly — no SDK required.
 * Teacher pastes their Firebase Database URL in the Settings modal.
 */

const FIREBASE_URL_KEY = 'elite_eng_firebase_url';
const CORRECT_FIREBASE_URL = 'https://elite-eng-default-rtdb.asia-southeast1.firebasedatabase.app';

/** Get the saved Firebase Database URL */
export const getFirebaseUrl = (): string => {
    const saved = localStorage.getItem(FIREBASE_URL_KEY)?.replace(/\/$/, '') || '';
    // Auto-correct old wrong URL to the correct regional one
    if (saved === 'https://elite-eng-default-rtdb.firebaseio.com') {
        localStorage.setItem(FIREBASE_URL_KEY, CORRECT_FIREBASE_URL);
        return CORRECT_FIREBASE_URL;
    }
    return saved;
};

/** Save the Firebase Database URL */
export const setFirebaseUrl = (url: string) => {
    localStorage.setItem(FIREBASE_URL_KEY, url.replace(/\/$/, ''));
};

/** Check if Firebase is configured */
export const isFirebaseConfigured = (): boolean => {
    return !!getFirebaseUrl();
};

/**
 * Save a student's full progress to Firebase.
 * Called whenever a module is completed.
 */
export const saveStudentProgress = async (username: string, data: any): Promise<boolean> => {
    const baseUrl = getFirebaseUrl();
    if (!baseUrl) return false;

    try {
        const response = await fetch(`${baseUrl}/students/${username}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: data.name,
                username: data.username,
                xp: data.xp || 0,
                completedModules: data.completedModules || 0,
                moduleProgress: data.moduleProgress || {},
                progress: data.progress || {},
                selectedUnitId: data.selectedUnitId || 'u1',
                lastUpdated: new Date().toISOString()
            })
        });
        return response.ok;
    } catch (error) {
        console.warn('Firebase sync failed (save):', error);
        return false;
    }
};

/**
 * Load a single student's progress from Firebase.
 * Used on login to merge with local data.
 */
export const loadStudentProgress = async (username: string): Promise<any | null> => {
    const baseUrl = getFirebaseUrl();
    if (!baseUrl) return null;

    try {
        const response = await fetch(`${baseUrl}/students/${username}.json`);
        if (!response.ok) return null;
        const data = await response.json();
        return data; // null if student has no data yet
    } catch (error) {
        console.warn('Firebase sync failed (load student):', error);
        return null;
    }
};

/**
 * Load ALL students' progress from Firebase.
 * Used for the shared leaderboard on Dashboard.
 */
export const loadAllStudentsProgress = async (): Promise<Record<string, any>> => {
    const baseUrl = getFirebaseUrl();
    if (!baseUrl) return {};

    try {
        const response = await fetch(`${baseUrl}/students.json`);
        if (!response.ok) return {};
        const data = await response.json();
        return data || {};
    } catch (error) {
        console.warn('Firebase sync failed (load all):', error);
        return {};
    }
};
