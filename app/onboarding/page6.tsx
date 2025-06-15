// onboarding/page6.tsx
// final onboarding screen
import { onboardingStyles as styles } from "@/app/onboarding/onboardingStyles";
import { useTheme } from "@/app/theme-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { Text, TouchableOpacity, View } from "react-native";

export default function Page6() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const bgColor = isDark ? "#121212" : "#ffffff";
    const titleColor = isDark ? "#ffffff" : "#000000";
    const subTextColor = isDark ? "#bbbbbb" : "#555555";

    const finishOnboarding = async () => {
        await AsyncStorage.setItem("first_time", "done");
        router.replace("/login");
    };

    return (
        <View style={styles.container}>
            <LottieView
                source={require("@/assets/animations/phone.json")} // ✅ put your Lottie file here
                autoPlay
                loop
                style={styles.lottie}
            />

            <Text style={[styles.title, { color: titleColor }]}>
                Your Journey Begins
            </Text>
            <Text style={[styles.subtitle, { color: subTextColor }]}>
                Access your employee profile, track attendance, apply for leave, view

                your payslips, and stay informed — all in one app. If you&apos;re unsure of
                your login credentials, kindly reach out to your HR department for
                assistance.
            </Text>

            <TouchableOpacity onPress={finishOnboarding}>
                <Text style={styles.button}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}
