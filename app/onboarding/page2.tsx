// onboarding/page2.tsx
// onboarding/page2.tsx
import { useTheme } from '@/app/theme-context';
import { onboardingStyles as styles } from '@/app/onboarding/onboardingStyles';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';


export default function Page2() {
    const router = useRouter();
     const { theme } = useTheme();
      const isDark = theme === 'dark';
      const bgColor = isDark ? '#121212' : '#fff';
      const textColor = isDark ? '#fff' : '#000';
      const subColor = isDark ? '#bbb' : '#555';
    

    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is Page 2 of onboarding</Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/page3')}>
                <Text style={styles.button}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}
