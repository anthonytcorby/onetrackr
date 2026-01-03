import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

export default function NameScreen() {
    const router = useRouter();
    const { setName, resolution } = useApp();
    const [name, setNameText] = useState(resolution?.user_name || '');

    const handleContinue = async () => {
        if (name.trim().length > 1) {
            await setName(name.trim());
            router.push('/onboarding/goal-setup');
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
                        <ThemedText variant="h1" style={styles.title}>
                            What's your name?
                        </ThemedText>
                        <ThemedText variant="body" style={styles.subtitle}>
                            We'll use this to personalize your experience.
                        </ThemedText>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Your first name"
                            placeholderTextColor={Colors.placeholder}
                            maxLength={50}
                            value={name}
                            onChangeText={setNameText}
                            autoFocus
                            autoCapitalize="words"
                            selectionColor={Colors.accent}
                        />
                    </View>

                    <View style={styles.footer}>
                        <PrimaryButton
                            title="Continue"
                            onPress={handleContinue}
                            disabled={name.trim().length < 2}
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
        marginTop: 40,
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
        textAlign: 'center',
        backgroundColor: '#F8F7F2',
        borderRadius: 12,
        padding: 16,
        minHeight: 60,
    },
    footer: {},
});
