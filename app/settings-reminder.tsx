import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';

export default function ChangeReminderScreen() {
    const router = useRouter();
    const { setReminder, resolution } = useApp();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    useEffect(() => {
        if (resolution?.reminder_time) {
            setSelectedTime(resolution.reminder_time);
        }
    }, [resolution]);

    const times = [
        { id: 'morning', label: 'Morning', time: '8:00 AM', icon: 'sunrise' },
        { id: 'midday', label: 'Midday', time: '12:00 PM', icon: 'sun' },
        { id: 'evening', label: 'Evening', time: '6:00 PM', icon: 'sunset' },
        { id: 'night', label: 'Night', time: '9:00 PM', icon: 'moon' },
    ];

    const handleSave = async () => {
        await setReminder(selectedTime);
        router.back();
    };

    const handleClear = async () => {
        await setReminder(null);
        setSelectedTime(null);
        Alert.alert('Reminder cleared', 'You will no longer receive daily reminders.');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color={Colors.text} />
                </TouchableOpacity>
                <ThemedText variant="h2" style={styles.title}>
                    Daily Reminder
                </ThemedText>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.content}>
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
                        title="Save Changes"
                        onPress={handleSave}
                    />
                    <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                        <ThemedText variant="ui" style={styles.clearText}>
                            Disable reminder
                        </ThemedText>
                    </TouchableOpacity>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 24,
    },
    backButton: {
        width: 32,
        padding: 4,
    },
    title: {

    },
    headerRight: {
        width: 32,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
        justifyContent: 'space-between',
    },
    optionsContainer: {
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
        marginBottom: 20,
    },
    clearButton: {
        alignItems: 'center',
        padding: 8,
    },
    clearText: {
        opacity: 0.5,
        textDecorationLine: 'underline',
        color: '#B00020',
    },
});
