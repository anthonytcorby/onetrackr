import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { Feather } from '@expo/vector-icons';
import { getLocalDateString } from '@/utils/dates';

const PROMPTS = [
    "What was the hardest moment today?",
    "What challenged you today?",
    "What helped you stay on track?",
    "What nearly derailed you today?",
    "What did you notice about yourself today?",
];

export default function ReflectionScreen() {
    const router = useRouter();
    const { saveEntry } = useApp();
    const [note, setNote] = useState('');
    const [sentiment, setSentiment] = useState<'neutral' | 'good' | 'great' | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const prompt = useMemo(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)], []);

    const today = getLocalDateString();
    const formattedDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Default text if empty but user wants to save "Done"
        await saveEntry(today, note.trim() || '✓', 'completed', sentiment);
        router.replace('/home');
    };

    const handleSkip = async () => {
        setIsSaving(true);
        await saveEntry(today, '✓', 'completed', sentiment);
        router.replace('/home');
    };

    const handlePause = async () => {
        setIsSaving(true);
        await saveEntry(today, 'Life happened.', 'paused', sentiment);
        router.replace('/home');
    };

    const SentimentButton = ({ value, label, icon }: { value: 'neutral' | 'good' | 'great', label: string, icon: keyof typeof Feather.glyphMap }) => (
        <TouchableOpacity
            onPress={() => setSentiment(value === sentiment ? null : value)}
            style={[
                styles.sentimentBtn,
                sentiment === value && styles.sentimentBtnActive
            ]}
        >
            <Feather name={icon} size={16} color={sentiment === value ? Colors.background : Colors.text} style={{ opacity: sentiment === value ? 1 : 0.6 }} />
            <ThemedText variant="caption" style={[styles.sentimentLabel, sentiment === value && styles.sentimentLabelActive]}>
                {label}
            </ThemedText>
        </TouchableOpacity>
    );

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
                            {prompt}
                        </ThemedText>
                        <TextInput
                            style={styles.input}
                            multiline
                            placeholder="Type here..."
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

                    <View style={styles.sentimentContainer}>
                        <SentimentButton value="neutral" label="Neutral" icon="minus" />
                        <SentimentButton value="good" label="Good" icon="thumbs-up" />
                        <SentimentButton value="great" label="Great" icon="zap" />
                    </View>

                    <View style={styles.footer}>
                        <PrimaryButton
                            title={isSaving ? 'Saving...' : 'Save & Complete'}
                            onPress={handleSave}
                            disabled={isSaving}
                        />
                        <View style={styles.actionsRow}>
                            <ThemedText
                                variant="ui"
                                style={styles.secondaryText}
                                onPress={handleSkip}
                            >
                                Skip note
                            </ThemedText>
                            <ThemedText
                                variant="ui"
                                style={styles.secondaryText}
                                onPress={handlePause}
                            >
                                Pause / Life happened
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
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        gap: 8,
    },
    title: {
        textAlign: 'center',
    },
    date: {
        opacity: 0.6,
    },
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 16,
        maxHeight: 300,
    },
    prompt: {
        opacity: 0.7,
        textAlign: 'center',
        fontStyle: 'italic',
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
    sentimentContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginBottom: 20,
    },
    sentimentBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#F0EFE9',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    sentimentBtnActive: {
        backgroundColor: Colors.text,
        borderColor: Colors.text,
    },
    sentimentLabel: {
        fontSize: 12,
        opacity: 0.7,
    },
    sentimentLabelActive: {
        color: Colors.background,
        opacity: 1,
    },
    footer: {
        gap: 20,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    secondaryText: {
        opacity: 0.5,
        textDecorationLine: 'underline',
        fontSize: 12,
    },
});
