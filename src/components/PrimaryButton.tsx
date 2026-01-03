import { TouchableOpacity, StyleSheet, TouchableOpacityProps, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

interface PrimaryButtonProps extends TouchableOpacityProps {
    title: string;
    textStyle?: any; // Allow overriding text style
}

export function PrimaryButton({ title, style, textStyle, disabled, ...props }: PrimaryButtonProps) {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                disabled && styles.disabled,
                style
            ]}
            disabled={disabled}
            activeOpacity={0.8}
            {...props}
        >
            <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.accent,
        paddingVertical: 18,
        paddingHorizontal: 32,
        borderRadius: 999, // Pill shape
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontFamily: Typography.fonts.sansBold, // Inter Bold for button text
        color: Colors.text, // Dark text on yellow background for contrast
        fontSize: Typography.sizes.ui,
        letterSpacing: 0.5,
        textTransform: 'uppercase', // Often premium apps use uppercase buttons, or just sentence case. "Begin Day 1".
        // Spec example: "Begin Day 1".
    },
    disabled: {
        backgroundColor: Colors.border,
    },
    disabledText: {
        color: '#888',
    },
});
