import { ThemeProvider, useTheme } from '@/app/theme-context';
import { logout } from '@/app/utils/auth';
import { Feather, Ionicons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import { useFonts } from 'expo-font';
import { Slot, usePathname, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

function AppContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const isPublicPage = ['/', '/login', '/onboarding'].some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isDashboard = pathname === '/dashboard';
  const showNav = !isPublicPage;
  const showBackButton = !isPublicPage && !isDashboard;

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Logout Failed', 'Something went wrong during logout.');
    }
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: isDark ? '#000' : '#F8F9FC' }]}>
      {!isDark && (
        <LottieView
          source={require('@/assets/animations/wave.json')}
          autoPlay
          loop
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
      )}

      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          translucent
          backgroundColor="transparent"
        />

        {showNav && (
          <View style={styles.navWrapper}>
            {showBackButton ? (
              <TouchableOpacity
                onPress={() => {
                  try {
                    router.back();
                  } catch (e) {
                    console.warn('Back navigation failed:', e);
                  }
                }}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={26} color={isDark ? '#fff' : '#333'} />
              </TouchableOpacity>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}

            <View style={styles.rightButtons}>
              <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                <Feather name={isDark ? 'sun' : 'moon'}
                  size={24}
                  color={isDark ? '#fff' : '#333'}
                />

              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <Feather name="power" size={26} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Slot />
        <Toast />
      </SafeAreaView>
    </View>
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins-Bold.ttf'),
  });

  if (!fontsLoaded) return <AppLoading />;

  // Optional: Create a custom Text component to apply the font globally
  const AppText: React.FC<React.ComponentProps<typeof Text>> = (props) => (
    <Text {...props} style={[{ fontFamily: 'Poppins-Regular' }, props.style]} />
  );

  return (
    <ThemeProvider>
      {/* Optionally, provide AppText via context or replace usages of Text with AppText */}
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: 'transparent',
  },
  navWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  backButton: {
    padding: 4,
  },
  backButtonPlaceholder: {
    width: 30,
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  logoutButton: {
    marginLeft: 16,
  },
});
