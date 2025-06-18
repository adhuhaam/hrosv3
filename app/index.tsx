import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '@/app/user-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [showButton, setShowButton] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isFirstTime = await AsyncStorage.getItem('first_time');

        if (!isFirstTime) {
          router.replace('/onboarding/page1');
        } else if (user) {
          router.replace('/dashboard');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.warn('Startup routing error:', error);
        setShowButton(true); // Allow manual override
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user]);

  const handleFallbackLogin = () => {
    try {
      router.push('/login');
    } catch (e) {
      Alert.alert('Navigation Error', 'Unable to go to login screen.');
    }
  };

  return (
    <View style={styles.container}>


      <Text style={styles.title}>Welcome to HRoS</Text>
      <Text style={styles.subtitle}>The Employee Self-Service Portal</Text>

      {loading && <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />}

      {showButton && (
        <TouchableOpacity onPress={handleFallbackLogin} style={styles.button} activeOpacity={0.85}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  animation: {
    width: 240,
    height: 240,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 2,
    shadowColor: Platform.OS === 'ios' ? '#aaa' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
});
