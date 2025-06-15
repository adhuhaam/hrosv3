import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Clear the saved user session.
 *
 * The caller is responsible for navigating after logout
 * to avoid triggering navigation twice.
 */
export const logout = async () => {
  await AsyncStorage.removeItem('user');
};
