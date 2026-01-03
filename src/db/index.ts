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
    archived_at?: string | null; // NULL if active
}

export interface DayLog {
    date: string; // YYYY-MM-DD
    text: string;
    created_at: string;
    status?: 'completed' | 'paused' | null;
    sentiment?: 'neutral' | 'good' | 'great' | null;
    resolution_id?: number;
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
      reminder_time TEXT,
      archived_at TEXT
    );
    CREATE TABLE IF NOT EXISTS logs (
      date TEXT PRIMARY KEY NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT,
      sentiment TEXT
    );
  `);
    // Add columns if they don't exist (migrations)
    try {
        await db.runAsync('ALTER TABLE resolutions ADD COLUMN user_name TEXT');
    } catch (e) { }
    try {
        await db.runAsync('ALTER TABLE resolutions ADD COLUMN reminder_time TEXT');
    } catch (e) { }
    try {
        await db.runAsync('ALTER TABLE resolutions ADD COLUMN archived_at TEXT');
    } catch (e) { }
    try {
        await db.runAsync('ALTER TABLE logs ADD COLUMN status TEXT');
    } catch (e) { }
    try {
        await db.runAsync('ALTER TABLE logs ADD COLUMN sentiment TEXT');
    } catch (e) { }
    try {
        await db.runAsync('ALTER TABLE logs ADD COLUMN resolution_id INTEGER');
    } catch (e) { }
};

export const getResolution = async (): Promise<Resolution | null> => {
    const db = await dbPromise;
    const result = await db.getAllAsync<Resolution>('SELECT * FROM resolutions WHERE archived_at IS NULL ORDER BY id DESC LIMIT 1');
    return result[0] || null;
};

export const archiveResolution = async () => {
    const db = await dbPromise;
    const existing = await getResolution();
    if (existing) {
        await db.runAsync('UPDATE resolutions SET archived_at = ? WHERE id = ?', [new Date().toISOString(), existing.id]);
    }
};

export const setUserName = async (name: string) => {
    const db = await dbPromise;
    const existing = await getResolution();
    if (existing) {
        await db.runAsync('UPDATE resolutions SET user_name = ? WHERE id = ?', [name, existing.id]);
    } else {
        await db.runAsync(
            'INSERT INTO resolutions (text, created_at, locked, start_date, user_name) VALUES (\'\', ?, 0, NULL, ?)',
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
            'INSERT INTO resolutions (text, created_at, locked, start_date, reminder_time) VALUES (\'\', ?, 0, NULL, ?)',
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
            'INSERT INTO resolutions (text, created_at, locked, start_date) VALUES (?, ?, 0, NULL)',
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
            'INSERT INTO resolutions (text, created_at, locked, start_date) VALUES (\'\', ?, 1, ?)',
            [new Date().toISOString(), today]
        );
    }
};

export const getLog = async (date: string): Promise<DayLog | null> => {
    const db = await dbPromise;
    const result = await db.getAllAsync<DayLog>('SELECT * FROM logs WHERE date = ?', [date]);
    return result[0] || null;
};

export const getAllLogs = async (resolutionId?: number): Promise<DayLog[]> => {
    const db = await dbPromise;
    if (resolutionId) {
        return await db.getAllAsync<DayLog>('SELECT * FROM logs WHERE resolution_id = ? ORDER BY date ASC', [resolutionId]);
    }
    return await db.getAllAsync<DayLog>('SELECT * FROM logs ORDER BY date ASC');
}

export const saveLog = async (date: string, text: string, resolutionId: number, status: string = 'completed', sentiment: string | null = null) => {
    const db = await dbPromise;
    // Upsert logic
    await db.runAsync(
        `INSERT INTO logs (date, text, created_at, status, sentiment, resolution_id) VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(date) DO UPDATE SET text = ?, created_at = ?, status = ?, sentiment = ?, resolution_id = ?`,
        [date, text, new Date().toISOString(), status, sentiment, resolutionId, text, new Date().toISOString(), status, sentiment, resolutionId]
    );
};

export const clearAllData = async () => {
    const db = await dbPromise;
    await db.runAsync('DELETE FROM resolutions');
    await db.runAsync('DELETE FROM logs');
};
