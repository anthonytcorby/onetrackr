import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useMemo } from 'react';

const DAYS = 365;
const BOX_SIZE = 8;
const GAP = 2;

export default function CompletionScreen() {
    const { logs, resolution, resetGoal } = useApp();
    const router = useRouter();

    const startDate = resolution?.start_date ? new Date(resolution.start_date + 'T12:00:00') : new Date();

    const days = useMemo(() => {
        const list = [];
        const seenDates = new Set<string>();

        for (let i = 0; i < DAYS; i++) {
            const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
            const dateStr = d.toISOString().split('T')[0];

            if (seenDates.has(dateStr)) continue;
            seenDates.add(dateStr);

            const hasLog = logs.has(dateStr);
            list.push({ date: dateStr, hasLog });
        }
        return list;
    }, [startDate, logs]);

    const completedDays = days.filter(d => d.hasLog).length;

    const handleArchive = () => {
        Alert.alert(
            'Archive this goal?',
            'Your progress will be saved and you can start a new goal.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Archive',
                    onPress: async () => {
                        await resetGoal();
                        router.replace('/');
                    },
                },
            ]
        );
    };

    const handleNewGoal = () => {
        Alert.alert(
            'Start a new goal?',
            'This will archive your current goal and start fresh.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Start New',
                    onPress: async () => {
                        await resetGoal();
                        router.replace('/onboarding');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <ThemedText variant="h1" style={styles.title}>
                        Year complete.
                    </ThemedText>
                    <ThemedText variant="body" style={styles.subtitle}>
                        You showed up for {completedDays} of 365 days.
                    </ThemedText>
                </View>

                {/* Mini Grid */}
                <ScrollView
                    contentContainerStyle={styles.gridContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.grid}>
                        {days.map((day) => (
                            <View
                                key={day.date}
                                style={[
                                    styles.dayBox,
                                    day.hasLog && styles.dayComplete,
                                ]}
                            />
                        ))}
                    </View>
                </ScrollView>

                <View style={styles.goalDisplay}>
                    <ThemedText variant="body" style={styles.goalText}>
                        "{resolution?.text}"
                    </ThemedText>
                </View>

                <View style={styles.actions}>
                    <PrimaryButton
                        title="Start a new goal"
                        onPress={handleNewGoal}
                    />
                    <ThemedText
                        variant="ui"
                        style={styles.archiveText}
                        onPress={handleArchive}
                    >
                        Archive and close
                    </ThemedText>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: 40,
        paddingTop: 60,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        gap: 12,
    },
    title: {
        textAlign: 'center',
    },
    subtitle: {
        opacity: 0.7,
        textAlign: 'center',
    },
    gridContent: {
        alignItems: 'center',
        paddingVertical: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: (BOX_SIZE + GAP) * 25 - GAP,
        gap: GAP,
        justifyContent: 'flex-start',
    },
    dayBox: {
        width: BOX_SIZE,
        height: BOX_SIZE,
        backgroundColor: '#4A4A4A',
        borderRadius: 1,
    },
    dayComplete: {
        backgroundColor: Colors.accent,
    },
    goalDisplay: {
        alignItems: 'center',
    },
    goalText: {
        textAlign: 'center',
        fontStyle: 'italic',
        opacity: 0.6,
    },
    actions: {
        alignItems: 'center',
        gap: 16,
    },
    archiveText: {
        opacity: 0.5,
        textDecorationLine: 'underline',
    },
});
