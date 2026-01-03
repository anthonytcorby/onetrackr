import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function ReflectionScreen() {
    const router = useRouter();
    const { saveEntry } = useApp();
    const [note, setNote] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    const handleSave = async () => {
        setIsSaving(true);
        await saveEntry(today, note.trim() || '✓');
        router.replace('/home');
    };

    const handleSkip = async () => {
        setIsSaving(true);
        await saveEntry(today, '✓');
        router.replace('/home');
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
                            Today's reflection
                        </ThemedText>
                        <ThemedText variant="caption" style={styles.date}>
                            {formattedDate}
                        </ThemedText>
                    </View>

                    <View style={styles.inputContainer}>
                        <ThemedText variant="body" style={styles.prompt}>
                            How did you show up today? (optional)
                        </ThemedText>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="A few words about today..."
                            placeholderTextColor={Colors.placeholder}
                            maxLength={240}
                            value={note}
                            onChangeText={setNote}
                            selectionColor={Colors.accent}
                        />
                        <View style={styles.counterContainer}>
                            <ThemedText variant="caption" style={styles.counter}>
                                {note.length} / 240
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <PrimaryButton
                            title={isSaving ? 'Saving...' : 'Save & Complete'}
                            onPress={handleSave}
                            disabled={isSaving}
                        />
                        <View style={styles.skipContainer}>
                            <ThemedText
                                variant="ui"
                                style={styles.skipText}
                                onPress={handleSkip}
                            >
                                Skip note, mark complete
                            </ThemedText>
                        </View>
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
        alignItems: 'center',
        gap: 8,
    },
    title: {},
    date: {
        opacity: 0.6,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 16,
    },
    prompt: {
        opacity: 0.7,
        textAlign: 'center',
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
    },
    counter: {
        opacity: 0.5,
    },
    footer: {
        gap: 16,
    },
    skipContainer: {
        alignItems: 'center',
    },
    skipText: {
        opacity: 0.5,
        textDecorationLine: 'underline',
    },
});
