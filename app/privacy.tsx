import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function PrivacyScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={Colors.text} />
                </TouchableOpacity>
                <ThemedText variant="h2">Privacy Policy</ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Summary */}
                <View style={styles.summary}>
                    <ThemedText variant="body" style={styles.summaryText}>
                        Your privacy is absolute. We collect nothing. We share nothing.
                        Everything stays on your device.
                    </ThemedText>
                </View>

                {/* Details */}
                <View style={styles.section}>
                    <ThemedText variant="h2" style={styles.heading}>
                        What we collect
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        Nothing. Zero. We have no servers, no analytics, no tracking.
                        Your goals and reflections never leave your device.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText variant="h2" style={styles.heading}>
                        What we share
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        Nothing. There are no social features, no cloud sync, and no
                        data sharing with third parties.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText variant="h2" style={styles.heading}>
                        Data storage
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        All data is stored locally on your device using secure local
                        storage. If you delete the app, your data is permanently removed.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText variant="h2" style={styles.heading}>
                        Your control
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        You can reset your goal and clear all data at any time from
                        Settings. This action is permanent and cannot be undone.
                    </ThemedText>
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
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    summary: {
        backgroundColor: '#F8F7F2',
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
    },
    summaryText: {
        lineHeight: 24,
    },
    section: {
        marginBottom: 24,
    },
    heading: {
        marginBottom: 8,
    },
    paragraph: {
        opacity: 0.8,
        lineHeight: 24,
    },
});
