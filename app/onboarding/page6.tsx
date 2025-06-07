// onboarding/page6.tsx
// onboarding/page2.tsx
import { useTheme } from '@/app/theme-context';
import { onboardingStyles as styles } from '@/app/onboarding/onboardingStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';



export default function Page6() {
    const router = useRouter();
     const { theme } = useTheme();
      const isDark = theme === 'dark';
      const bgColor = isDark ? '#121212' : '#fff';
      const textColor = isDark ? '#fff' : '#000';
      const subColor = isDark ? '#bbb' : '#555';
    

    const finishOnboarding = async () => {
        await AsyncStorage.setItem('first_time', 'done');
        router.replace('/login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>You're ready to get started!</Text>
            <TouchableOpacity onPress={finishOnboarding}>
                <Text style={styles.button}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}
