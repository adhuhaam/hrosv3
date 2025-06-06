import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function Navbar() {
    const router = useRouter();

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.push('/dashboard')}>
                <Ionicons name="home" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/profile')}>
                <Ionicons name="person" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/leave')}>
                <Ionicons name="calendar" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#006bad',
        paddingVertical: 10,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
});
