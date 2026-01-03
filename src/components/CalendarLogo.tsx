import { View, StyleSheet, Animated, Easing } from 'react-native';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

export function CalendarLogo() {
    // 3x3 grid
    const squares = Array(9).fill(0);
    const ticks = 5; // First 5 have ticks

    // Create animated values for each tick
    const tickAnims = useRef(
        Array(ticks).fill(0).map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
        // Stagger the tick animations
        const animations = tickAnims.map((anim) =>
            Animated.timing(anim, {
                toValue: 1,
                duration: 500,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            })
        );

        // Start after a delay to let the logo appear first
        const timeout = setTimeout(() => {
            Animated.stagger(300, animations).start();
        }, 800);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <View style={styles.container}>
            {squares.map((_, i) => (
                <View key={i} style={styles.square}>
                    {i < ticks && (
                        <Animated.View
                            style={{
                                opacity: tickAnims[i],
                                transform: [{
                                    scale: tickAnims[i].interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.5, 1],
                                    })
                                }]
                            }}
                        >
                            <Feather name="check" size={20} color={Colors.accent} />
                        </Animated.View>
                    )}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 112,
        height: 112,
        gap: 8,
    },
    square: {
        width: 32,
        height: 32,
        backgroundColor: Colors.text,
        borderRadius: 2,
        opacity: 0.9,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
