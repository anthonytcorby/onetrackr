import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { useState } from 'react';

export default function OnboardingScreen() {
    const router = useRouter();
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: 'One goal.',
            body: 'This app is built for focus.\n\nYou will set one goal—just one—and commit to it for 365 days.',
        },
        {
            title: 'Every day.',
            body: 'Show up daily. Mark your progress.\n\nNo streaks to break. No shame. Just continuity.',
        },
    ];

    const handleContinue = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            router.push('/onboarding/name');
        }
    };

    const currentStep = steps[step];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.progressContainer}>
                    {steps.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.progressDot,
                                i === step && styles.progressDotActive,
                                i < step && styles.progressDotComplete,
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.mainContent}>
                    <Text style={styles.title}>{currentStep.title}</Text>
                    <ThemedText variant="body" style={styles.body}>
                        {currentStep.body}
                    </ThemedText>
                </View>

                <View style={styles.footer}>
                    <PrimaryButton
                        title={step < steps.length - 1 ? 'Continue' : 'Get Started'}
                        onPress={handleContinue}
                    />
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
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.border,
    },
    progressDotActive: {
        backgroundColor: Colors.text,
        width: 24,
    },
    progressDotComplete: {
        backgroundColor: Colors.text,
    },
    mainContent: {
        flex: 1,
        justifyContent: 'center',
        gap: 24,
    },
    title: {
        fontFamily: Typography.fonts.serif,
        fontSize: 48,
        color: Colors.text,
        lineHeight: 56,
    },
    body: {
        opacity: 0.8,
        lineHeight: 26,
    },
    footer: {},
});
