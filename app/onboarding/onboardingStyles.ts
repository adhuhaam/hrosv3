// onboarding/onboardingStyles.ts
import { StyleSheet } from 'react-native';

export const onboardingStyles = StyleSheet.create({
 
  text: { fontSize: 20, textAlign: 'center', marginBottom: 30 },
  
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    lottie: {
      width: 200,
      height: 200,
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 40,
      paddingHorizontal: 10,
    },
    button: {
      backgroundColor: '#007AFF',
      paddingVertical: 14,
      paddingHorizontal: 32,
      borderRadius: 8,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
  
  

});
