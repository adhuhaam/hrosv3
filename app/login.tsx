import { login } from '@/api/api';
import { useTheme } from '@/app/theme-context'; // Moved out of /app
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const bgColor = isDark ? '#121212' : '#fff';
  const textColor = isDark ? '#fff' : '#000';
  const subColor = isDark ? '#bbb' : '#555';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Missing Fields', 'Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);
      const result = await login(username, password);
      setLoading(false);

      if (result.status === 'success' && result.data) {
        await AsyncStorage.setItem('user', JSON.stringify(result.data));
        router.replace('/dashboard');
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    Toast.show({
      type: 'info',
      text1: 'Reset Password',
      text2: 'Please contact the HR department.',
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: bgColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Image source={require('@/assets/logo.png')} style={styles.logo} />
      {/* TODO: Convert dark-logo.svg to component using SVGR if needed */}

      <View>
        <Text style={[styles.welcomeText, { color: textColor }]}>Welcome to HRoS</Text>
        <Text style={[styles.title, { color: textColor }]}>
          Employee Self Service Portal
        </Text>
      </View>

      <TextInput
        placeholder="Employee No"
        placeholderTextColor={subColor}
        value={username}
        onChangeText={setUsername}
        style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: textColor }]}
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={subColor}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, { backgroundColor: isDark ? '#1e1e1e' : '#fff', color: textColor }]}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.loginButton}
        disabled={loading}
      >
        <Text style={styles.loginText}>
          {loading ? 'Logging in...' : 'Login'}
        </Text>
      </TouchableOpacity>

      <Text
        style={[styles.forgotText, { color: subColor }]}
        onPress={handleForgotPassword}
      >
        Forgot Password?
      </Text>

      <View style={styles.socialRow}>
        <TouchableOpacity style={styles.socialIcon}>
          <AntDesign name="google" size={24} color="#DB4437" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <FontAwesome name="linkedin" size={24} color="#0A66C2" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIcon}>
          <MaterialCommunityIcons name="microsoft" size={24} color="#5E5E5E" />
        </TouchableOpacity>
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotText: {
    marginBottom: 24,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 20,
  },
  socialIcon: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
});
