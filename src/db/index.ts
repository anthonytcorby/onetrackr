import * as SQLite from 'expo-sqlite';

const dbPromise = SQLite.openDatabaseAsync('oneyear.db');

export interface Resolution {
    id: number;
    text: string;
    created_at: string;
    locked: number; // 0 or 1
    start_date?: string | null; // ISO Date YYYY-MM-DD
    user_name?: string | null;
    reminder_time?: string | null; // 'morning', 'midday', 'evening', 'night' or null
}

export interface DayLog {
    date: string; // YYYY-MM-DD
    text: string;
    created_at: string;
}

export const initDB = async () => {
    const db = await dbPromise;
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS resolutions (
      id INTEGER PRIMARY KEY NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      locked INTEGER DEFAULT 0,
      start_date TEXT,
      user_name TEXT,
      reminder_time TEXT
    );
    CREATE TABLE IF NOT EXISTS logs (
      date TEXT PRIMARY KEY NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);
    // Add columns if they don't exist (migrations)
    try {
        await db.runAsync('ALTER TABLE resolutions ADD COLUMN user_name TEXT');
    } catch (e) { }
    try {
        await db.runAsync('ALTER TABLE resolutions ADD COLUMN reminder_time TEXT');
    } catch (e) { }
};

export const getResolution = async (): Promise<Resolution | null> => {
    const db = await dbPromise;
    const result = await db.getAllAsync<Resolution>('SELECT * FROM resolutions LIMIT 1');
    return result[0] || null;
};

export const setUserName = async (name: string) => {
    const db = await dbPromise;
    const existing = await getResolution();
    if (existing) {
        await db.runAsync('UPDATE resolutions SET user_name = ? WHERE id = ?', [name, existing.id]);
    } else {
        await db.runAsync(
            'INSERT INTO resolutions (id, text, created_at, locked, start_date, user_name) VALUES (1, \'\', ?, 0, NULL, ?)',
            [new Date().toISOString(), name]
        );
    }
};

export const setReminderTime = async (time: string | null) => {
    const db = await dbPromise;
    const existing = await getResolution();
    if (existing) {
        await db.runAsync('UPDATE resolutions SET reminder_time = ? WHERE id = ?', [time, existing.id]);
    } else {
        await db.runAsync(
            'INSERT INTO resolutions (id, text, created_at, locked, start_date, reminder_time) VALUES (1, \'\', ?, 0, NULL, ?)',
            [new Date().toISOString(), time]
        );
    }
};

export const setResolution = async (text: string) => {
    const db = await dbPromise;
    const existing = await getResolution();
    if (existing) {
        await db.runAsync('UPDATE resolutions SET text = ? WHERE id = ?', [text, existing.id]);
    } else {
        await db.runAsync(
            'INSERT INTO resolutions (id, text, created_at, locked, start_date) VALUES (1, ?, ?, 0, NULL)',
            [text, new Date().toISOString()]
        );
    }
};

export const lockResolution = async () => {
    const db = await dbPromise;
    const existing = await getResolution();
    const today = new Date().toISOString().split('T')[0];
    if (existing) {
        await db.runAsync('UPDATE resolutions SET locked = 1, start_date = ? WHERE id = ?', [today, existing.id]);
    } else {
        // Should rarely happen in flow, but handle it
        await db.runAsync(
            'INSERT INTO resolutions (id, text, created_at, locked, start_date) VALUES (1, \'\', ?, 1, ?)',
            [new Date().toISOString(), today]
        );
    }
};

export const getLog = async (date: string): Promise<DayLog | null> => {
    const db = await dbPromise;
    const result = await db.getAllAsync<DayLog>('SELECT * FROM logs WHERE date = ?', [date]);
    return result[0] || null;
};

export const getAllLogs = async (): Promise<DayLog[]> => {
    const db = await dbPromise;
    return await db.getAllAsync<DayLog>('SELECT * FROM logs ORDER BY date ASC');
}

export const saveLog = async (date: string, text: string) => {
    const db = await dbPromise;
    // Upsert logic
    await db.runAsync(
        `INSERT INTO logs (date, text, created_at) VALUES (?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET text = ?, created_at = ?`,
        [date, text, new Date().toISOString(), text, new Date().toISOString()]
    );
};

export const clearAllData = async () => {
    const db = await dbPromise;
    await db.execAsync('DELETE FROM resolutions; DELETE FROM logs;');
};
