/**
 * Firebase Realtime Database Service (REST API)
 * Uses Firebase REST API directly — no SDK required.
 *
 * URL is hardcoded as default so students never need to configure it manually.
 * Teachers can still override it via Settings modal or ?fb= query param.
 */

const FIREBASE_URL_KEY = 'elite_eng_firebase_url';

// ✅ URL chính xác của Firebase project này (Singapore region)
// Học sinh KHÔNG cần nhập thủ công — tự động kết nối
const DEFAULT_FIREBASE_URL = 'https://elite-eng-default-rtdb.asia-southeast1.firebasedatabase.app';

/** Get the saved Firebase Database URL (falls back to hardcoded default) */
export const getFirebaseUrl = (): string => {
    const saved = localStorage.getItem(FIREBASE_URL_KEY)?.replace(/\/$/, '') || '';
    // Auto-correct old wrong URL
    if (saved === 'https://elite-eng-default-rtdb.firebaseio.com') {
        localStorage.setItem(FIREBASE_URL_KEY, DEFAULT_FIREBASE_URL);
        return DEFAULT_FIREBASE_URL;
    }
    // Return saved if valid, otherwise use default
    return saved || DEFAULT_FIREBASE_URL;
};

/** Save the Firebase Database URL */
export const setFirebaseUrl = (url: string) => {
    localStorage.setItem(FIREBASE_URL_KEY, url.replace(/\/$/, ''));
};

/** Check if Firebase is configured (always true since we have a default) */
export const isFirebaseConfigured = (): boolean => {
    return true; // DEFAULT_FIREBASE_URL is always available
};

/**
 * Save a student's full progress to Firebase.
 * SAFE WRITE: Only called with validated, non-zero data.
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
