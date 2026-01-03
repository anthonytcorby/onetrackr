import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AppProvider } from '@/context/AppContext';
import {
    Inter_400Regular,
    Inter_700Bold,
} from '@expo-google-fonts/inter';
import { InstrumentSerif_400Regular, InstrumentSerif_400Regular_Italic } from '@expo-google-fonts/instrument-serif';
import { View } from 'react-native';
import Colors from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded] = useFonts({
        Inter_400Regular,
        Inter_700Bold,
        InstrumentSerif_400Regular,
        InstrumentSerif_400Regular_Italic,
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return (
        <AppProvider>
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                <StatusBar style="dark" backgroundColor={Colors.background} />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: Colors.background },
                        animation: 'fade',
                    }}
                >
                    <Stack.Screen name="index" />
                </Stack>
            </View>
        </AppProvider>
    );
}
