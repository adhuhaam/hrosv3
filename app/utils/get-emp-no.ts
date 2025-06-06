import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router';

export function useEmpNo(): string | null {
  const { emp_no } = useLocalSearchParams();
  return typeof emp_no === 'string' ? emp_no : null;
}

export async function resolveEmpNo(): Promise<string | null> {
  const stored = await AsyncStorage.getItem('user');
  return stored ? JSON.parse(stored)?.emp_no || null : null;
}
