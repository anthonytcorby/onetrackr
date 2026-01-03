import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function TermsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={Colors.text} />
                </TouchableOpacity>
                <ThemedText variant="h2">Terms of Service</ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Summary */}
                <View style={styles.summary}>
                    <ThemedText variant="body" style={styles.summaryText}>
                        In plain language: You use this app at your own discretion.
                        We don't collect your data. Your content stays on your device.
                    </ThemedText>
                </View>

                {/* Full Terms */}
                <View style={styles.terms}>
                    <ThemedText variant="h2" style={styles.heading}>
                        1. Acceptance
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        By using OneTrackr, you agree to these terms. If you do not agree,
                        please do not use the app.
                    </ThemedText>

                    <ThemedText variant="h2" style={styles.heading}>
                        2. Use of Service
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        OneTrackr is a personal goal tracking application. You are responsible
                        for maintaining the security of your device and any data stored locally.
                    </ThemedText>

                    <ThemedText variant="h2" style={styles.heading}>
                        3. Data Storage
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        All data is stored locally on your device. We do not have access to
                        your goals, reflections, or any personal information.
                    </ThemedText>

                    <ThemedText variant="h2" style={styles.heading}>
                        4. No Warranty
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        This app is provided "as is" without warranty of any kind. We are not
                        liable for any loss of data or damages arising from use of the app.
                    </ThemedText>

                    <ThemedText variant="h2" style={styles.heading}>
                        5. Changes
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        We reserve the right to modify these terms at any time. Continued use
                        of the app constitutes acceptance of any changes.
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
    terms: {
        gap: 8,
    },
    heading: {
        marginTop: 16,
        marginBottom: 4,
    },
    paragraph: {
        opacity: 0.8,
        lineHeight: 24,
    },
});
