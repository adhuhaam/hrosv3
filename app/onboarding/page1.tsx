import { useTheme } from '@/app/theme-context';
import { onboardingStyles as styles } from '@/app/onboarding/onboardingStyles';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Page1() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgColor = isDark ? '#121212' : '#ffffff';
  const titleColor = isDark ? '#ffffff' : '#000000';
  const subTextColor = isDark ? '#bbbbbb' : '#555555';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <LottieView
        source={require('@/assets/animations/phone.json')} // ✅ put your Lottie file here
        autoPlay
        loop
        style={styles.lottie}
      />

      <Text style={[styles.title, { color: titleColor }]}>Welcome to HRoS</Text>
      <Text style={[styles.subtitle, { color: subTextColor }]}>
        Your self-service portal to manage attendance, leave, salary, and more.
      </Text>

      <TouchableOpacity onPress={() => router.push('/onboarding/page2')} style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}


