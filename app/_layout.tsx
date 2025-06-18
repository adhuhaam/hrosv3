import { ThemeProvider, useTheme } from '@/app/theme-context';
import { UserProvider, useUser } from '@/app/user-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Slot, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useCallback, useEffect, useState } from 'react';
import { Menu, Provider as PaperProvider } from 'react-native-paper';
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
  const { logout } = useUser();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const isPublicPage = ['/', '/login', '/onboarding'].some((route) =>
    pathname === route || pathname.startsWith(`${route}/`)
  );
  const isDashboard = pathname === '/dashboard';
  const showNav = !isPublicPage;
  const showBackButton = !isPublicPage && !isDashboard;

  const [menuVisible, setMenuVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert(t('common.error'), t('auth.logoutFailed'));
    }
  };

  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Enable notifications to get chat alerts.');
      }

      await Notifications.setNotificationChannelAsync('chat-messages', {
        name: 'Chat Messages',
        importance: Notifications.AndroidImportance.MAX,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });


    };

    setupNotifications();
  }, []);

  return (
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
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Pressable onPress={() => setMenuVisible(true)} hitSlop={10}>
                    <Feather name="more-vertical" size={26} color={isDark ? '#fff' : '#333'} />
                  </Pressable>
                }
                contentStyle={{ backgroundColor: isDark ? '#222' : '#fff' }}
              >
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    router.push('/settings');
                  }}
                  leadingIcon="cog-outline"
                  title="Settings"
                  titleStyle={{ color: isDark ? '#eee' : '#333' }}
                />
                <Menu.Item
                  onPress={() => {
                    setMenuVisible(false);
                    handleLogout();
                  }}
                  leadingIcon="power"
                  title={t('auth.logout')}
                  titleStyle={{ color: '#FF3B30' }}
                />
              </Menu>
            </View>
          </View>
        )}

        <Slot />
        <Toast />
      </SafeAreaView>
    </View>
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

  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);

  if (!fontsLoaded) return <LoadingScreen />;

  return (
    <ThemeProvider>
      <UserProvider>
        <PaperProvider>
          <AppContent />
        </PaperProvider>
      </UserProvider>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginTop: 20,
  },
});
