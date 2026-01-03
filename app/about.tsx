import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Feather } from '@expo/vector-icons';

export default function AboutScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={Colors.text} />
                </TouchableOpacity>
                <ThemedText variant="h2">About</ThemedText>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.logoSection}>
                    <Text style={styles.logo}>
                        <Text style={{ fontFamily: Typography.fonts.serifItalic }}>One</Text>
                        Trackr
                    </Text>
                </View>

                <View style={styles.section}>
                    <ThemedText variant="h2" style={styles.heading}>
                        Why one goal?
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        Most productivity apps fail because they encourage you to track
                        everything. More habits, more goals, more dashboards—more ways to
                        feel behind.
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        OneTrackr takes the opposite approach. One goal. One year.
                        Every day you show up, you mark it done. That's it.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText variant="h2" style={styles.heading}>
                        The philosophy
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        Constraint creates focus. By removing choice, you remove the mental
                        overhead of deciding what matters. You already decided—now you
                        just execute.
                    </ThemedText>
                </View>

                <View style={styles.section}>
                    <ThemedText variant="h2" style={styles.heading}>
                        No pressure
                    </ThemedText>
                    <ThemedText variant="body" style={styles.paragraph}>
                        Miss a day? Come back tomorrow. There are no streaks to break,
                        no notifications to ignore, no shame. Just a quiet grid that
                        fills up over time.
                    </ThemedText>
                </View>

                <View style={styles.footer}>
                    <ThemedText variant="caption" style={styles.footerText}>
                        Version 1.0.0
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
    logoSection: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    logo: {
        fontFamily: Typography.fonts.serif,
        fontSize: 36,
        color: Colors.text,
    },
    section: {
        marginBottom: 32,
    },
    heading: {
        marginBottom: 12,
    },
    paragraph: {
        opacity: 0.8,
        lineHeight: 24,
        marginBottom: 12,
    },
    footer: {
        alignItems: 'center',
        marginTop: 40,
    },
    footerText: {
        opacity: 0.4,
    },
});
