// onboarding/onboardingStyles.ts
import { StyleSheet } from 'react-native';

export const onboardingStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  text: { fontSize: 20, textAlign: 'center', marginBottom: 30 },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    color: '#fff',
    fontWeight: '600'
  }
});
