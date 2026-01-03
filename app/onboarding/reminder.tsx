import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Feather } from '@expo/vector-icons';

export default function ReminderScreen() {
    const router = useRouter();
    const { setReminder, resolution } = useApp();
    const [selectedTime, setSelectedTime] = useState<string | null>(resolution?.reminder_time || null);

    const times = [
        { id: 'morning', label: 'Morning', time: '8:00 AM', icon: 'sunrise' },
        { id: 'midday', label: 'Midday', time: '12:00 PM', icon: 'sun' },
        { id: 'evening', label: 'Evening', time: '6:00 PM', icon: 'sunset' },
        { id: 'night', label: 'Night', time: '9:00 PM', icon: 'moon' },
    ];

    const handleContinue = async () => {
        if (selectedTime) {
            await setReminder(selectedTime);
        }
        router.replace('/home');
    };

    const handleSkip = async () => {
        await setReminder(null);
        router.replace('/home');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <ThemedText variant="h1" style={styles.title}>
                        Set a reminder?
                    </ThemedText>
                    <ThemedText variant="body" style={styles.subtitle}>
                        A daily nudge to anchor your commitment.
                    </ThemedText>
                </View>

                <View style={styles.optionsContainer}>
                    {times.map((time) => (
                        <TouchableOpacity
                            key={time.id}
                            style={[
                                styles.option,
                                selectedTime === time.id && styles.optionSelected,
                            ]}
                            onPress={() => setSelectedTime(time.id)}
                        >
                            <Feather
                                name={time.icon as any}
                                size={24}
                                color={selectedTime === time.id ? Colors.text : Colors.placeholder}
                            />
                            <View style={styles.optionText}>
                                <ThemedText variant="body" style={[
                                    styles.optionLabel,
                                    selectedTime === time.id && styles.optionLabelSelected,
                                ]}>
                                    {time.label}
                                </ThemedText>
                                <ThemedText variant="caption" style={styles.optionTime}>
                                    {time.time}
                                </ThemedText>
                            </View>
                            {selectedTime === time.id && (
                                <Feather name="check" size={20} color={Colors.accent} />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.footer}>
                    <PrimaryButton
                        title={selectedTime ? 'Set Reminder' : 'Continue'}
                        onPress={handleContinue}
                    />
                    {selectedTime && (
                        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                            <ThemedText variant="ui" style={styles.skipText}>
                                Skip for now
                            </ThemedText>
                        </TouchableOpacity>
                    )}
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
        gap: 12,
    },
    title: {},
    subtitle: {
        opacity: 0.7,
    },
    optionsContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: '#F8F7F2',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    optionSelected: {
        borderColor: Colors.accent,
        backgroundColor: '#FFFEF5',
    },
    optionText: {
        flex: 1,
    },
    optionLabel: {
        opacity: 0.7,
    },
    optionLabelSelected: {
        opacity: 1,
    },
    optionTime: {
        opacity: 0.5,
    },
    footer: {
        gap: 16,
    },
    skipButton: {
        alignItems: 'center',
        padding: 8,
    },
    skipText: {
        opacity: 0.5,
        textDecorationLine: 'underline',
    },
});
