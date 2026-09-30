export const localStorageKeys = {
    SESSION_TOKEN: 'sessionToken',
    USER: 'user',
    BALANCE: 'balance',
    TRANSACTIONS: 'transactions',
    RACES_HISTORY: 'racesHistory',
    LAST_RACE_DATE: 'lastRaceDate',
    DAILY_RACE_COUNT: 'dailyRaceCount',
} as const;

export const localStorageService = {
    getItem: <T>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage for key ${key}:`, error);
            return null;
        }
    },

    setItem: <T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to localStorage for key ${key}:`, error);
        }
    },

    removeItem: (key: string): void => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage for key ${key}:`, error);
        }
    },

    clear: (): void => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    },
};

// Convenience methods for session management
export const sessionStorage = {
    getToken: (): string | null => {
        return localStorage.getItem(localStorageKeys.SESSION_TOKEN);
    },

    setToken: (token: string): void => {
        localStorage.setItem(localStorageKeys.SESSION_TOKEN, token);
    },

    removeToken: (): void => {
        localStorage.removeItem(localStorageKeys.SESSION_TOKEN);
    },

    getUser: <T>(): T | null => {
        return localStorageService.getItem<T>(localStorageKeys.USER);
    },

    setUser: <T>(user: T): void => {
        localStorageService.setItem(localStorageKeys.USER, user);
    },

    removeUser: (): void => {
        localStorageService.removeItem(localStorageKeys.USER);
    },

    clearSession: (): void => {
        localStorageService.removeItem(localStorageKeys.SESSION_TOKEN);
        localStorageService.removeItem(localStorageKeys.USER);
    },

    getBalance: (): number => {
        return localStorageService.getItem<number>(localStorageKeys.BALANCE) || 0;
    },

    setBalance: (balance: number): void => {
        localStorageService.setItem(localStorageKeys.BALANCE, balance);
    },

    getTransactions: <T>(): T[] => {
        return localStorageService.getItem<T[]>(localStorageKeys.TRANSACTIONS) || [];
    },

    setTransactions: <T>(transactions: T[]): void => {
        localStorageService.setItem(localStorageKeys.TRANSACTIONS, transactions);
    },

    addTransaction: <T>(transaction: T): void => {
        const transactions = sessionStorage.getTransactions<T>();
        transactions.push(transaction);
        sessionStorage.setTransactions(transactions);
    },

    getRacesHistory: <T>(): T[] => {
        return localStorageService.getItem<T[]>(localStorageKeys.RACES_HISTORY) || [];
    },

    setRacesHistory: <T>(races: T[]): void => {
        localStorageService.setItem(localStorageKeys.RACES_HISTORY, races);
    },

    addRace: <T>(race: T): void => {
        const races = sessionStorage.getRacesHistory<T>();
        races.push(race);
        sessionStorage.setRacesHistory(races);
    },

    getLastRaceDate: (): string | null => {
        return localStorageService.getItem<string>(localStorageKeys.LAST_RACE_DATE);
    },

    setLastRaceDate: (date: string): void => {
        localStorageService.setItem(localStorageKeys.LAST_RACE_DATE, date);
    },

    getDailyRaceCount: (): number => {
        return localStorageService.getItem<number>(localStorageKeys.DAILY_RACE_COUNT) || 0;
    },

    setDailyRaceCount: (count: number): void => {
        localStorageService.setItem(localStorageKeys.DAILY_RACE_COUNT, count);
    },

    incrementDailyRaceCount: (): number => {
        const today = new Date().toDateString();
        const lastRaceDate = sessionStorage.getLastRaceDate();

        if (lastRaceDate !== today) {
            sessionStorage.setLastRaceDate(today);
            sessionStorage.setDailyRaceCount(1);
            return 1;
        }

        const currentCount = sessionStorage.getDailyRaceCount();
        sessionStorage.setDailyRaceCount(currentCount + 1);
        return currentCount + 1;
    },

    getTodayRaceCount: (): number => {
        const today = new Date().toDateString();
        const lastRaceDate = sessionStorage.getLastRaceDate();

        if (lastRaceDate !== today) {
            return 0;
        }

        return sessionStorage.getDailyRaceCount();
    },

    resetDailyRaceCount: (): void => {
        sessionStorage.setLastRaceDate('');
        sessionStorage.setDailyRaceCount(0);
    },
};
