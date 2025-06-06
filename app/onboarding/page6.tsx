// onboarding/page6.tsx
import { onboardingStyles as styles } from '@/app/onboarding/onboardingStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';



export default function Page6() {
    const router = useRouter();

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
