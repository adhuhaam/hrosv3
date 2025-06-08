import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('@/assets/animations/server.json')} // Replace with your animation
                autoPlay
                loop
                style={styles.animation}
            />
            <Text style={styles.text}>Connecting...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff', // Or dark if needed
        alignItems: 'center',
        justifyContent: 'center',
    },
    animation: {
        width: 150,
        height: 150,
    },
    text: {
        marginTop: 24,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
});
