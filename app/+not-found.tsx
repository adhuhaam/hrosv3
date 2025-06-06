import { Link, Stack } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '404 - Not Found' }} />
      <View style={styles.container}>
        <LottieView
          source={require('@/assets/animations/404.json')}
          autoPlay
          loop
          style={styles.animation}
        />

        <Text style={styles.title}>Oops! Page not found.</Text>
        <Text style={styles.description}>The screen you’re looking for doesn’t exist.</Text>

        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>← Go to Home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  animation: {
    width: 240,
    height: 240,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    color: '#222',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 300,
  },
  link: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});
