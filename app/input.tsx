import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { getLocalDateString } from '@/utils/dates';

export default function InputScreen() {
    const router = useRouter();
    const { logDay, logs } = useApp();
    const today = getLocalDateString();
    const existingLog = logs.get(today);

    const [text, setText] = useState(existingLog?.text || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (text.trim().length > 0) {
            setIsSaving(true);
            await logDay(today, text.trim());
            setIsSaving(false);
            router.back();
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.header}>
                        <View style={styles.dateBadge}>
                            <ThemedText variant="caption" style={styles.dateText}>Today ({today})</ThemedText>
                        </View>
                        <ThemedText variant="h2" style={styles.title}>Log your day.</ThemedText>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="How did you keep your resolution today?"
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
                            title={isSaving ? "Saving..." : "Save Entry"}
                            onPress={handleSave}
                            disabled={text.trim().length === 0 || isSaving}
                        />
                        <View style={{ height: 16 }} />
                        <PrimaryButton
                            title="Cancel"
                            onPress={() => router.back()}
                            style={{ backgroundColor: 'transparent' }}
                            textStyle={{ color: Colors.placeholder, fontSize: 14 }}
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
        paddingHorizontal: 24,
        justifyContent: 'space-between',
        paddingVertical: 20,
    },
    header: {
        marginTop: 20,
    },
    dateBadge: {
        backgroundColor: '#EDECE8',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 12,
    },
    dateText: {
        opacity: 0.6,
    },
    title: {
        marginBottom: 16,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        marginTop: 20,
    },
    input: {
        fontFamily: Typography.fonts.sans,
        fontSize: 20,
        color: Colors.text,
        minHeight: 200,
        textAlignVertical: 'top',
        lineHeight: 28,
    },
    counterContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    counter: {
        opacity: 0.5,
    },
    footer: {
        marginBottom: 20,
    }
});
