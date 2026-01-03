import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';

export default function SettingsScreen() {
    const { resolution, resetApp, archiveGoal } = useApp();
    const router = useRouter();
    const [biometricEnabled, setBiometricEnabled] = useState(false);

    const handleResetGoal = () => {
        Alert.alert(
            'Reset your goal?',
            'This will clear your current goal and all progress. This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await resetApp();
                        router.replace('/');
                    },
                },
            ]
        );
    };

    const handleArchive = () => {
        Alert.alert(
            'Complete & Archive?',
            'This will save your current goal to history and let you start a new one.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Archive',
                    style: 'default',
                    onPress: async () => {
                        await archiveGoal();
                        router.replace('/');
                    },
                },
            ]
        );
    };

    const handleExportData = () => {
        Alert.alert(
            'Export Data',
            'Download your year in review?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'PDF', onPress: () => Alert.alert('Coming Soon', 'PDF export will be available in the next update.') },
                { text: 'CSV', onPress: () => Alert.alert('Coming Soon', 'CSV export will be available in the next update.') }
            ]
        );
    };

    const handlePauseInfo = () => {
        Alert.alert(
            'Life Happens',
            'Missing a day isn’t failure. You can pause your goal for a day to keep your momentum without breaking your streak. Continuous perfection is not the goal; persistence is.'
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={Colors.text} />
                </TouchableOpacity>
                <ThemedText variant="h2">Settings</ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Current Goal */}
                <View style={styles.section}>
                    <ThemedText variant="caption" style={styles.sectionLabel}>
                        YOUR GOAL
                    </ThemedText>
                    <View style={styles.card}>
                        <ThemedText variant="body" style={styles.goalText}>
                            "{resolution?.text}"
                        </ThemedText>
                        <ThemedText variant="caption" style={styles.startDate}>
                            Started {resolution?.start_date}
                        </ThemedText>
                    </View>

                    <TouchableOpacity style={styles.row} onPress={handleArchive}>
                        <ThemedText variant="body">Complete & Archive Goal</ThemedText>
                        <Feather name="archive" size={20} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Data */}
                <View style={styles.section}>
                    <ThemedText variant="caption" style={styles.sectionLabel}>
                        DATA & PRIVACY
                    </ThemedText>
                    <TouchableOpacity style={styles.row} onPress={handleExportData}>
                        <ThemedText variant="body">Export data (PDF/CSV)</ThemedText>
                        <Feather name="download" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/settings-reminder')}>
                        <ThemedText variant="body">Change reminder</ThemedText>
                        <Feather name="clock" size={20} color={Colors.text} />
                    </TouchableOpacity>

                    {/* Biometric Toggle */}
                    <View style={styles.row}>
                        <ThemedText variant="body">Biometric Lock</ThemedText>
                        <Switch
                            value={biometricEnabled}
                            onValueChange={setBiometricEnabled}
                            trackColor={{ false: '#E0E0E0', true: Colors.accent }}
                        />
                    </View>
                </View>

                {/* Philosophy */}
                <View style={styles.section}>
                    <ThemedText variant="caption" style={styles.sectionLabel}>
                        PHILOSOPHY
                    </ThemedText>
                    <TouchableOpacity style={styles.row} onPress={handlePauseInfo}>
                        <ThemedText variant="body">Pause Days & Flexibility</ThemedText>
                        <Feather name="info" size={20} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.row} onPress={handleResetGoal}>
                        <ThemedText variant="body" style={styles.dangerText}>
                            Reset everything
                        </ThemedText>
                        <Feather name="trash-2" size={20} color={Colors.accent} />
                    </TouchableOpacity>
                </View>

                {/* Legal */}
                <View style={styles.section}>
                    <ThemedText variant="caption" style={styles.sectionLabel}>
                        LEGAL
                    </ThemedText>
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/terms')}>
                        <ThemedText variant="body">Terms of Service</ThemedText>
                        <Feather name="chevron-right" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/privacy')}>
                        <ThemedText variant="body">Privacy Policy</ThemedText>
                        <Feather name="chevron-right" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/about')}>
                        <ThemedText variant="body">About</ThemedText>
                        <Feather name="chevron-right" size={20} color={Colors.text} />
                    </TouchableOpacity>
                </View>
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
        gap: 16,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
    },
    backButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionLabel: {
        opacity: 0.5,
        marginBottom: 12,
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#F8F7F2',
        borderRadius: 12,
        padding: 16,
        gap: 8,
        marginBottom: 16,
    },
    goalText: {
        fontStyle: 'italic',
    },
    startDate: {
        opacity: 0.5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    dangerText: {
        color: Colors.accent,
    },
});
