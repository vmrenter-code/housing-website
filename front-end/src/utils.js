export const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const isOnline = () => typeof navigator !== 'undefined' && navigator.onLine;

export const readOfflineCache = (key, defaultValue = null) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch {
        return defaultValue;
    }
};

export const writeOfflineCache = (key, value) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // ignore write failures
    }
};

export const deleteOfflineCache = (key) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.removeItem(key);
    } catch {
        // ignore delete failures
    }
};