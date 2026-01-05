import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    initDB,
    getResolution,
    setResolution as dbSetResolution,
    lockResolution as dbLockResolution,
    setUserName as dbSetUserName,
    setReminderTime as dbSetReminderTime,
    getLog,
    saveLog as dbSaveLog,
    getAllLogs,
    clearAllData,
    archiveResolution as dbArchiveResolution,
    Resolution,
    DayLog
} from '@/db';

interface AppContextType {
    resolution: Resolution | null;
    logs: Map<string, DayLog>; // Date -> Log
    isLoading: boolean;
    setName: (name: string) => Promise<void>;
    setReminder: (time: string | null) => Promise<void>;
    setGoal: (text: string) => Promise<void>;
    confirmGoal: () => Promise<void>;
    logDay: (date: string, text: string, status?: string, sentiment?: string | null) => Promise<void>;
    saveEntry: (date: string, text: string, status?: string, sentiment?: string | null) => Promise<void>;
    resetApp: () => Promise<void>;
    resetGoal: () => Promise<void>;
    archiveGoal: () => Promise<void>;
    refreshLogs: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [resolution, setResolution] = useState<Resolution | null>(null);
    const [logs, setLogs] = useState<Map<string, DayLog>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                await initDB();
                const res = await getResolution();
                setResolution(res);

                if (res) {
                    const allLogs = await getAllLogs(res.id);
                    const logsMap = new Map<string, DayLog>();
                    allLogs.forEach(l => logsMap.set(l.date, l));
                    setLogs(logsMap);
                } else {
                    setLogs(new Map());
                }
            } catch (e) {
                console.error("Failed to load data", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const setGoal = async (text: string) => {
        await dbSetResolution(text);
        const res = await getResolution();
        setResolution(res);
    };

    const setName = async (name: string) => {
        await dbSetUserName(name);
        const res = await getResolution();
        setResolution(res);
    };

    const setReminder = async (time: string | null) => {
        await dbSetReminderTime(time);
        const res = await getResolution();
        setResolution(res);
    };

    const confirmGoal = async () => {
        await dbLockResolution();
        const res = await getResolution();
        setResolution(res);
    };

    const logDay = async (date: string, text: string, status: string = 'completed', sentiment: string | null = null) => {
        if (!resolution) return; // Should not happen if logging
        await dbSaveLog(date, text, resolution.id, status, sentiment);

        setLogs(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(date);
            newMap.set(date, {
                date,
                text,
                created_at: existing ? existing.created_at : new Date().toISOString(),
                status: status as any,
                sentiment: sentiment as any,
                resolution_id: resolution.id
            });
            return newMap;
        });
    };

    const archiveGoal = async () => {
        await dbArchiveResolution();
        setResolution(null);
        setLogs(new Map());
    };

    const resetApp = async () => {
        await clearAllData();
        setResolution(null);
        setLogs(new Map());
    };

    const refreshLogs = async () => {
        const res = await getResolution();
        setResolution(res);
        if (res) {
            const allLogs = await getAllLogs(res.id);
            const logsMap = new Map<string, DayLog>();
            allLogs.forEach(l => logsMap.set(l.date, l));
            setLogs(logsMap);
        } else {
            setLogs(new Map());
        }
    };

    return (
        <AppContext.Provider value={{
            resolution,
            logs,
            isLoading,
            setName,
            setReminder,
            setGoal,
            confirmGoal,
            logDay,
            saveEntry: logDay,
            resetApp,
            resetGoal: resetApp,
            archiveGoal,
            refreshLogs
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within AppProvider");
    return context;
};
