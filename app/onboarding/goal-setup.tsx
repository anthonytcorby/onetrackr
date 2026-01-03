import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function GoalSetupScreen() {
    const router = useRouter();
    const { setGoal, confirmGoal } = useApp();
    const [text, setText] = useState('');
    const [isCommitting, setIsCommitting] = useState(false);

    const handleCommit = async () => {
        if (text.trim().length === 0) return;

        Alert.alert(
            'Commit to this goal?',
            'This will be your only goal for the next 365 days. You cannot change it once committed.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Commit',
                    style: 'default',
                    onPress: async () => {
                        setIsCommitting(true);
                        await setGoal(text.trim());
                        await confirmGoal();
                        router.replace('/onboarding/reminder');
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.header}>
                        <ThemedText variant="h1" style={styles.title}>
                            Your one goal
                        </ThemedText>
                        <ThemedText variant="body" style={styles.subtitle}>
                            This is the only goal you'll focus on for the next year. Make it count.
                        </ThemedText>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="I will..."
                            placeholderTextColor={Colors.placeholder}
                            maxLength={240}
                            value={text}
                            onChangeText={setText}
                            autoFocus
                            selectionColor={Colors.accent}
                        />
                        <View style={styles.counterContainer}>
                            <ThemedText variant="caption" style={styles.counter}>
                                {text.length} / 240
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <PrimaryButton
                            title={isCommitting ? 'Committing...' : 'Commit to this goal'}
                            onPress={handleCommit}
                            disabled={text.trim().length === 0 || isCommitting}
                        />
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    keyboardView: {
        flex: 1,
        paddingHorizontal: 40,
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    header: {
        marginTop: 20,
    },
    title: {
        marginBottom: 16,
    },
    subtitle: {
        opacity: 0.7,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        fontFamily: Typography.fonts.sans,
        fontSize: 18,
        color: Colors.text,
        minHeight: 120,
        textAlignVertical: 'top',
        backgroundColor: '#F8F7F2',
        borderRadius: 12,
        padding: 16,
    },
    counterContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    counter: {
        opacity: 0.5,
    },
    footer: {},
});
