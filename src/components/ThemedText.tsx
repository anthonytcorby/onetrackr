import { Text, TextProps, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Typography } from '@/constants/Typography';

interface AdditionalProps {
    variant?: 'hero' | 'h1' | 'h2' | 'title' | 'body' | 'ui' | 'caption';
    serif?: boolean;
}

export type ThemedTextProps = TextProps & AdditionalProps;

export function ThemedText({ style, variant = 'body', serif, ...props }: ThemedTextProps) {
    let textStyle = {};

    // Font Family Logic
    // Instrument Serif for headlines/emphasis. Inter for UI/Body.
    // Defaults: Hero, H1, H2 use Serif by default. Others use Inter.
    const isSerif = serif !== undefined ? serif : ['hero', 'h1', 'h2'].includes(variant);

    const fontFamily = isSerif ? Typography.fonts.serif : Typography.fonts.sans;

    switch (variant) {
        case 'hero':
            textStyle = { fontSize: Typography.sizes.hero, lineHeight: Typography.sizes.hero * 1.1 };
            break;
        case 'h1':
            textStyle = { fontSize: Typography.sizes.h1, lineHeight: Typography.sizes.h1 * 1.15 };
            break;
        case 'h2':
            textStyle = { fontSize: Typography.sizes.h2, lineHeight: Typography.sizes.h2 * 1.2 };
            break;
        case 'title':
            textStyle = { fontSize: Typography.sizes.title, lineHeight: Typography.sizes.title * 1.3 };
            break;
        case 'body':
            textStyle = { fontSize: Typography.sizes.body, lineHeight: Typography.sizes.body * 1.5 };
            break;
        case 'ui':
            textStyle = { fontSize: Typography.sizes.ui, lineHeight: Typography.sizes.ui * 1.4 };
            break;
        case 'caption':
            textStyle = { fontSize: Typography.sizes.caption, lineHeight: Typography.sizes.caption * 1.4 };
            break;
    }

    return (
        <Text
            style={[
                { color: Colors.text, fontFamily },
                textStyle,
                style,
            ]}
            {...props}
        />
    );
}
