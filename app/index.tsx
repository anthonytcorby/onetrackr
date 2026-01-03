import { View, StyleSheet, Text, Animated, Easing } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/context/AppContext';
import { ThemedText } from '@/components/ThemedText';
import { PrimaryButton } from '@/components/PrimaryButton';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';
import { CalendarLogo } from '@/components/CalendarLogo';
import { SquigglyUnderline } from '@/components/SquigglyUnderline';
import { useEffect, useRef } from 'react';

export default function WelcomeScreen() {
    const { resolution, isLoading } = useApp();
    const router = useRouter();

    // Animation Values
    const fade1 = useRef(new Animated.Value(0)).current;
    const move1 = useRef(new Animated.Value(20)).current;

    const fade2 = useRef(new Animated.Value(0)).current;
    const move2 = useRef(new Animated.Value(20)).current;

    const fade3 = useRef(new Animated.Value(0)).current;
    const move3 = useRef(new Animated.Value(20)).current;

    const fade4 = useRef(new Animated.Value(0)).current;
    const move4 = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (!isLoading) {
            const createAnim = (fade: Animated.Value, move: Animated.Value) =>
                Animated.parallel([
                    Animated.timing(fade, {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.spring(move, {
                        toValue: 0,
                        friction: 8,
                        tension: 40,
                        useNativeDriver: true,
                    })
                ]);

            Animated.stagger(200, [
                createAnim(fade1, move1),
                createAnim(fade2, move2),
                createAnim(fade3, move3),
                createAnim(fade4, move4),
            ]).start();
        }
    }, [isLoading]);

    if (isLoading) {
        return <View style={styles.container} />;
    }

    // if (resolution?.locked) {
    //     return <Redirect href="/home" />;
    // }

    return (
        <LinearGradient
            colors={['#FFE566', '#FFD700']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <View style={styles.mainContent}>
                        <Animated.View
                            style={[
                                styles.headerSection,
                                { opacity: fade1, transform: [{ translateY: move1 }] }
                            ]}
                        >
                            <Text style={styles.title}>
                                <Text style={{ fontFamily: Typography.fonts.serifItalic }}>One</Text>
                                Trackr
                            </Text>
                        </Animated.View>

                        <View style={styles.visualSection}>
                            <Animated.View
                                style={{ opacity: fade2, transform: [{ translateY: move2 }] }}
                            >
                                <CalendarLogo />
                            </Animated.View>
                            <Animated.View
                                style={[
                                    styles.subtitleContainer,
                                    { opacity: fade3, transform: [{ translateY: move3 }] }
                                ]}
                            >
                                <ThemedText variant="h2" style={styles.subtitle}>
                                    One resolution.{'\n'}Every day.{'\n'}For one year.
                                </ThemedText>
                                <View style={styles.taglineContainer}>
                                    <Text style={styles.tagline}>
                                        <Text style={{ fontFamily: Typography.fonts.serif }}>Make it </Text>
                                        <Text style={{ fontFamily: Typography.fonts.serifItalic }}>happen</Text>
                                    </Text>
                                    <View style={{ marginLeft: 40 }}>
                                        <SquigglyUnderline width={70} />
                                    </View>
                                </View>
                            </Animated.View>
                        </View>
                    </View>

                    <Animated.View
                        style={[
                            styles.actionSection,
                            { opacity: fade4, transform: [{ translateY: move4 }] }
                        ]}
                    >
                        <PrimaryButton
                            title={resolution?.locked ? "Continue" : "Begin Day 1"}
                            onPress={() => resolution?.locked ? router.replace('/home') : router.push('/onboarding/name')}
                            style={styles.pillButton}
                            textStyle={{ color: Colors.yellowText }}
                        />
                    </Animated.View>
                </View>
            </SafeAreaView>
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 40,
        paddingTop: 40,
        paddingBottom: 32,
        justifyContent: 'space-between', // Push button to bottom
        alignItems: 'center',
    },
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40, // 5 * 8px
    },
    headerSection: {
        alignItems: 'center',
    },
    visualSection: {
        alignItems: 'center',
        gap: 24, // 3 * 8px - tighter
    },
    subtitleContainer: {
        alignItems: 'center',
    },
    actionSection: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontFamily: Typography.fonts.serif,
        fontSize: 56,
        color: Colors.text,
        textAlign: 'center',
        lineHeight: 64,
    },
    subtitle: {
        opacity: 0.8,
        textAlign: 'center',
        lineHeight: 28,
    },
    taglineContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    tagline: {
        fontSize: 24,
        color: Colors.text,
        textAlign: 'center',
    },
    pillButton: {
        borderRadius: 999,
        backgroundColor: Colors.text,
        height: 60,
    },
});
