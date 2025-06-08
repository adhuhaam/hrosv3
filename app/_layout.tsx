import { ThemeProvider, useTheme } from '@/app/theme-context';
import { logout } from '@/app/utils/auth';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Slot, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import LottieView from 'lottie-react-native';
import React, { useCallback, useEffect, useState } from 'react';
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

// Prevent native splash from auto hiding
SplashScreen.preventAutoHideAsync();

// Loading screen while fonts load
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <LottieView
        source={require('@/assets/animations/server.json')}
        autoPlay
        loop
        style={styles.loadingAnimation}
      />
      <Text style={styles.loadingText}>Connecting to RCC server . . .</Text>
    </View>
  );
}

// Main App Content
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

  const [currentTime, setCurrentTime] = useState('');

  // time 
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();

        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Indian/Maldives',
          day: '2-digit',
          month: 'short',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });

        const parts = formatter.formatToParts(now);
        const get = (type: string) => parts.find(p => p.type === type)?.value || '';

        const date = `${get('day')} ${get('month')} ${get('year')}`;
        const time = `${get('hour')}:${get('minute')}:${get('second')}`;

        setCurrentTime(`${date}, ${time}`);
      } catch (e) {
        setCurrentTime('-- -- --');
      }
    };

    updateTime(); // initial call
    const interval = setInterval(updateTime, 1000); // every second
    return () => clearInterval(interval); // cleanup
  }, []);




  // logout
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
        <View style={styles.lottieBackground}>
          <LottieView
            source={require('@/assets/animations/wave.json')}
            autoPlay
            loop
            style={styles.lottieAnimation}
            resizeMode="cover"
          />
        </View>
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
              <TouchableOpacity onPress={router.back} style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color={isDark ? '#fff' : '#333'} />
              </TouchableOpacity>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}

            <View style={styles.centerClock}>
              <Text style={[styles.clockText, { color: isDark ? '#fff' : '#333' }]}>{currentTime}</Text>
            </View>

            <View style={styles.rightButtons}>
              <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
                <Feather name={isDark ? 'sun' : 'moon'} size={24} color={isDark ? '#fff' : '#333'} />
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

// Layout wrapper
export default function Layout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
  });

  const hideSplashScreen = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

// Styles
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
  centerClock: {
    flex: 1,
    alignItems: 'center',
  },
  clockText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    padding: 6,
    borderRadius: 20,
  },
  logoutButton: {
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingAnimation: {
    width: 160,
    height: 160,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  lottieBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  lottieAnimation: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
