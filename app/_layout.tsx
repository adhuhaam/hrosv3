import { ThemeProvider, useTheme } from '@/app/theme-context';
import { logout } from '@/app/utils/auth';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Slot, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Toast from 'react-native-toast-message';
import '../i18n';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const isPublicPage = ['/', '/login', '/onboarding'].some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isDashboard = pathname === '/dashboard';
  const showNav = !isPublicPage;
  const showBackButton = !isPublicPage && !isDashboard;

  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<View>(null);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(t('common.error'), t('auth.logoutFailed'));
    }
  };

  return (
    //<TouchableWithoutFeedback onPress={() => setMenuOpen(false)}>
    <View style={[styles.wrapper, { backgroundColor: isDark ? '#000' : '#F8F9FC' }]}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

        {showNav && (
          <View style={styles.navWrapper}>
            {showBackButton ? (
              <TouchableOpacity onPress={router.back} style={styles.backButton}>
                <Ionicons name="arrow-back" size={26} color={isDark ? '#fff' : '#333'} />
              </TouchableOpacity>
            ) : (
              <View style={styles.backButtonPlaceholder} />
            )}

            <View style={styles.rightButtons}>
              <Pressable onPress={() => setMenuOpen(!menuOpen)} hitSlop={10}>
                <Feather name="more-vertical" size={26} color={isDark ? '#fff' : '#333'} />
              </Pressable>

              {menuOpen && (
                <View ref={dropdownRef} style={[styles.dropdownMenu, { backgroundColor: isDark ? '#222' : '#fff' }]}>
                  <TouchableOpacity
                    onPress={() => {
                      setMenuOpen(false);
                      router.push('/settings');
                    }}
                    style={styles.menuButton}
                  >
                    <Feather name="settings" size={18} color={isDark ? '#eee' : '#333'} />
                    <Text style={[styles.menuText, { color: isDark ? '#eee' : '#333' }]}>Settings</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleLogout} style={styles.menuButton}>
                    <Feather name="power" size={18} color="#FF3B30" />
                    <Text style={[styles.menuText, { color: '#FF3B30' }]}>{t('auth.logout')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}

        <Slot />
        <Toast />
      </SafeAreaView>
    </View>
    //</TouchableWithoutFeedback>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Connecting to RCC server . . .</Text>
    </View>
  );
}

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('@/assets/fonts/Poppins-Regular.ttf'),
  });

  const hideSplashScreen = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => { hideSplashScreen(); }, [hideSplashScreen]);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, paddingTop: 40 },
  navWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  backButton: { padding: 4 },
  backButtonPlaceholder: { width: 30 },
  rightButtons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    position: 'relative',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 36,
    right: 0,
    borderRadius: 10,
    padding: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    zIndex: 999,
    width: 180,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 20,
  },
});
