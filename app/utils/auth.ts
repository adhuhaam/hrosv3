import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export const logout = async () => {
  await AsyncStorage.removeItem('user');
  router.replace('/login');
};
