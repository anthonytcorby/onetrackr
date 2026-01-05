import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';

export default function JournalScreen() {
    const router = useRouter();
    const { logs } = useApp();

    const sortedLogs = useMemo(() => {
        return Array.from(logs.values())
            .filter(log => log.text) // Keep all logs that have text (including '✓')
            .sort((a, b) => a.date.localeCompare(b.date)); // Chronological order
    }, [logs]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={Colors.text} />
                </TouchableOpacity>
                <ThemedText variant="h1" style={styles.title}>
                    Journal
                </ThemedText>
                <View style={styles.headerRight} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {sortedLogs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <ThemedText variant="body" style={styles.emptyText}>
                            No entries yet.
                        </ThemedText>
                    </View>
                ) : (
                    sortedLogs.map((log) => {
                        const dateObj = new Date(log.date + 'T12:00:00');
                        const dayNum = dateObj.getDate();
                        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
                        const year = dateObj.getFullYear();
                        const fullDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

                        const isPaused = log.status === 'paused';
                        const bgColors = isPaused ? ['#E0E0E0', '#CDCDB4'] : ['#FFE566', '#FFD700'];

                        return (
                            <View key={log.date} style={styles.entryContainer}>
                                <View style={styles.dateColumn}>
                                    <ThemedText variant="h2" style={styles.dayNum}>{dayNum}</ThemedText>
                                    <ThemedText variant="caption" style={styles.month}>{month}</ThemedText>
                                    <ThemedText variant="caption" style={styles.year}>{year}</ThemedText>
                                </View>
                                <LinearGradient
                                    colors={bgColors as any}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.textColumn}
                                >
                                    <ThemedText variant="body" style={styles.entryText}>
                                        {log.text === '✓' ? 'Day complete' : log.text}
                                    </ThemedText>
                                    {log.sentiment && (
                                        <ThemedText variant="caption" style={{ opacity: 0.6, marginTop: 4 }}>
                                            Mood: {log.sentiment.charAt(0).toUpperCase() + log.sentiment.slice(1)}
                                        </ThemedText>
                                    )}
                                    <ThemedText variant="caption" style={styles.fullDate}>
                                        {fullDate}
                                    </ThemedText>
                                </LinearGradient>
                            </View>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
    },
    backButton: {
        padding: 4,
        width: 32,
    },
    title: {
        fontFamily: Typography.fonts.serif,
        textAlign: 'center',
    },
    headerRight: {
        width: 32,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 24,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        opacity: 0.5,
        fontStyle: 'italic',
    },
    entryContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    dateColumn: {
        alignItems: 'center',
        width: 50,
        paddingTop: 4,
    },
    dayNum: {
        fontSize: 24,
        lineHeight: 28,
    },
    month: {
        textTransform: 'uppercase',
        fontSize: 12,
        opacity: 0.7,
    },
    year: {
        fontSize: 10,
        opacity: 0.5,
    },
    textColumn: {
        flex: 1,
        borderRadius: 12,
        padding: 16,
        gap: 8,
    },
    entryText: {
        lineHeight: 24,
    },
    fullDate: {
        opacity: 0.4,
        fontSize: 12,
    },
});
