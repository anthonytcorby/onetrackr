import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function SettingsScreen() {
    const { resolution, resetApp } = useApp();
    const router = useRouter();

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

    const handleExportData = () => {
        Alert.alert('Export Data', 'Feature coming soon.');
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
                </View>

                {/* Actions */}
                <View style={styles.section}>
                    <ThemedText variant="caption" style={styles.sectionLabel}>
                        DATA
                    </ThemedText>
                    <TouchableOpacity style={styles.row} onPress={handleExportData}>
                        <ThemedText variant="body">Export data</ThemedText>
                        <Feather name="chevron-right" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={() => router.push('/settings-reminder')}>
                        <ThemedText variant="body">Change reminder</ThemedText>
                        <Feather name="chevron-right" size={20} color={Colors.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.row} onPress={handleResetGoal}>
                        <ThemedText variant="body" style={styles.dangerText}>
                            Reset goal
                        </ThemedText>
                        <Feather name="chevron-right" size={20} color={Colors.text} />
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
