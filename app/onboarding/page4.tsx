// onboarding/page2.tsx
import { onboardingStyles as styles } from '@/app/onboarding/onboardingStyles';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';



export default function Page4() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is Page 4 of onboarding</Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/page5')}>
                <Text style={styles.button}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}
