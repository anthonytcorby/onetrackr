import * as SQLite from 'expo-sqlite';
import { getLocalDateString } from '@/utils/dates';

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
    const today = getLocalDateString();
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
        // Include logs with matching resolution_id OR NULL resolution_id (for backward compatibility)
        return await db.getAllAsync<DayLog>('SELECT * FROM logs WHERE resolution_id = ? OR resolution_id IS NULL ORDER BY date ASC', [resolutionId]);
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

// Sample reflection texts for variety
const SAMPLE_REFLECTIONS = [
    "Stayed on track today. Felt focused and motivated.",
    "Challenging day, but pushed through anyway.",
    "Made good progress. Small wins add up.",
    "Struggled a bit but didn't give up.",
    "Great momentum today! Feeling confident.",
    "Had to adapt my approach but still showed up.",
    "Easier than expected. Building good habits.",
    "Almost skipped today but remembered why I started.",
    "Solid effort. Consistency is key.",
    "Overcame a tough moment. Proud of myself.",
    "Kept it simple and got it done.",
    "Found a new strategy that worked well.",
    "Energy was low but discipline was high.",
    "Celebrated a small milestone today.",
    "Learned something new about my process.",
];

const SENTIMENTS: Array<'neutral' | 'good' | 'great' | null> = ['neutral', 'good', 'great', null];

/**
 * Seeds the database with fake test data.
 * Backdates the start_date by 353 days so today appears as day 354.
 * Creates logs for all 354 days including today.
 */
export const seedTestData = async (): Promise<{ success: boolean; message: string }> => {
    const db = await dbPromise;
    const resolution = await getResolution();

    if (!resolution) {
        return { success: false, message: "No active resolution found. Please set up a goal first." };
    }

    // Calculate new start date: 353 days before today so today is day 354
    const today = new Date();
    const newStartDate = new Date(today.getTime() - 353 * 24 * 60 * 60 * 1000);
    const newStartDateStr = getLocalDateString(newStartDate);

    // Update the resolution's start_date
    await db.runAsync('UPDATE resolutions SET start_date = ? WHERE id = ?', [newStartDateStr, resolution.id]);

    // Clear existing logs for this resolution
    await db.runAsync('DELETE FROM logs WHERE resolution_id = ?', [resolution.id]);

    let seededCount = 0;
    const seenDates = new Set<string>();
    const todayStr = getLocalDateString(today);

    // Create logs for days 1 through 354 (including today)
    for (let i = 0; i < 354; i++) {
        const logDate = new Date(newStartDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateStr = getLocalDateString(logDate);

        // Skip duplicate dates (DST edge case)
        if (seenDates.has(dateStr)) continue;
        seenDates.add(dateStr);

        // Don't create logs for future dates
        if (dateStr > todayStr) break;

        // Randomize content
        const text = SAMPLE_REFLECTIONS[Math.floor(Math.random() * SAMPLE_REFLECTIONS.length)];
        const sentiment = SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)];
        const isPaused = Math.random() < 0.05; // 5% chance of paused day
        const status = isPaused ? 'paused' : 'completed';
        const displayText = isPaused ? 'Life happened.' : text;

        await db.runAsync(
            `INSERT INTO logs (date, text, created_at, status, sentiment, resolution_id) VALUES (?, ?, ?, ?, ?, ?)`,
            [dateStr, displayText, new Date().toISOString(), status, sentiment, resolution.id]
        );
        seededCount++;
    }

    return { success: true, message: `Backdated start to ${newStartDateStr}. Seeded ${seededCount} days. Today is now Day 354!` };
};
