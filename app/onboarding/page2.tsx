// onboarding/page2.tsx
import { onboardingStyles as styles } from '@/app/onboarding/onboardingStyles';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';


export default function Page2() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>This is Page 2 of onboarding</Text>
            <TouchableOpacity onPress={() => router.push('/onboarding/page3')}>
                <Text style={styles.button}>Next</Text>
            </TouchableOpacity>
        </View>
    );
}
