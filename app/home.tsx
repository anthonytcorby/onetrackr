import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import React, { useMemo, useRef, useEffect } from 'react';
import { Feather } from '@expo/vector-icons';

import { getGreeting } from '@/utils/greetings';

// Grid constants
const DAYS = 365;
const COLS = 15;
const BOX_SIZE = 14;
const GAP = 3;

export default function HomeScreen() {
    const { logs, resolution } = useApp();
    const router = useRouter();

    const greeting = useMemo(() => {
        return getGreeting(resolution?.user_name, logs, resolution?.start_date || undefined);
    }, [resolution?.user_name, logs, resolution?.start_date]);


    const today = new Date().toISOString().split('T')[0];
    const startDate = resolution?.start_date ? new Date(resolution.start_date + 'T12:00:00') : new Date();

    const days = useMemo(() => {
        const list = [];
        const seenDates = new Set<string>();

        for (let i = 0; i < DAYS; i++) {
            const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = d.toISOString().split('T')[0];

            // Skip if we've already seen this date (DST edge case)
            if (seenDates.has(dateStr)) continue;
            seenDates.add(dateStr);

            const isPast = dateStr < today;
            const isToday = dateStr === today;
            const isFuture = dateStr > today;
            const log = logs.get(dateStr);
            const hasLog = !!log;
            const isPaused = log?.status === 'paused';
            const isMissed = isPast && !hasLog;

            list.push({ index: i + 1, date: dateStr, isPast, isToday, isFuture, hasLog, isPaused, isMissed });
        }
        return list;
    }, [startDate, logs, today]);

    const todayIndex = days.findIndex(d => d.isToday) + 1;
    const todayData = days.find(d => d.isToday);
    const todayComplete = todayData?.hasLog || false;

    const handleMarkComplete = () => {
        router.push('/reflection');
    };

    const handleShare = async () => {
        const completedDays = days.filter(d => d.hasLog).length;
        try {
            const { Share } = require('react-native');
            await Share.share({
                message: `I've completed ${completedDays} of 365 days on my goal: "${resolution?.text}" 🎯`,
            });
        } catch (error) {
            // Ignore
        }
    };

    const handleDiary = () => {
        router.push('/journal');
    };

    const handleSettings = () => {
        router.push('/settings');
    };

    // Format today's date nicely
    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    const userName = resolution?.user_name || 'there';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft} />
                    <View style={styles.headerCenter}>
                        <ThemedText variant="body" style={styles.greeting}>
                            {greeting}
                        </ThemedText>
                        <ThemedText variant="caption" style={styles.dateText}>
                            {formattedDate}
                        </ThemedText>
                    </View>
                    <View style={styles.headerRight} />
                </View>

                {/* Goal Display */}
                <View style={styles.goalContainer}>
                    <ThemedText variant="body" style={styles.goalText}>
                        "{resolution?.text}"
                    </ThemedText>
                    <ThemedText variant="caption" style={styles.dayCounter}>
                        Day {todayIndex} of 365
                    </ThemedText>
                </View>

                {/* 365-Day Grid */}
                <View style={styles.gridContainer}>
                    <View style={styles.grid}>
                        {days.map((day) => (
                            <DayBox key={day.date} day={day} styles={styles} />
                        ))}
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    {!todayComplete ? (
                        <PrimaryButton
                            title="Mark today as done"
                            onPress={handleMarkComplete}
                        />
                    ) : (
                        <View style={styles.completedState}>
                            <ThemedText variant="body" style={styles.completedText}>
                                {todayData?.isPaused ? 'Paused for today' : '✓ Today complete'}
                            </ThemedText>
                        </View>
                    )}
                    <View style={styles.iconRow}>
                        <TouchableOpacity onPress={handleDiary} style={styles.iconButton}>
                            <Feather name="book-open" size={24} color={Colors.text} style={{ opacity: 0.4 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
                            <Feather name="share" size={24} color={Colors.text} style={{ opacity: 0.4 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSettings} style={styles.iconButton}>
                            <Feather name="settings" size={24} color={Colors.text} style={{ opacity: 0.4 }} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const DayBox = React.memo(({ day, styles }: { day: any, styles: any }) => {
    // Only animate if it's today and has a log
    // We can assume if it's rendered with hasLog=true, and it's today, we might want to animate.
    // However, on app reload, we don't want to animate.
    // Ideally we track previous state, but for "stutter in" effect on load (which looks cool), we can just animate mount.
    // A quick stutter check-in looks nice even on refresh for the active day.

    const shouldAnimate = day.isToday && day.hasLog && !day.isPaused;
    const scaleAnim = useRef(new Animated.Value(shouldAnimate ? 0 : 1)).current;

    useEffect(() => {
        if (shouldAnimate) {
            // Sequence: Small delay -> Spring Scale
            Animated.sequence([
                Animated.delay(300), // Slight pause for "drama" after screen load
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4, // Low friction = wobble/stutter
                    tension: 50,
                    useNativeDriver: true,
                })
            ]).start();
        }
    }, [shouldAnimate]);

    const baseStyle = [
        styles.dayBox,
        day.isMissed && styles.dayMissed,
        day.isToday && styles.dayToday,
        day.isFuture && styles.dayFuture,
    ];

    if (shouldAnimate) {
        return (
            <View style={baseStyle}>
                <Animated.View style={[
                    StyleSheet.absoluteFill,
                    styles.dayComplete, // This has the yellow bg
                    {
                        transform: [{ scale: scaleAnim }],
                        borderRadius: 1 // Match parent slightly
                    }
                ]} />
            </View>
        );
    }

    return (
        <View
            style={[
                styles.dayBox,
                (day.hasLog && !day.isPaused) && styles.dayComplete,
                day.isPaused && styles.dayPaused,
                day.isMissed && styles.dayMissed,
                day.isToday && styles.dayToday,
                day.isFuture && styles.dayFuture,
            ]}
        />
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        width: 32,
    },
    headerCenter: {
        alignItems: 'center',
        gap: 4,
    },
    headerRight: {
        width: 32,
        alignItems: 'flex-end',
    },
    title: {
        fontFamily: Typography.fonts.serif,
        fontSize: 32,
        color: Colors.text,
    },
    greeting: {
        fontFamily: Typography.fonts.serif,
        fontSize: 24,
        lineHeight: 32,
        paddingBottom: 4,
    },
    dateText: {
        opacity: 0.6,
    },
    goalContainer: {
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
    },
    goalText: {
        textAlign: 'center',
        fontStyle: 'italic',
        opacity: 0.8,
    },
    dayCounter: {
        opacity: 0.5,
    },
    gridContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: (BOX_SIZE + GAP) * COLS - GAP, // 19 columns
        gap: GAP,
        justifyContent: 'flex-start',
    },
    dayBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        backgroundColor: '#F0EFE9', // Empty - neutral off-white
        borderRadius: 2,
    },
    dayComplete: {
        backgroundColor: Colors.accent, // Gold for completed
    },
    dayPaused: {
        backgroundColor: '#D3D3D3', // Muted, neutral
    },
    dayMissed: {
        backgroundColor: '#4A4A4A', // Muted charcoal for missed
    },
    dayToday: {
        borderColor: Colors.text,
        borderWidth: 2,
    },
    dayFuture: {
        opacity: 0.4,
    },
    actions: {
        alignItems: 'center',
        gap: 16,
    },
    completedState: {
        paddingVertical: 20,
    },
    completedText: {
        color: Colors.text,
        opacity: 0.7,
    },
    secondaryAction: {
        padding: 8,
    },
    secondaryText: {
        opacity: 0.6,
        textDecorationLine: 'underline',
    },
    iconRow: {
        flexDirection: 'row',
        gap: 32,
    },
    iconButton: {
        padding: 8,
    },
});
