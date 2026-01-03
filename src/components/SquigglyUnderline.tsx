import Svg, { Path } from 'react-native-svg';
import Colors from '@/constants/Colors';

interface SquigglyUnderlineProps {
    width?: number;
    color?: string;
}

export function SquigglyUnderline({
    width = 80,
    color = Colors.text
}: SquigglyUnderlineProps) {
    // Create a hand-drawn squiggly path
    const height = 8;

    return (
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <Path
                d={`M2 4 Q12 1, 20 5 Q30 9, 40 4 Q50 0, 60 5 Q70 9, ${width - 2} 4`}
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                fill="none"
            />
        </Svg>
    );
}
